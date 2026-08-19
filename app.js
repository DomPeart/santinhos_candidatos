const canvas = document.querySelector('#editorCanvas');
const ctx = canvas.getContext('2d');
const shell = document.querySelector('#canvasShell');
const photoInput = document.querySelector('#photoInput');
const frameInput = document.querySelector('#frameInput');
const emptyState = document.querySelector('#emptyState');
const dragHint = document.querySelector('#dragHint');
const zoomRange = document.querySelector('#zoomRange');
const zoomValue = document.querySelector('#zoomValue');
const resetButton = document.querySelector('#resetButton');
const downloadButton = document.querySelector('#downloadButton');
const defaultFrameButton = document.querySelector('#defaultFrameButton');
const formatButtons = document.querySelectorAll('.format-button');

const formats = {
  feed: { src: 'assets/moldura-julio-cesar.png', width: 1080, height: 1080, filename: 'adesivo-julio-cesar-555.png' },
  story: { src: 'modelo_stories.png', width: 1080, height: 1920, filename: 'to-com-julio-cesar-555-story.png' }
};

const state = { photo: null, frame: null, format: 'feed', baseScale: 1, zoom: 1, x: 0, y: 0, dragging: false, pointerX: 0, pointerY: 0 };

function buildDefaultFrame() {
  const frame = document.createElement('canvas');
  frame.width = frame.height = 1080;
  const f = frame.getContext('2d');
  f.fillStyle = '#082d59'; f.fillRect(0, 0, 1080, 190);
  f.fillStyle = '#ffd52e'; f.fillRect(0, 190, 1080, 22); f.fillRect(0, 920, 1080, 160);
  f.beginPath(); f.moveTo(0, 0); f.lineTo(180, 0); f.lineTo(0, 180); f.closePath(); f.fillStyle = '#27a6df'; f.fill();
  f.textAlign = 'center'; f.fillStyle = '#ffffff'; f.font = '900 76px Arial'; f.fillText('EU APOIO ESSA IDEIA!', 540, 105);
  f.font = '600 28px Arial'; f.fillStyle = '#b8ddf4'; f.fillText('JUNTOS POR UM NOVO CAMINHO', 540, 155);
  f.fillStyle = '#082d59'; f.textAlign = 'left'; f.font = '900 58px Arial'; f.fillText('ANTÔNIO SILVA', 62, 1000);
  f.font = '700 25px Arial'; f.fillText('DEPUTADO • 2026', 65, 1040);
  f.textAlign = 'right'; f.font = '900 80px Arial'; f.fillText('12345', 1015, 1020);
  return frame;
}

function loadDefaultFrame() {
  const format = formats[state.format];
  canvas.width = format.width;
  canvas.height = format.height;
  shell.dataset.format = state.format;
  shell.style.aspectRatio = `${format.width} / ${format.height}`;
  const image = new Image();
  image.onload = () => { state.frame = image; state.photo ? resetPosition() : draw(); };
  image.onerror = () => { state.frame = buildDefaultFrame(); draw(); };
  image.src = format.src;
}

loadDefaultFrame();

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  if (state.format === 'feed') {
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2);
    ctx.clip();
  }
  ctx.fillStyle = '#e6ebef'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (state.photo) {
    const scale = state.baseScale * state.zoom;
    const width = state.photo.width * scale;
    const height = state.photo.height * scale;
    ctx.drawImage(state.photo, state.x - width / 2, state.y - height / 2, width, height);
  }
  if (state.frame) ctx.drawImage(state.frame, 0, 0, canvas.width, canvas.height);
  ctx.restore();
}

function loadImage(file, callback) {
  if (!file) return;
  const url = URL.createObjectURL(file);
  const image = new Image();
  image.onload = () => { callback(image); URL.revokeObjectURL(url); };
  image.onerror = () => { URL.revokeObjectURL(url); alert('Não foi possível abrir esta imagem. Tente outro arquivo.'); };
  image.src = url;
}

function resetPosition() {
  if (!state.photo) return;
  state.baseScale = Math.max(canvas.width / state.photo.width, canvas.height / state.photo.height);
  state.zoom = 1; state.x = canvas.width / 2; state.y = canvas.height / 2;
  zoomRange.value = 100; zoomValue.value = '100%'; draw();
}

photoInput.addEventListener('change', event => loadImage(event.target.files[0], image => {
  state.photo = image; resetPosition(); emptyState.hidden = true; dragHint.hidden = false;
  zoomRange.disabled = resetButton.disabled = downloadButton.disabled = false;
}));

frameInput.addEventListener('change', event => loadImage(event.target.files[0], image => {
  state.frame = image;
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  shell.style.aspectRatio = `${image.naturalWidth} / ${image.naturalHeight}`;
  state.photo ? resetPosition() : draw();
}));

defaultFrameButton.addEventListener('click', () => { frameInput.value = ''; loadDefaultFrame(); });
formatButtons.forEach(button => button.addEventListener('click', () => {
  state.format = button.dataset.format;
  formatButtons.forEach(item => {
    const selected = item === button;
    item.classList.toggle('selected', selected);
    item.setAttribute('aria-pressed', String(selected));
  });
  frameInput.value = '';
  loadDefaultFrame();
}));
zoomRange.addEventListener('input', () => { state.zoom = Number(zoomRange.value) / 100; zoomValue.value = `${zoomRange.value}%`; draw(); });
resetButton.addEventListener('click', resetPosition);

function pointerPosition(event) {
  const rect = canvas.getBoundingClientRect();
  return { x: (event.clientX - rect.left) * canvas.width / rect.width, y: (event.clientY - rect.top) * canvas.height / rect.height };
}

canvas.addEventListener('pointerdown', event => {
  if (!state.photo) return;
  state.dragging = true; canvas.classList.add('dragging'); canvas.setPointerCapture(event.pointerId);
  const point = pointerPosition(event); state.pointerX = point.x; state.pointerY = point.y;
});
canvas.addEventListener('pointermove', event => {
  if (!state.dragging) return;
  const point = pointerPosition(event); state.x += point.x - state.pointerX; state.y += point.y - state.pointerY;
  state.pointerX = point.x; state.pointerY = point.y; draw();
});
function releasePointer() { state.dragging = false; canvas.classList.remove('dragging'); }
canvas.addEventListener('pointerup', releasePointer); canvas.addEventListener('pointercancel', releasePointer);

downloadButton.addEventListener('click', () => {
  draw();
  const link = document.createElement('a');
  link.download = formats[state.format].filename; link.href = canvas.toDataURL('image/png'); link.click();
});

draw();
