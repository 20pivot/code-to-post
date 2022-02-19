const DEFAULT = {
  backgroundInput: '#8A2BE2FF',
  backgroundCodeInput: '#282a36',
  autoExportCheck: true,
}
const SESSION = 'session'
const SESSION_DEFAULT = 'default'

const image = document.getElementById('image')
const frame = document.getElementById('frame')
const backgroundInput = document.getElementById('background-input')
const backgroundCodeInput = document.getElementById('background-code-input')
const autoExportCheck = document.getElementById('auto-export-check')
const exportButton = document.getElementById('export-button')


let config
let session
initialize()

backgroundInput.addEventListener('change', setConfig);
backgroundCodeInput.addEventListener('change', setConfig);
autoExportCheck.addEventListener('change', setConfig);
exportButton.addEventListener('click', exportAsJpg);
document.addEventListener('paste', onPaste);

function initialize() {
  session = getCookie(SESSION)
  if (session) {
    config = getConfig(session)
  } else {
    session = SESSION_DEFAULT
    setCookie(SESSION, session)
    config = DEFAULT
  }

  setConfig(true)
}

function saveConfig(session) {
  return setCookie(session, JSON.stringify(config))
}

function getConfig(session) {
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

  saveConfig(session)
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

  if(config.autoExportCheck) {
    setTimeout(() => exportAsJpg(), 500)
  }
}

function exportAsJpg() {
  domtoimage.toJpeg(image).then(function (blob) {
    window.saveAs(blob, 'my-node.png')
  })
}

