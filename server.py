import itertools
import json
import os
import queue
import threading
import time
import traceback

import httpx
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

import pipeline

app = FastAPI()
jobs: dict[str, dict] = {}  # key: "<video id>:<model>"
lock = threading.Lock()     # endpoints run in a thread pool; guard `jobs` and result.json writes
work: queue.Queue[tuple[str, str, str]] = queue.Queue()
order = itertools.count(1)  # FIFO ticket per job, for an honest queue position


def worker():
    # One job at a time: separation saturates the CPU anyway.
    while True:
        key, url, model = work.get()
        job = jobs[key]
        if job["stage"] == "cancelled":
            continue
        job["stage"], job["stageStarted"] = "starting", time.time()

        def report(stage, progress, **info):
            # Progress reports arrive every second or two in every stage: the place to honour "Cancel".
            if job.get("cancel"):
                raise pipeline.Cancelled()
            if stage != job.get("stage"):
                job["stageStarted"] = time.time()
            job.update(info, stage=stage, progress=progress)

        try:
            job["result"] = pipeline.process(url, model, report)
            job["title"] = job["result"]["title"]
            job["stage"], job["finished"] = "done", time.time()
        except BaseException as e:  # never let the worker die: queued jobs would wait forever
            if job.get("cancel"):  # yt-dlp may wrap our exception in its own: the flag is what counts
                pipeline.clean_up_cancelled(key.split(":")[0])
                job["stage"], job["error"] = "cancelled", "Cancelled"
            else:
                traceback.print_exc()
                job["stage"], job["error"] = "error", str(e) or e.__class__.__name__
        finally:
            with lock:
                save_queue()


# The queue survives a restart (closing the app, a crash): what's waiting or running is written to
# queue.json and picked up again on the next start. A song that was mid-way keeps what it already
# finished: the download, and the lyrics; only a half-done separation starts over.
QUEUE_FILE = pipeline.DATA / "queue.json"


def save_queue():
    """Call with `lock` held."""
    pending = sorted((j for j in jobs.values()
                      if j["stage"] not in ("done", "error", "cancelled") and not j.get("cancel") and j.get("url")),
                     key=lambda j: j["seq"])
    try:
        pipeline.write_json(QUEUE_FILE, [{"url": j["url"], "model": j["model"], "title": j.get("title")}
                                         for j in pending])
    except OSError:
        traceback.print_exc()


