const image = document.getElementById('image')
const frame = document.getElementById('frame')
const backgroundInput = document.getElementById('background-input')
const backgroundCodeInput = document.getElementById('background-code-input')

const DEFAULT = {
  backgroundInput: '#8A2BE2FF',
  backgroundCodeInput: '#282a36',
}

initialize()
backgroundInput.addEventListener('change', setConfig);
backgroundCodeInput.addEventListener('change', setConfig);
document.addEventListener('paste', onPaste);

function initialize() {
  backgroundInput.value = DEFAULT.backgroundInput
  backgroundCodeInput.value = DEFAULT.backgroundCodeInput

  setConfig()
}

function setConfig() {
  image.style.backgroundColor = backgroundInput.value
  frame.style.backgroundColor = backgroundCodeInput.value
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

