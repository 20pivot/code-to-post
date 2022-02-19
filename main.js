const DEFAULT = {
  backgroundInput: '#8A2BE2FF',
  backgroundCodeInput: '#282a36',
  autoExportCheck: true,
}
const SESSION = 'session'
const SESSIONS = 'sessions'
const SESSION_DEFAULT = 'default'

const image = document.getElementById('image')
const frame = document.getElementById('frame')
const backgroundInput = document.getElementById('background-input')
const backgroundCodeInput = document.getElementById('background-code-input')
const autoExportCheck = document.getElementById('auto-export-check')
const exportButton = document.getElementById('export-button')
const sessionSelector = document.getElementById('session-selector')
const sessionNominator = document.getElementById('session-nominator')
const addSessionButton = document.getElementById('add-session')
const infoInside = document.getElementById('info-inside')
const infoOutside = document.getElementById('info-outside')


let config
let session
let sessions
initialize()

sessionSelector.addEventListener('change', changeSession);
sessionNominator.addEventListener('change', changeSessionName);
addSessionButton.addEventListener('click', addSession);
backgroundInput.addEventListener('change', setConfig);
backgroundCodeInput.addEventListener('change', setConfig);
autoExportCheck.addEventListener('change', setConfig);
exportButton.addEventListener('click', exportAsJpg);
document.addEventListener('paste', onPaste);

function initialize() {
  session = getCookie(SESSION)
  if (session) {
    config = getConfig()
  } else {
    session = SESSION_DEFAULT
    setCookie(SESSION, session)
    config = DEFAULT
    setCookie(SESSIONS, SESSION_DEFAULT)
  }

  setConfig(true)

  sessions = new Set((getCookie(SESSIONS) || SESSION_DEFAULT).split(','))
  addSessionsOption()
}

function changeSession(event) {
  session = event.target.value
  config = getConfig()
  setConfig(true)
  setCookie(SESSION, session)
}

function changeSessionName(event) {
  const newSessionName = event.target.value

  const option = document.querySelector(`option[value="${session}"]`)
  option.value = newSessionName
  option.innerHTML = newSessionName

  sessions.delete(session)
  sessions.add(newSessionName)
  setCookie(SESSIONS, Array.from(sessions).toString())

  eraseCookie(session)
  session = newSessionName
  setCookie(SESSION, session)
  saveConfig()

  sessionNominator.value = ''
}

function addSession() {
  const sessionName = window.prompt('Insert new session name')
  if(!sessionName) return

  addSessionOption(sessionName)
  session = sessionName
  saveConfig()
  sessionSelector.value = session

  sessions.add(session)
  setCookie(SESSIONS, Array.from(sessions).toString())
}

function saveConfig() {
  return setCookie(session, JSON.stringify(config))
}

function getConfig() {
  return JSON.parse(getCookie(session))
}

function setConfig(isInitialize) {
  if(isInitialize === true) {
    backgroundInput.value = config.backgroundInput
    backgroundCodeInput.value = config.backgroundCodeInput
    autoExportCheck.checked = config.autoExportCheck
  }

  config.backgroundInput = backgroundInput.value
  config.backgroundCodeInput = backgroundCodeInput.value
  config.autoExportCheck = autoExportCheck.checked

  image.style.backgroundColor = config.backgroundInput
  frame.style.backgroundColor = config.backgroundCodeInput

  saveConfig()
}

function onPaste(event) {
  const clipboardItems = event.clipboardData.items;
  const items = Array.from(clipboardItems).filter(function (item) {
    return item.type.includes('image');
  });
  if (items.length === 0) {
    return;
  }

  const item = items[0];
  const blob = item.getAsFile();

  const imageUrl = window.URL.createObjectURL(blob);
  document.getElementById('code').src = imageUrl;

  infoInside.hidden = true
  infoOutside.hidden = false
  if(config.autoExportCheck) {
    setTimeout(() => exportAsJpg(), 500)
  }
}

function exportAsJpg() {
  domtoimage.toJpeg(image).then(function (blob) {
    window.saveAs(blob, 'my-node.png')
  })
}

function addSessionsOption() {
  const sessionSelected = session
  for(let session of sessions) {
    addSessionOption(session)
  }
  sessionSelector.value = sessionSelected
}

function addSessionOption(session) {
  const opt = document.createElement('option');
  opt.value = session;
  opt.innerHTML = session;
  sessionSelector.appendChild(opt);
}
