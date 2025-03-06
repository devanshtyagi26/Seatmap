let scale = 1,
  minScale = 0.5, // Minimum zoom level
  maxScale = 4, // Maximum zoom level
  zoomStep = 0.3,
  isPanning = false,
  start = { x: 0, y: 0 },
  xoff = 0,
  yoff = 0;

const seatMappingContainer = document.querySelector(".seatMapping-container");
const seatMapping = document.getElementById("seatMapping");

function zoomIn() {
  setZoom(scale + zoomStep);
}

function zoomOut() {
  setZoom(scale - zoomStep);
}

function resetZoom() {
  scale = 1;
  xoff = 0;
  yoff = 0;
  applyTransform();
}

function setZoom(newScale, mouseX = null, mouseY = null) {
  if (newScale < minScale || newScale > maxScale) return;

  const rect = seatMapping.getBoundingClientRect();
  const centerX = mouseX !== null ? mouseX - rect.left : rect.width / 2;
  const centerY = mouseY !== null ? mouseY - rect.top : rect.height / 2;

  // Adjust offsets to maintain zoom focus
  xoff = centerX - (centerX - xoff) * (newScale / scale);
  yoff = centerY - (centerY - yoff) * (newScale / scale);

  scale = newScale;
  applyTransform();
}

function applyTransform() {
  seatMapping.style.transform = `translate(${xoff}px, ${yoff}px) scale(${scale})`;
  seatMapping.style.transformOrigin = "0 0";
}

// Handle mouse wheel zooming
seatMappingContainer.addEventListener("wheel", function (e) {
  e.preventDefault();
  const delta = e.deltaY < 0 ? 1.2 : 1 / 1.2; // Zoom in/out
  setZoom(scale * delta, e.clientX, e.clientY);
});

// Handle panning
seatMappingContainer.addEventListener("mousedown", function (e) {
  e.preventDefault();
  isPanning = true;
  start = { x: e.clientX - xoff, y: e.clientY - yoff };
});

document.addEventListener("mouseup", function () {
  isPanning = false;
});

document.addEventListener("mousemove", function (e) {
  if (!isPanning) return;
  e.preventDefault();
  xoff = e.clientX - start.x;
  yoff = e.clientY - start.y;
  applyTransform();
});
