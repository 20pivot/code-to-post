const DEFAULT = {
  backgroundInput: '#8A2BE2FF',
  backgroundCodeInput: '#282a36',
}
const SESSION = 'session'

const image = document.getElementById('image')
const frame = document.getElementById('frame')
const backgroundInput = document.getElementById('background-input')
const backgroundCodeInput = document.getElementById('background-code-input')


let config
let session
initialize()

backgroundInput.addEventListener('change', setConfig);
backgroundCodeInput.addEventListener('change', setConfig);
document.addEventListener('paste', onPaste);

function initialize() {
  session = getCookie(SESSION)
  if (session) {
    config = getConfig(session)
  } else {
    session = 'default'
    setCookie(SESSION, session)
    config = DEFAULT
  }

  setConfig()
}

function saveConfig(session) {
  return setCookie(session, JSON.stringify(config))
}

function getConfig(session) {
  return JSON.parse(getCookie(session))
}

function setConfig() {
  backgroundInput.value = backgroundInput.value || config.backgroundInput
  backgroundCodeInput.value = backgroundCodeInput.value || config.backgroundCodeInput

  config.backgroundInput = backgroundInput.value
  config.backgroundCodeInput = backgroundCodeInput.value

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

  setTimeout(() => exportAsJpg(), 500)
}

function exportAsJpg() {
  domtoimage.toJpeg(image).then(function (blob) {
    window.saveAs(blob, 'my-node.png')
  })
}

