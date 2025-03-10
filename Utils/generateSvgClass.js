export class SVGGrid {
  constructor(sectorName, sectorConfig, offsetX = 0) {
    this.sectorName = sectorName;
    this.rowCount = sectorConfig.row_count;
    this.colCount = sectorConfig.col_count;
    this.spacingX = sectorConfig.spacingX;
    this.spacingY = sectorConfig.spacingY;
    this.radius = sectorConfig.radius;
    this.rows = sectorConfig.rows;
    this.offsetX = offsetX;
  }

  generateGroup() {
    let group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute("transform", `translate(${this.offsetX}, 0)`);

    // Use document fragment for better performance
    const fragment = document.createDocumentFragment();

    // Create all row groups at once
    this.rows.forEach((row, rowIndex) => {
      const rowConfig = row.config;
      const colData = row.cols;
      const colCount = colData.length;
      const rowHeight = rowIndex * this.spacingY + this.radius * 2;

      // Create a row group
      const rowGroup = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g"
      );
      rowGroup.setAttribute("class", "row-group");

      // Calculate rowGroup X translation based on alignment
      let rowGroupX;
      if (rowConfig.align === "left") {
        rowGroupX = 0;
      } else if (rowConfig.align === "right") {
        rowGroupX = this.colCount * this.spacingX - colCount * this.spacingX;
      } else if (rowConfig.align === "center") {
        rowGroupX =
          (this.colCount * this.spacingX - colCount * this.spacingX) / 2;
      }

      rowGroup.setAttribute(
        "transform",
        `translate(${rowGroupX}, ${rowHeight})`
      );

      // Create Row Label
      const rowLabel = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      rowLabel.setAttribute("x", 0);
      rowLabel.setAttribute("y", 0);
      rowLabel.setAttribute("fill", "black");
      rowLabel.setAttribute("text-anchor", "start");
      rowLabel.setAttribute("dominant-baseline", "middle");
      rowLabel.setAttribute("class", "svg-text");
      rowLabel.textContent = rowConfig.rowName;
      rowGroup.appendChild(rowLabel);

      // Create all circles for this row at once
      colData.forEach((colName, colIndex) => {
        const cx = colIndex * this.spacingX + this.radius * 2;
        const cy = 0;

        const circle = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle"
        );
        circle.setAttribute("cx", cx);
        circle.setAttribute("cy", cy);
        circle.setAttribute("r", this.radius);
        circle.setAttribute("fill", "#50CF70");
        circle.setAttribute("data-name", colName);
        circle.setAttribute("class", "circleSeats");
        circle.setAttribute(
          "id",
          `circle-${this.sectorName}-${rowIndex}-${colIndex}`
        );

        rowGroup.appendChild(circle);
      });

      fragment.appendChild(rowGroup);
    });

    group.appendChild(fragment);
    return group;
  }
}

// Cache for SVGs to avoid re-rendering the same section
const svgCache = new Map();

export function createSVGsFromMap(
  svgConfigsMap,
  sectionName,
  containerSelector
) {
  let container = document.querySelector(containerSelector);
  if (!container) {
    console.error(`Container not found: ${containerSelector}`);
    return;
  }

  container.innerHTML = ""; // Clear previous content

  // Check if we have a cached version
  const cacheKey = `${sectionName}`;
  if (svgCache.has(cacheKey)) {
    container.appendChild(svgCache.get(cacheKey).cloneNode(true));
    initializePanZoom(container.querySelector("svg"));
    return;
  }

  const sectorsData = svgConfigsMap[sectionName];
  if (!sectorsData) {
    console.error(`Section ${sectionName} not found in svgConfigsMap`);
    return;
  }

  let sectorOffsetX = 0;

  // Create a single SVG
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");
  svg.setAttribute("fill", "none");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

  // Create a <g> container for all sectors
  const mainGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");

  // Use Object.entries for the new structure instead of Map.entries
  Object.entries(sectorsData).forEach(([sectorName, sectorConfig]) => {
    const grid = new SVGGrid(sectorName, sectorConfig, sectorOffsetX);
    const groupElement = grid.generateGroup();

    mainGroup.appendChild(groupElement);
    sectorOffsetX +=
      sectorConfig.col_count * sectorConfig.spacingX + sectorConfig.radius * 6;
  });

  svg.appendChild(mainGroup);

  // Cache the SVG for future use
  svgCache.set(cacheKey, svg.cloneNode(true));

  container.appendChild(svg);

  // Initialize pan-zoom after the SVG is added to the DOM
  initializePanZoom(svg);
}

// Separate function for pan-zoom initialization for better code organization
function initializePanZoom(svg) {
  // Use requestAnimationFrame to ensure DOM is ready
  requestAnimationFrame(() => {
    const bbox = svg.querySelector("g").getBBox();
    svg.setAttribute("viewBox", `0 0 ${bbox.width} ${bbox.height}`);

    // Initialize svgPanZoom with improved settings
    const panZoom = window.svgPanZoom(svg, {
      zoomEnabled: true,
      controlIconsEnabled: false,
      fit: true,
      center: true,
      minZoom: 0.5,
      maxZoom: 10,
      zoomScaleSensitivity: 0.3, // More gradual zoom for better user experience
      panEnabled: true,
      dblClickZoomEnabled: true, // Enable double-click to zoom
      mouseWheelZoomEnabled: true, // Enable mouse wheel zoom
      onPan: function () {
        svg.style.cursor = "grabbing";
      },
      beforeZoom: function () {
        return true;
      },
      onZoom: function () {
        // Provide visual feedback during zoom
        svg.classList.add("zooming");
        setTimeout(() => {
          svg.classList.remove("zooming");
        }, 300);
      },
    });

    svg.addEventListener("mouseup", () => {
      svg.style.cursor = "crosshair";
    });

    // Set up event delegation for zoom buttons with enhanced zoom behavior
    document.addEventListener("click", (event) => {
      if (event.target.id === "zoomIn") {
        event.preventDefault();
        panZoom.zoomBy(1.3); // Zoom in by 30% for smoother transition
      } else if (event.target.id === "zoomOut") {
        event.preventDefault();
        panZoom.zoomBy(0.7); // Zoom out by 30% for smoother transition
      } else if (event.target.id === "reset") {
        event.preventDefault();
        // Animated reset - first center then reset zoom
        panZoom.center();
        setTimeout(() => {
          panZoom.resetZoom();
        }, 100);
      }
    });

    // Add zoom transition CSS class
    if (!document.getElementById("zoom-style")) {
      const style = document.createElement("style");
      style.id = "zoom-style";
      style.textContent = `
        svg.zooming {
          transition: transform 0.3s ease-out !important;
        }
      `;
      document.head.appendChild(style);
    }
  });
}
