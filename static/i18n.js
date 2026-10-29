// Interface language. The English text lives in the code and doubles as the key: other languages
// map it to a translation, so anything missing simply shows in English. "{name}" marks a value
// filled in at runtime. The choice is the "lang" setting ("auto" follows the system language).
const LANGS = { en: "English", es: "Español" };

const STRINGS = {
  es: {
    // ---- home, search, library
    "Sing": "Canta",
    "anything.": "lo que quieras.",
    "Search for a song or paste a YouTube link. We strip the vocals, find the lyrics and sync them to the music video.":
      "Busca una canción o pega un enlace de YouTube. Quitamos la voz, buscamos la letra y la sincronizamos con el videoclip.",
    "Search": "Buscar",
    "Search a song, or paste a YouTube link": "Busca una canción o pega un enlace de YouTube",
    "Make it karaoke": "Hacer karaoke",
    "Vocal removal:": "Quitar voz:",
    "How the vocals are removed: change it any time in Settings": "Cómo se quita la voz: puedes cambiarlo cuando quieras en Ajustes",
    "Vocal separation model": "Modelo de separación de voz",
    "Results": "Resultados",
    "Results for “{q}”": "Resultados de “{q}”",
    "Clear": "Borrar",
    "Your library": "Tu biblioteca",
    "Library": "Biblioteca",
    "Search songs or artists ( / )": "Buscar canciones o artistas ( / )",
    "Search your library": "Buscar en tu biblioteca",
    "No songs match “": "Ninguna canción coincide con “",
    "Search failed": "La búsqueda falló",
    "Nothing found. Try the artist and song title.": "No se encontró nada. Prueba con el artista y el título.",
    "In library": "En la biblioteca",
    "▶ Sing now": "▶ Cantar ya",
    "▶ Sing": "▶ Cantar",
    "+ Queue": "+ Cola",
    "Settings (S)": "Ajustes (S)",
    "Something went wrong": "Algo salió mal",

    // ---- processing
    "Preparing your track": "Preparando tu canción",
    "Loading…": "Cargando…",
    "Download audio": "Descargar audio",
    "Remove vocals": "Quitar la voz",
    "Find lyrics": "Buscar la letra",
    "Sync to video": "Sincronizar con el video",
    "Keep going in background": "Seguir en segundo plano",
    "Cancel": "Cancelar",
    "Close (Esc). Processing keeps going; the song appears in your library when it's ready":
      "Cerrar (Esc). El proceso sigue; la canción aparecerá en tu biblioteca cuando esté lista",
    "Processing continues; the song appears in your library when it's ready":
      "El proceso sigue; la canción aparecerá en tu biblioteca cuando esté lista",
    "Stop processing this song": "Dejar de procesar esta canción",
    "Try again": "Reintentar",
    "Lost connection to the Stagelight server. Is it still running?":
      "Se perdió la conexión con el servidor de Stagelight. ¿Sigue en marcha?",
    "Processing cancelled.": "Proceso cancelado.",
    "Fetching video…": "Obteniendo el video…",
    "Waiting": "Esperando",
    "Cancelling…": "Cancelando…",
    "Waiting for 1 other song…": "Esperando a 1 canción más…",
    "Waiting for {n} other songs…": "Esperando a {n} canciones más…",
    "Starting…": "Empezando…",
    "{name} model": "modelo {name}",
    "Saving the instrumental…": "Guardando el instrumental…",
    " · about {time} left": " · quedan unos {time}",
    " · loading model": " · cargando el modelo",
    "No lyrics online, listening for the words with Whisper…": "No hay letra en internet; escuchando la voz con Whisper…",

    // ---- queue
    "Queue": "Cola",
    "Processing queue": "Cola de procesamiento",
    "Waiting · {n} ahead": "En espera · {n} delante",
    "Up next": "La siguiente",
    "Downloading…": "Descargando…",
    "Removing vocals {pct}%": "Quitando la voz {pct} %",
    " · {time} left": " · quedan {time}",
    "Saving…": "Guardando…",
    "Finding lyrics…": "Buscando la letra…",
    "Transcribing lyrics…": "Transcribiendo la letra…",
    "Ready to sing": "Lista para cantar",
    "Removed": "Quitada",
    "Failed": "Falló",
    "Processing · {n}": "Procesando · {n}",
    "Queue · all done": "Cola · todo listo",
    "Fetching title…": "Obteniendo el título…",
    "Retry": "Reintentar",
    "View": "Ver",
    "Remove from queue": "Quitar de la cola",
    "Cancel processing": "Cancelar el proceso",

    // ---- player
    "Play (Space)": "Reproducir (Espacio)",
    "Seek": "Posición",
    "Mix the original vocal back in: 0% is pure karaoke": "Mezcla de la voz original: 0 % es karaoke puro",
    "Vocal level": "Nivel de la voz",
    "Sync": "Sincro",
    "Lyrics early or late? Nudge them ( [ and ] )": "¿La letra va adelantada o atrasada? Ajústala ( [ y ] )",
    "Show lyrics earlier": "Mostrar la letra antes",
    "Show lyrics later": "Mostrar la letra después",
    "Arcade: sing into the microphone and score points (A)": "Arcade: canta al micrófono y suma puntos (A)",
    "Fullscreen (F)": "Pantalla completa (F)",
    "Lyrics from LRCLIB": "Letra de LRCLIB",
    "Lyrics transcribed by Whisper": "Letra transcrita con Whisper",
    "No lyrics": "Sin letra",
    "No lyrics found. Enjoy the instrumental 🎶": "No se encontró la letra. Disfruta del instrumental 🎶",
    "♪ Lyrics in {time}": "♪ Letra en {time}",
    "Open in your browser": "Abrir en tu navegador",
    "YouTube won't play this video here, so its cover is the backdrop. The karaoke works the same.":
      "YouTube no deja reproducir este video aquí, así que de fondo se ve la portada. El karaoke funciona igual.",
    "YouTube didn't play the video here (it may want you to sign in), so its cover is the backdrop. The karaoke works the same.":
      "YouTube no reprodujo el video aquí (puede que pida iniciar sesión), así que de fondo se ve la portada. El karaoke funciona igual.",

    // ---- arcade
    "Score": "Puntos",
    "Microphone level": "Nivel del micrófono",
    "Can't hear you. Sing up!": "No te oigo. ¡Canta más fuerte!",
    "On pitch": "Afinación",
    "Best combo": "Mejor combo",
    "Perfect lines": "Frases perfectas",
    "Rank": "Rango",
    "Stars": "Estrellas",
    "Sing it again": "Cantar otra vez",
    "Close": "Cerrar",
    "Perfect": "Perfecto",
    "Great": "Genial",
    "Good": "Bien",
    "Miss": "Fallo",
    "New best!": "¡Nuevo récord!",
    "First score!": "¡Primera puntuación!",
    "Best: {n}": "Récord: {n}",
    "Arcade needs a real song. Pick one from your library.": "El arcade necesita una canción de verdad. Elige una de tu biblioteca.",
    "This browser can't use the microphone here.": "Este navegador no puede usar el micrófono aquí.",
    "Arcade needs your microphone. Allow it for Stagelight in your browser or system settings, then try again.":
      "El arcade necesita tu micrófono. Permite que Stagelight lo use en los ajustes del navegador o del sistema y vuelve a intentarlo.",
    "Arcade on: sing along and hit the notes! Headphones give the most accurate score.":
      "Arcade activado: ¡canta y acierta las notas! Con auriculares la puntuación es más precisa.",
    "Getting the melody ready. The first time takes about half a minute…":
      "Preparando la melodía. La primera vez tarda como medio minuto…",
    "Couldn't get the melody for this song, so arcade isn't available for it.":
      "No se pudo obtener la melodía de esta canción, así que no hay arcade para ella.",

    // ---- settings
    "Settings": "Ajustes",
    "Close (Esc)": "Cerrar (Esc)",
    "Preview": "Vista previa",
    "and every word lights up for you": "y cada palabra se ilumina para ti",
    "Sing along with the stage lights": "Canta bajo las luces del escenario",
    "Lyrics": "Letra",
    "Text size": "Tamaño del texto",
    "Font": "Fuente",
    "Modern": "Moderna",
    "Rounded": "Redondeada",
    "Poster": "Cartel",
    "Classic": "Clásica",
    "Highlight style": "Estilo de resaltado",
    "Wipe": "Barrido",
    "Pop": "Salto",
    "Glow": "Brillo",
    "Line": "Línea",
    "Colour sweeps through each word": "El color recorre cada palabra",
    "Each word jumps as it is sung": "Cada palabra salta al cantarla",
    "Wipe with a neon glow": "Barrido con brillo de neón",
    "Whole line lights up at once": "Toda la línea se ilumina a la vez",
    "Highlight colour": "Color de resaltado",
    "Gold": "Dorado",
    "Pink": "Rosa",
    "Cyan": "Cian",
    "Lime": "Lima",
    "Violet": "Violeta",
    "Orange": "Naranja",
    "Lines on screen": "Líneas en pantalla",
    "Current": "Actual",
    "+ Next": "+ Siguiente",
    "All three": "Las tres",
    "+3 ahead": "+3 siguientes",
    "Also show the next three lines: handy for fast songs": "Muestra también las tres líneas siguientes: útil en canciones rápidas",
    "Position": "Posición",
    "Bottom": "Abajo",
    "Center": "Centro",
    "Bouncing ball": "Pelota que rebota",
    "Countdown before verses": "Cuenta atrás antes de cada estrofa",
    "Video": "Video",
    "Show the music video": "Mostrar el videoclip",
    "Dim video": "Oscurecer el video",
    "Blur video": "Desenfocar el video",
    "Audio": "Audio",
    "Music volume": "Volumen de la música",
    "Arcade difficulty": "Dificultad del arcade",
    "Easy": "Fácil",
    "Hard": "Difícil",
    "Within 2 semitones counts": "Vale con 2 semitonos de margen",
    "Within about a semitone": "Con un semitono de margen, más o menos",
    "Within half a semitone": "Con medio semitono de margen",
    "Mic delay (arcade)": "Retardo del micro (arcade)",
    "Microphones and speakers add a little delay; raise this if you're always scored late":
      "Micrófonos y altavoces añaden algo de retardo; súbelo si siempre te puntúa tarde",
    "Language": "Idioma",
    "Auto": "Automático",
    "Follow the system language": "Usar el idioma del sistema",
    "Shortcuts": "Atajos",
    "Space": "Espacio",
    "Play / pause": "Reproducir / pausa",
    "Back / forward 5 s": "Atrás / adelante 5 s",
    "Lyrics earlier / later": "Letra antes / después",
    "Fullscreen": "Pantalla completa",
    "Reset to defaults": "Restablecer ajustes",

    // ---- settings: separation models (names and descriptions come from the server)
    "Vocal separation": "Separación de voz",
    "Used for new songs. On this song you can switch to a model that's already processed, or process it again with another one.":
      "Se usa en las canciones nuevas. En esta canción puedes cambiar a un modelo ya procesado o procesarla de nuevo con otro.",
    "● Playing on this song": "● Sonando en esta canción",
    "Switch to this": "Cambiar a este",
    "ready, instant": "listo, al instante",
    "Process this song": "Procesar esta canción",
    "Clean instrumental": "Instrumental limpio",
    "High quality": "Alta calidad",
    "Roformer clean": "Roformer limpio",
    "Removes the lead vocal, keeps backing vocals.": "Quita la voz principal y mantiene los coros.",
    "Removes every vocal, including harmonies.": "Quita todas las voces, también los coros.",
    "Cleanest instrumental with fewer artefacts.": "El instrumental más limpio, con menos defectos.",
    "Best lead-vocal removal, keeps backing vocals. Needs a GPU to be quick.":
      "La mejor para quitar la voz principal; mantiene los coros. Necesita GPU para ir rápido.",
    "Best full vocal removal. Needs a GPU to be quick.": "La mejor para quitar todas las voces. Necesita GPU para ir rápido.",
    "Fast": "Rápido",
    "Slow": "Lento",
    "Very slow on CPU": "Muy lento en CPU",

    // ---- settings: lyrics source
    "Lyrics for this song": "Letra de esta canción",
    "Artist and song title": "Artista y título",
    "Search for lyrics": "Buscar letras",
    "Auto-sync to the vocals": "Sincronizar automáticamente con la voz",
    "On: shift the lyrics to line up with the singing in this video. Off: use the timings exactly as they come from LRCLIB.":
      "Activado: desplaza la letra para que cuadre con el canto de este video. Desactivado: usa los tiempos tal cual vienen de LRCLIB.",
    "Transcribe with Whisper instead (slow)": "Transcribir con Whisper (lento)",
    "No lyrics yet.": "Todavía no hay letra.",
    "Now using: a Whisper transcription of the vocals.": "En uso: una transcripción de la voz hecha con Whisper.",
    "Now using: LRCLIB lyrics with their original timing.": "En uso: letra de LRCLIB con sus tiempos originales.",
    "Now using: LRCLIB lyrics, auto-synced to the vocals.": "En uso: letra de LRCLIB, sincronizada automáticamente con la voz.",
    "Looking for lyrics…": "Buscando letras…",
    "No timed lyrics found on LRCLIB. Try another search, or Whisper.":
      "No hay letras sincronizadas en LRCLIB. Prueba otra búsqueda o Whisper.",
    "Couldn't load the lyrics list: {error}": "No se pudo cargar la lista de letras: {error}",
    "Same length as the video": "Misma duración que el video",
    "Length difference from the video": "Diferencia de duración con el video",
    "Listening with Whisper… this can take a few minutes.": "Escuchando con Whisper… puede tardar unos minutos.",
    "Loading lyrics…": "Cargando la letra…",
    "Lyrics transcribed by Whisper.": "Letra transcrita con Whisper.",
    "Lyrics changed.": "Letra cambiada.",
    "Couldn't change the lyrics: {error}": "No se pudo cambiar la letra: {error}",

    // ---- settings: song storage
    "Song storage": "Carpeta de canciones",
    "Where downloaded songs are kept. Takes effect after a restart.":
      "Dónde se guardan las canciones descargadas. Se aplica al reiniciar.",
    "Song folder": "Carpeta de canciones",
    "Save": "Guardar",
    "Move my songs to the new folder": "Mover mis canciones a la nueva carpeta",
    "Waiting for a restart. Songs are still in {path}.": "Pendiente de reiniciar. Las canciones siguen en {path}.",
    "Checking the folder…": "Comprobando la carpeta…",
    "That's already the song folder.": "Esa ya es la carpeta de canciones.",
    "Saved. Restarting Stagelight…": "Guardado. Reiniciando Stagelight…",
    "Saved. Restart Stagelight to start using the new folder.": "Guardado. Reinicia Stagelight para usar la nueva carpeta.",

    // ---- messages from the server
    "That doesn't look like a YouTube link": "Eso no parece un enlace de YouTube",
    "Unknown separation model": "Modelo de separación desconocido",
    "Videos longer than 15 minutes and livestreams aren't supported": "No se admiten videos de más de 15 minutos ni directos",
    "Job not found (the server may have restarted)": "No se encontró la tarea (puede que el servidor se haya reiniciado)",
    "This song hasn't been processed yet": "Esta canción aún no se ha procesado",
    "Couldn't reach LRCLIB": "No se pudo conectar con LRCLIB",
    "Those lyrics aren't on LRCLIB anymore": "Esa letra ya no está en LRCLIB",
    "LRCLIB had a problem, try again in a moment": "LRCLIB tuvo un problema; inténtalo de nuevo en un momento",
    "Pick which lyrics to use": "Elige qué letra usar",
    "Those lyrics have no timings": "Esa letra no tiene tiempos",
    "This song has no separated vocals to listen to": "Esta canción no tiene la voz separada para escucharla",
    "Use a full folder path, like D:\\Karaoke": "Usa la ruta completa de la carpeta, como D:\\Karaoke",
    "Pick a folder that isn't inside the current one (or the other way round)":
      "Elige una carpeta que no esté dentro de la actual (ni al revés)",
    "Removed from the queue": "Quitada de la cola",
    "Cancelled": "Cancelada",
    // Messages that start with these keep the rest (the technical detail) as it is.
    "Couldn't download from YouTube: ": "No se pudo descargar de YouTube: ",
    "YouTube search failed: ": "La búsqueda en YouTube falló: ",
    "Can't use that folder: ": "No se puede usar esa carpeta: ",
  },
};