def restore_queue():
    try:
        saved = json.loads(QUEUE_FILE.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return
    for item in saved if isinstance(saved, list) else []:
        url, model = item.get("url") or "", item.get("model")
        vid = pipeline.video_id(url)
        if not vid or model not in pipeline.SEPARATION_MODELS or f"{vid}:{model}" in jobs:
            continue
        key = f"{vid}:{model}"
        jobs[key] = {"stage": "queued", "progress": None, "stageStarted": time.time(), "seq": next(order),
                     "id": vid, "model": model, "title": item.get("title"), "url": url}
        work.put((key, url, model))


pipeline.DATA.mkdir(parents=True, exist_ok=True)
pipeline.apply_pending_move()
pipeline.migrate_legacy()
restore_queue()
threading.Thread(target=worker, daemon=True).start()


class JobIn(BaseModel):
    url: str
    model: str = pipeline.DEFAULT_MODEL
    title: str | None = None  # known from search results, so the queue can show it before download


_search_cache: dict[str, tuple[float, list]] = {}


@app.get("/api/search")
def search(q: str):
    q = q.strip()
    if not q:
        return []
    key = q.lower()
    hit = _search_cache.get(key)
    if not hit or time.time() - hit[0] > 3600:
        try:
            hit = (time.time(), pipeline.search(q))
        except Exception as e:
            raise HTTPException(502, f"YouTube search failed: {str(e)[:200]}")
        _search_cache[key] = hit
        if len(_search_cache) > 200:
            _search_cache.pop(next(iter(_search_cache)))
    in_library = {p.parent.name: pipeline.available_stems(p.parent) for p in pipeline.DATA.glob("*/result.json")}
    return [{**r, "stems": in_library.get(r["id"], [])} for r in hit[1]]


@app.get("/api/models")
def models():
    return {"default": pipeline.DEFAULT_MODEL,
            "models": [{"key": k, **{f: v[f] for f in ("name", "desc", "speed")}}
                       for k, v in pipeline.SEPARATION_MODELS.items()]}


@app.post("/api/jobs")
def create_job(body: JobIn):
    vid = pipeline.video_id(body.url)
    if not vid:
        raise HTTPException(400, "That doesn't look like a YouTube link")
    if body.model not in pipeline.SEPARATION_MODELS:
        raise HTTPException(400, "Unknown separation model")
    key = f"{vid}:{body.model}"
    with lock:
        job = jobs.get(key)
        if job and job["stage"] not in ("error", "done", "cancelled"):
            return {"id": vid, "model": body.model}
        result = pipeline.load_result(vid)
        if result and body.model in result["stems"]:
            jobs[key] = {"stage": "done", "result": result, "id": vid, "model": body.model,
                         "title": result["title"], "finished": time.time()}
        else:
            jobs[key] = {"stage": "queued", "progress": None, "stageStarted": time.time(), "seq": next(order),
                         "id": vid, "model": body.model, "title": body.title, "url": body.url}
            work.put((key, body.url, body.model))
            save_queue()
    return {"id": vid, "model": body.model}


@app.get("/api/jobs")
def list_jobs():
    """The processing queue: everything waiting or running, plus what finished in the last 10 minutes."""
    now = time.time()
    with lock:
        out = []
        for j in jobs.values():
            if j["stage"] == "done" and now - j.get("finished", 0) > 600:
                continue
            if j["stage"] == "done" and j.get("seq") is None:
                continue  # opened from the library, never queued
            out.append({k: j.get(k) for k in ("id", "model", "title", "stage", "progress", "stageStarted",
                                               "seq", "error", "finished", "cancel")})
    out.sort(key=lambda j: (j["stage"] == "done", j["stage"] == "error", j.get("seq") or 0))
    return {"now": now, "jobs": out}


@app.delete("/api/jobs/{vid}/{model}")
def dismiss_job(vid: str, model: str):
    """Cancel a job (queued: right away; processing: within a few seconds), or clear a finished one."""
    with lock:
        job = jobs.get(f"{vid}:{model}")
        if not job:
            raise HTTPException(404)
        if job["stage"] == "queued":
            job["stage"], job["error"] = "cancelled", "Removed from the queue"
            save_queue()
        elif job["stage"] in ("done", "error", "cancelled"):
            jobs.pop(f"{vid}:{model}")
        else:
            job["cancel"] = True  # the worker stops at its next progress report
            save_queue()
            return {"ok": True, "cancelling": True}
    return {"ok": True}


@app.get("/api/jobs/{vid}/{model}")
def get_job(vid: str, model: str):
    with lock:
        job = jobs.get(f"{vid}:{model}")
        if not job:
            raise HTTPException(404, "Job not found (the server may have restarted)")
        ahead = 0
        if job["stage"] == "queued":
            # Everything queued earlier, plus the one being processed right now.
            ahead = sum(1 for j in jobs.values()
                        if j is not job and j["stage"] not in ("done", "error", "cancelled")
                        and (j["stage"] != "queued" or j["seq"] < job["seq"]))
        snapshot = dict(job)
    return {"queuePos": ahead, "now": time.time(), **snapshot}


_melody_locks: dict[str, threading.Lock] = {}


@app.get("/api/songs/{vid}/melody")
def song_melody(vid: str):
    """The original singer's melody, for arcade-mode scoring. Computed once (~15-40 s), then cached."""
    if not pipeline.video_id(vid):
        raise HTTPException(404)
    with lock:
        song_lock = _melody_locks.setdefault(vid, threading.Lock())
    with song_lock:  # two tabs asking at once compute it only once
        data = pipeline.melody_for(vid)
    if data is None:
        raise HTTPException(404, "This song hasn't been processed yet")
    return data


_video_fetching: set[str] = set()


def _fetch_video_bg(vid: str):
    try:
        pipeline.fetch_video(vid, pipeline.DATA / vid)
    finally:
        with lock:
            _video_fetching.discard(vid)


@app.get("/api/songs/{vid}/video")
def song_video(vid: str):
    if not pipeline.video_id(vid) or not (pipeline.DATA / vid).is_dir():
        raise HTTPException(404)
    v = pipeline.video_file(pipeline.DATA / vid)
    return {"video": v.name if v else None, "fetching": vid in _video_fetching}


@app.post("/api/songs/{vid}/video")
def fetch_song_video(vid: str):
    """Songs processed before videos were downloaded get their picture in the background."""
    if not pipeline.video_id(vid) or not (pipeline.DATA / vid).is_dir():
        raise HTTPException(404)
    with lock:
        if pipeline.video_file(pipeline.DATA / vid) is None and vid not in _video_fetching:
            _video_fetching.add(vid)
            threading.Thread(target=_fetch_video_bg, args=(vid,), daemon=True).start()
    return song_video(vid)


class OffsetIn(BaseModel):
    offset: float


@app.post("/api/songs/{vid}/offset")
def save_offset(vid: str, body: OffsetIn):
    """Remember a manually corrected lyric offset for next time."""
    path = pipeline.DATA / vid / "result.json"
    with lock:
        if not path.exists():
            raise HTTPException(404)
        data = json.loads(path.read_text(encoding="utf-8"))
        data["offset"] = round(body.offset, 2)
        pipeline.write_json(path, data)
        for key, job in list(jobs.items()):
            if key.startswith(vid + ":") and "result" in job:
                job["result"]["offset"] = data["offset"]
    return {"ok": True}


def _song_paths(vid: str):
    out = pipeline.DATA / vid
    if not pipeline.video_id(vid) or not (out / "result.json").exists() or not (out / "meta.json").exists():
        raise HTTPException(404, "This song hasn't been processed yet")
    return out / "result.json", out / "meta.json"


@app.get("/api/songs/{vid}/lyrics")
def lyric_options(vid: str, q: str | None = None):
    """The LRCLIB versions to choose from (or a free-text search with `q`)."""
    result_path, meta_path = _song_paths(vid)
    result = json.loads(result_path.read_text(encoding="utf-8"))
    meta = json.loads(meta_path.read_text(encoding="utf-8"))
    artist, title = pipeline.guess_artist_title(meta)
    try:
        candidates = pipeline.lrclib_candidates(artist, title, meta["duration"], (q or "").strip() or None)
    except httpx.HTTPError:
        raise HTTPException(502, "Couldn't reach LRCLIB")
    return {"query": f"{artist} {title}", "duration": meta["duration"], "current": result.get("lrclibId"),
            "source": result.get("source"), "autoSync": result.get("autoSync", True), "candidates": candidates}


class LyricsIn(BaseModel):
    source: str               # "lrclib" or "whisper"
    id: int | None = None     # LRCLIB lyrics id
    autoSync: bool = True     # shift the LRCLIB timings to match the vocals, or keep them as they are


@app.post("/api/songs/{vid}/lyrics")
def set_lyrics(vid: str, body: LyricsIn):
    """Swap the lyrics of a processed song. Whisper takes a few minutes; LRCLIB a second or two."""
    result_path, _ = _song_paths(vid)
    try:
        update = pipeline.choose_lyrics(vid, body.source, body.id, body.autoSync)
    except ValueError as e:
        raise HTTPException(400, str(e))
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            raise HTTPException(400, "Those lyrics aren't on LRCLIB anymore")
        raise HTTPException(502, "LRCLIB had a problem, try again in a moment")
    except httpx.HTTPError:
        raise HTTPException(502, "Couldn't reach LRCLIB")
    with lock:
        data = json.loads(result_path.read_text(encoding="utf-8"))
        data.update(update)
        pipeline.write_json(result_path, data)
        for key, job in list(jobs.items()):
            if key.startswith(vid + ":") and "result" in job:
                job["result"] = {**job["result"], **update}
    return pipeline.load_result(vid)


@app.get("/api/storage")
def storage():
    chosen = pipeline.read_config().get("dataDir")
    return {"path": str(pipeline.DATA), "default": str(pipeline.DEFAULT_DATA),
            "next": chosen or str(pipeline.DEFAULT_DATA)}


class StorageIn(BaseModel):
    path: str = ""     # empty: back to the default folder
    move: bool = True  # move the songs that are already there


@app.post("/api/storage")
def set_storage(body: StorageIn):
    """Choose where songs are kept. Takes effect (and moves the songs) on the next start."""
    raw = body.path.strip().strip('"')
    target = pipeline.Path(os.path.expandvars(os.path.expanduser(raw))) if raw else pipeline.DEFAULT_DATA
    if not target.is_absolute():
        raise HTTPException(400, "Use a full folder path, like D:\\Karaoke")
    current, new = pipeline.DATA.resolve(), target.resolve()
    if body.move and new != current and (current in new.parents or new in current.parents):
        raise HTTPException(400, "Pick a folder that isn't inside the current one (or the other way round)")
    try:
        target.mkdir(parents=True, exist_ok=True)
        probe = target / ".stagelight-write-test"
        probe.write_text("ok")
        probe.unlink()
    except OSError as e:
        raise HTTPException(400, f"Can't use that folder: {e.strerror or e}")
    cfg = pipeline.read_config()
    cfg.pop("dataDir", None)
    if raw:
        cfg["dataDir"] = str(target)
    cfg.pop("moveFrom", None)
    if body.move and new != current:
        cfg["moveFrom"] = str(pipeline.DATA)
    pipeline.write_json(pipeline.CONFIG, cfg)
    return {"path": str(target), "restart": new != current}


class LangIn(BaseModel):
    lang: str


@app.post("/api/lang")
def set_lang(body: LangIn):
    """Remember the interface language for the desktop app's own screens and menus."""
    with lock:
        cfg = pipeline.read_config()
        cfg["lang"] = body.lang if body.lang in ("en", "es") else "auto"
        pipeline.write_json(pipeline.CONFIG, cfg)
    return {"ok": True}


STATIC = pipeline.Path(__file__).parent / "static"


@app.get("/api/library")
def library():
    items = []
    for p in sorted(pipeline.DATA.glob("*/result.json"), key=lambda p: -p.stat().st_mtime):
        try:
            d = pipeline.load_result(p.parent.name)
        except (OSError, ValueError):  # being written right now; it'll show up next time
            continue
        if d and d["stems"]:
            items.append({"id": d["id"], "artist": d["artist"], "title": d["title"], "stems": d["stems"],
                          "source": d["source"]})
    return items


app.mount("/media", StaticFiles(directory=pipeline.DATA), name="media")
app.mount("/", StaticFiles(directory=STATIC, html=True), name="static")
