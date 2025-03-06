let scale = 1,
  minScale = 0.5, // Minimum zoom level
  maxScale = 3, // Maximum zoom level
  panning = false,
  xoff = 0,
  yoff = 0,
  start = { x: 0, y: 0 };

const zoomStep = 0.2;
const seatMappingContainer = document.querySelector(".seatMapping-container");
const seatMapping = document.getElementById("seatMapping");

function zoomIn() {
  if (scale < maxScale) {
    scale = Math.min(scale + zoomStep, maxScale);
    updateZoom();
  }
}

function zoomOut() {
  if (scale > minScale) {
    scale = Math.max(scale - zoomStep, minScale);
    updateZoom();
  }
}

function resetZoom() {
  scale = 1;
  xoff = 0;
  yoff = 0;
  updateZoom();
}

function updateZoom() {
  seatMapping.style.transform = `translate(${xoff}px, ${yoff}px) scale(${scale})`;
  seatMapping.style.transformOrigin = "0 0";
}

// Allow panning when zoomed in
seatMappingContainer.onmousedown = function (e) {
  e.preventDefault();
  start = { x: e.clientX - xoff, y: e.clientY - yoff };
  panning = true;
};

seatMappingContainer.onmouseup = function () {
  panning = false;
};

seatMappingContainer.onmousemove = function (e) {
  if (!panning) return;
  e.preventDefault();
  xoff = e.clientX - start.x;
  yoff = e.clientY - start.y;
  updateZoom();
};

// Scroll to zoom from anywhere inside the container
seatMappingContainer.onwheel = function (e) {
  e.preventDefault();
  const rect = seatMapping.getBoundingClientRect();

  // Get cursor position relative to seatMapping
  let xs = (e.clientX - rect.left) / scale,
    ys = (e.clientY - rect.top) / scale,
    delta = e.wheelDelta ? e.wheelDelta : -e.deltaY;

  // Adjust scale within min/max limits
  let newScale = delta > 0 ? scale * 1.2 : scale / 1.2;
  if (newScale < minScale || newScale > maxScale) return;

  scale = newScale;

  // Keep the zoom centered around the cursor
  xoff = e.clientX - xs * scale;
  yoff = e.clientY - ys * scale;

  updateZoom();
};
