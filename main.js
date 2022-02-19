document.addEventListener('paste', onPaste);

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
  domtoimage.toJpeg(document.getElementById('image')).then(function (blob) {
    window.saveAs(blob, 'my-node.png')
  })
}