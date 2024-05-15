document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('canvas');
  const modal = document.getElementById('myModal');

  // Event listener to open the modal when canvas is clicked
  canvas.addEventListener('click', function() {
    modal.style.display = 'block';
  });

  // Event listener to close the modal when close button is clicked
  document.querySelector('.close').addEventListener('click', function() {
    modal.style.display = 'none';
  });

  // Event listener to close the modal when clicking outside the modal content
  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Call the function to generate the hex grid after all event listeners are set up
  createHexGrid(5, 5);
  console.log('Properly timed');
});

// Define the createHexGrid function
function createHexGrid(rows, cols) {
  const gridContainer = document.getElementById('grid-container');
  const hexWidth = 100; // Adjust hexagon width as needed
  const hexHeight = 115; // Adjust hexagon height as needed

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const hex = document.createElement('div');
      hex.classList.add('hex');
      hex.style.left = j * (hexWidth * 0.75) + (i % 2) * (hexWidth * 0.75 / 2) + 'px';
      hex.style.top = i * (hexHeight * 0.5) + 'px';
      gridContainer.appendChild(hex);
      console.log('Create hex grid is working');
    }
  }
}
