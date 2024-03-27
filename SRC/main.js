const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const a = 2 * Math.PI / 6;
const r = 25;

// Initialize variables to store highlighted hexagon position
let highlightedHexagon = null;

function init() {
  drawGrid(canvas.width, canvas.height);
  canvas.addEventListener('mousemove', highlightHexagon);
}

init();

function drawGrid(width, height) {
  for (let y = r; y + r * Math.sin(a) < height; y += r * Math.sin(a)) {
    for (let x = r, j = 0; x + r * (1 + Math.cos(a)) < width; x += r * (1 + Math.cos(a)), y += (-1) ** j++ * r * Math.sin(a)) {
      drawHexagon(x, y);
    }
  }
}

function drawHexagon(x, y) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    ctx.lineTo(x + r * Math.cos(a * i), y + r * Math.sin(a * i));
  }
  ctx.closePath();
  // Fill hexagon with color based on whether it's highlighted
  if (highlightedHexagon && highlightedHexagon.x === x && highlightedHexagon.y === y) {
    ctx.fillStyle = 'yellow'; // Highlighted color
    ctx.fill();
  } else {
    ctx.strokeStyle = 'black';
    ctx.stroke();
  }
}

function highlightHexagon(event) {
  const mouseX = event.clientX - canvas.getBoundingClientRect().left;
  const mouseY = event.clientY - canvas.getBoundingClientRect().top;

  highlightedHexagon = getHexagonAt(mouseX, mouseY);

  // Clear canvas and redraw grid
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid(canvas.width, canvas.height);
}

function getHexagonAt(x, y) {
  for (let posY = r; posY + r * Math.sin(a) < canvas.height; posY += r * Math.sin(a)) {
    for (let posX = r, j = 0; posX + r * (1 + Math.cos(a)) < canvas.width; posX += r * (1 + Math.cos(a)), posY += (-1) ** j++ * r * Math.sin(a)) {
      if (isPointInHexagon(x, y, posX, posY)) {
        return { x: posX, y: posY };
      }
    }
  }
  return null;
}

function isPointInHexagon(x, y, hexagonX, hexagonY) {
  // Calculate the center of the hexagon
  const centerX = hexagonX + r * Math.cos(a * 0.5);
  const centerY = hexagonY + r * Math.sin(a * 0.5);

  // Calculate the distance from the mouse pointer to the center of the hexagon
  const dx = x - centerX;
  const dy = y - centerY;

  // Check if the distance is within the hexagon's radius
  return Math.abs(dx) < r && Math.abs(dy) < r * Math.sin(a);
}