const LANG = (() => {
  let pref = "auto";
  try { pref = JSON.parse(localStorage.getItem("stagelight.settings"))?.lang || "auto"; } catch {}
  if (LANGS[pref]) return pref;
  return /^es\b/i.test(navigator.language || "") ? "es" : "en";
})();
document.documentElement.lang = LANG;

function t(text, vars) {
  if (typeof text !== "string") return text;
  const table = STRINGS[LANG];
  let out = text;
  if (table) {
    if (table[text] != null) out = table[text];
    else {
      // "Prefix: detail" messages from the server: translate the prefix, keep the detail.
      const i = text.indexOf(": ");
      if (i > 0 && table[text.slice(0, i + 2)] != null) out = table[text.slice(0, i + 2)] + text.slice(i + 2);
    }
  }
  return vars ? out.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m)) : out;
}

// The page's own markup: translate text and a few attributes wherever they match an entry.
function translatePage(root = document.body) {
  const table = STRINGS[LANG];
  if (!table) return;
  const key = (s) => s.replace(/\s+/g, " ").trim();
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (n.parentElement?.closest("script, style")) continue;
    const k = key(n.nodeValue);
    if (k && table[k] != null) {
      const [, lead, , trail] = n.nodeValue.match(/^(\s*)([\s\S]*?)(\s*)$/);
      n.nodeValue = lead + table[k] + trail;
    }
  }
  for (const el of root.querySelectorAll("[title], [placeholder], [aria-label]")) {
    for (const attr of ["title", "placeholder", "aria-label"]) {
      const v = el.getAttribute(attr);
      if (v && table[key(v)] != null) el.setAttribute(attr, table[key(v)]);
    }
  }
}
translatePage();
