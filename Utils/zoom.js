const container = document.querySelector(".seatMapping-container");
const seatMap = document.getElementById("seatMapping");
const zoomInBtn = document.getElementById("zoomInBtn");
const zoomOutBtn = document.getElementById("zoomOutBtn");
const resetBtn = document.getElementById("resetBtn");

let scale = 1; // Current zoom level
const minScale = 0.5; // Minimum zoom level
const maxScale = 4; // Maximum zoom level
const zoomStep = 0.2; // Zoom increment/decrement step
let isPanning = false;
let startX,
  startY,
  translateX = 0,
  translateY = 0;

// Zoom functionality
container.addEventListener("wheel", (e) => {
  e.preventDefault();

  // Get the mouse position relative to the container
  const rect = container.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  // Determine the zoom direction
  const delta = e.deltaY < 0 ? 1 + zoomStep : 1 - zoomStep;
  setZoom(scale * delta, mouseX, mouseY);
});

// Pan functionality
container.addEventListener("mousedown", (e) => {
  if (e.button === 0) {
    // Left mouse button
    isPanning = true;
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
  }
});

container.addEventListener("mousemove", (e) => {
  if (isPanning) {
    translateX = e.clientX - startX;
    translateY = e.clientY - startY;
    applyTransform();
  }
});

container.addEventListener("mouseup", () => {
  isPanning = false;
});

container.addEventListener("mouseleave", () => {
  isPanning = false;
});

// Double-click to reset
container.addEventListener("dblclick", () => {
  resetZoom();
});

// Button event listeners
zoomInBtn.addEventListener("click", () => {
  zoomIn();
});

zoomOutBtn.addEventListener("click", () => {
  zoomOut();
});

resetBtn.addEventListener("click", () => {
  resetZoom();
});

// Zoom in function
function zoomIn() {
  setZoom(scale + zoomStep);
}

// Zoom out function
function zoomOut() {
  setZoom(scale - zoomStep);
}

// Reset zoom function
function resetZoom() {
  scale = 1;
  translateX = 0;
  translateY = 0;
  applyTransform();
}

// Set zoom function
function setZoom(newScale, mouseX = null, mouseY = null) {
  if (newScale < minScale || newScale > maxScale) return;

  const rect = container.getBoundingClientRect();
  const centerX = mouseX !== null ? mouseX - rect.left : rect.width / 2;
  const centerY = mouseY !== null ? mouseY - rect.top : rect.height / 2;

  // Adjust translate values to maintain zoom focus
  translateX = centerX - (centerX - translateX) * (newScale / scale);
  translateY = centerY - (centerY - translateY) * (newScale / scale);

  scale = newScale;
  applyTransform();
}

// Apply transformations
function applyTransform() {
  seatMap.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
}
