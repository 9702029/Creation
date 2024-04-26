const a = 2 * Math.PI / 6;
const r = 25;
let highlightedHexagons = [];
let selectedHexagons = [];
let canvas; // Declare canvas globally

// Event listeners and initialization
document.addEventListener('DOMContentLoaded', function() {
  canvas = document.getElementById('canvas'); // Assign canvas inside DOMContentLoaded

  if (!canvas) {
    console.error("Canvas element not found.");
    return;
  }

  const uploadBar = document.getElementById('uploadBar');
  const fileInput = document.getElementById('fileInput');

  // Event listener for canvas click
  canvas.addEventListener('click', function(event) {
    if (event.target.tagName === 'CANVAS') {
      showUploadBar();
    }
  });

  // Event listener for file input change
  fileInput.addEventListener('change', function(event) {
    const imageFile = event.target.files[0];
    uploadImage(imageFile);
  });

  // Initialize the grid
  drawGrid(canvas.width, canvas.height);

  // Add event listeners
  canvas.addEventListener('mousemove', highlightHexagon);
  canvas.addEventListener('click', handleClick);
  document.addEventListener('keydown', handleKeyDown);
  document.getElementById('uploadButton').addEventListener('click', handleUploadButtonClick);
  document.getElementById('cancelButton').addEventListener('click', hideUploadBar);
});


// Function to handle hexagon click
function handleClick(event) {
  const mouseX = event.clientX - canvas.getBoundingClientRect().left;
  const mouseY = event.clientY - canvas.getBoundingClientRect().top;

  const clickedHexagon = getHexagonAt(mouseX, mouseY);

  if (clickedHexagon) {
    const index = selectedHexagons.findIndex(hex => hex.x === clickedHexagon.x && hex.y === clickedHexagon.y);
    if (index !== -1) {
      selectedHexagons.splice(index, 1); // Deselect hexagon if already selected
    } else {
      selectedHexagons.push(clickedHexagon); // Select hexagon if not selected
    }
  }

  // Update upload bar visibility
  updateUploadBarVisibility();

  // Clear canvas and redraw grid
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid(canvas.width, canvas.height);
}
// Function to handle key down events
function handleKeyDown(event) {
  if (event.key === 'Backspace') {
    selectedHexagons = []; // Deselect all hexagons
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(canvas.width, canvas.height);
  }
}

// Function to highlight hexagon on mouse move
function highlightHexagon(event) {
  const mouseX = event.clientX - canvas.getBoundingClientRect().left;
  const mouseY = event.clientY - canvas.getBoundingClientRect().top;

  highlightedHexagons = [getHexagonAt(mouseX, mouseY)];

  const ctx = canvas.getContext('2d');
  // Clear canvas and redraw grid
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid(canvas.width, canvas.height);
}

// Function to draw the hexagon grid
function drawGrid(width, height) {
  const ctx = canvas.getContext('2d');
  for (let y = r; y + r * Math.sin(a) < height; y += r * Math.sin(a)) {
    for (let x = r, j = 0; x + r * (1 + Math.cos(a)) < width; x += r * (1 + Math.cos(a)), y += (-1) ** j++ * r * Math.sin(a)) {
      drawHexagon(ctx, x, y);
    }
  }
}

// Function to draw a hexagon
function drawHexagon(ctx, x, y) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    ctx.lineTo(x + r * Math.cos(a * i), y + r * Math.sin(a * i));
  }
  ctx.closePath();
  // Fill hexagon with color based on whether it's highlighted or selected
  if (highlightedHexagons.some(hex => hex.x === x && hex.y === y)) {
    ctx.fillStyle = 'yellow'; // Highlighted color
    ctx.fill();
  } else if (selectedHexagons.some(hex => hex.x === x && hex.y === y)) {
    ctx.fillStyle = 'blue'; // Selected color
    ctx.fill();
  } else {
    ctx.strokeStyle = 'black';
    ctx.stroke();
  }
}

// Function to get the hexagon at a given position
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

// Function to check if a point is inside a hexagon
function isPointInHexagon(x, y, hexagonX, hexagonY) {
  const centerX = hexagonX + r * Math.cos(a * 0.5);
  const centerY = hexagonY + r * Math.sin(a * 0.5);
  const dx = x - centerX;
  const dy = y - centerY;
  return Math.abs(dx) < r && Math.abs(dy) < r * Math.sin(a);
}

// Function to show the upload bar
function showUploadBar() {
  const uploadBar = document.getElementById('uploadBar');
  uploadBar.classList.add('show');
}

// Function to hide the upload bar
function hideUploadBar() {
  const uploadBar = document.getElementById('uploadBar');
  uploadBar.classList.remove('show');
}

// Function to update upload bar visibility based on selected hexagons
function updateUploadBarVisibility() {
  const uploadBar = document.getElementById('uploadBar');
  if (selectedHexagons.length > 0) {
    showUploadBar();
  } else {
    hideUploadBar();
  }
}

// Function to handle upload button click
function handleUploadButtonClick() {
  const imageUrlInput = document.getElementById('imageUrlInput');
  const fileInput = document.getElementById('fileInput');
  let imageUrl;

  if (imageUrlInput.value.trim() !== '') {
    imageUrl = imageUrlInput.value.trim();
  } else if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    imageUrl = URL.createObjectURL(file);
  } else {
    alert('Please select an image or provide an image URL.');
    return;
  }

  console.log('Uploaded image URL:', imageUrl);
  hideUploadBar();
}

// Function to handle image upload
function uploadImage(imageFile) {
  const formData = new FormData();
  formData.append('imageFile', imageFile); // Update the key to match the backend

  fetch('/uploadImage', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    console.log('Uploaded image URL:', data.imageUrl);
    // Handle uploaded image URL as needed (e.g., display image, associate with hexagon)
    const uploadedImageUrl = data.imageUrl;
    
    // Create an image element
    const uploadedImageElement = document.createElement('img');
    uploadedImageElement.src = uploadedImageUrl;
    
    // Find the container element where you want to display the uploaded image
    const container = document.getElementById('uploadedImageContainer');
    
    // Append the image element to the container
    container.appendChild(uploadedImageElement);
  })
  .catch(error => {
    console.error('Error uploading image:', error);
  });
}

// Add event listener to the build button
document.getElementById('buildButton').addEventListener('click', function() {
    // Display the terrain type selection bar/modal
    showTerrainTypeSelection();
});

// Function to show the terrain type selection bar/modal
function showTerrainTypeSelection() {
    // Show the bar/modal for selecting terrain type
    const terrainSelectionBar = document.getElementById('terrainSelectionBar');
    terrainSelectionBar.style.display = 'block';
}

// Function to handle the terrain type selection
function selectTerrainType(terrainType) {
    // Get the selected hexagons
    const selectedHexagons = getSelectedHexagons(); // Implement this function according to your code

    // Send the selected hexagons and terrain type to the server
    sendSelectedDataToServer(selectedHexagons, terrainType);
}
