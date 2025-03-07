export class SVGGrid {
  constructor(sectorName, sectorConfig, offsetX = 0) {
    // Store sector properties
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
    // Create main <g> element for the sector
    let group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute("transform", `translate(${this.offsetX}, 0)`);

    let rowIndex = 0;

    // Loop through rows
    for (let rowMap of this.rows) {
      for (let rowEntry of rowMap) {
        let rowConfig = rowEntry[0][1]; // Extract row config correctly
        let colData = rowEntry[1][1]; // Extract column data correctly
        let colCount = colData.length; // Number of columns in the row
        let rowHeight = rowIndex * this.spacingY + this.radius * 2;

        // Create a row group
        let rowGroup = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "g"
        );
        rowGroup.setAttribute("class", "row-group");

        // Calculate row alignment (left, center, or right)
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
        let rowLabel = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );
        rowLabel.setAttribute("x", 0);
        rowLabel.setAttribute("y", 0);
        rowLabel.setAttribute("fill", "black"); // Text color
        rowLabel.setAttribute("text-anchor", "start");
        rowLabel.setAttribute("dominant-baseline", "middle");
        rowLabel.setAttribute("class", "svg-text");
        rowLabel.textContent = rowConfig.rowName;
        rowGroup.appendChild(rowLabel);

        // Create Column Circles
        let colIndex = 0;
        for (let colName of colData) {
          let cx = colIndex * this.spacingX + this.radius * 2;
          let cy = 0;

          let circle = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
          );
          circle.setAttribute("cx", cx);
          circle.setAttribute("cy", cy);
          circle.setAttribute("r", this.radius);
          circle.setAttribute("fill", "#50CF70");
          circle.setAttribute("data-name", colName);

          rowGroup.appendChild(circle);
          colIndex++;
        }

        group.appendChild(rowGroup);
        rowIndex++;
      }
    }
    return group;
  }
}

export function createSVGsFromMap(
  svgConfigsMap,
  sectionName,
  containerSelector
) {
  let container = document.querySelector(containerSelector);
  container.innerHTML = ""; // Clear previous content

  // Check if the given section exists in the configuration map
  if (!svgConfigsMap.has(sectionName)) {
    console.error(`Section ${sectionName} not found in svgConfigsMap`);
    return;
  }

  let sectors = svgConfigsMap.get(sectionName);
  let sectorOffsetX = 0;

  // Create the SVG element
  let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "100%"); // Responsive width
  svg.setAttribute("height", "100%"); // Responsive height
  svg.setAttribute("fill", "none");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

  // Create a <g> container for all sectors
  let mainGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");

  // Loop through all sectors and add them to the main group
  for (let [sectorName, sectorConfig] of sectors) {
    let grid = new SVGGrid(sectorName, sectorConfig, sectorOffsetX);
    let groupElement = grid.generateGroup();
    mainGroup.appendChild(groupElement);

    // Update the offset for the next sector
    sectorOffsetX +=
      sectorConfig.col_count * sectorConfig.spacingX + sectorConfig.radius * 6;
  }

  svg.appendChild(mainGroup);
  container.appendChild(svg);

  // After appending, calculate the bounding box of the entire <g>
  setTimeout(() => {
    let bbox = mainGroup.getBBox();
    svg.setAttribute("viewBox", `0 0 ${bbox.width} ${bbox.height}`);

    // Initialize svgPanZoom for zooming and panning functionality
    let panZoom = window.svgPanZoom(svg, {
      zoomEnabled: true,
      controlIconsEnabled: false, // Disable default controls since we have custom buttons
      fit: true,
      center: true,
      minZoom: 0.5,
      maxZoom: 7,
      panEnabled: true,
    });

    // Attach event listeners to custom zoom buttons
    document.getElementById("zoomIn").addEventListener("click", function (ev) {
      ev.preventDefault();
      panZoom.zoomIn();
    });

    document.getElementById("zoomOut").addEventListener("click", function (ev) {
      ev.preventDefault();
      panZoom.zoomOut();
    });

    document.getElementById("reset").addEventListener("click", function (ev) {
      ev.preventDefault();
      panZoom.resetZoom();
    });
  }, 0);
}
