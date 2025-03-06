import { svgConfigsMap } from "./data.js";
console.log(svgConfigsMap);
class SVGGrid {
  constructor(sectionName, sectorData, sectionOffsetX) {
    this.sectionName = sectionName;
    this.sectorData = sectorData;
    this.sectionOffsetX = sectionOffsetX; // X-offset to position sections side by side
  }

  generateSVG() {
    let { row_count, col_count, spacingX, spacingY, radius, rows } =
      this.sectorData;

    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", col_count * spacingX + radius * 2);
    svg.setAttribute("height", row_count * spacingY + radius * 2);

    // Create a <g> group for the whole section
    let sectionGroup = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    );
    sectionGroup.setAttribute("data-section", this.sectionName);

    let rowIndex = 0; // Track row index to position rows correctly

    for (let rowMap of rows) {
      for (let [[, rowConfig], [, colData]] of rowMap) {
        let rowGroup = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "g"
        );
        rowGroup.setAttribute("data-row", rowConfig.rowName);

        // Add row label
        let rowLabel = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );
        rowLabel.setAttribute("x", 5);
        rowLabel.setAttribute("y", spacingY * rowIndex + radius * 2);
        rowLabel.setAttribute("fill", "black");
        rowLabel.textContent = rowConfig.rowName;
        rowGroup.appendChild(rowLabel);

        // Generate circles for each column in this row
        let colIndex = 0;
        for (let [colName] of colData) {
          let cx = colIndex * spacingX + radius * 2;
          let cy = rowIndex * spacingY + radius * 2;

          let circle = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
          );
          circle.setAttribute("cx", cx);
          circle.setAttribute("cy", cy);
          circle.setAttribute("r", radius);
          circle.setAttribute("fill", "#50CF70");
          circle.setAttribute("data-name", colName);

          rowGroup.appendChild(circle);
          colIndex++;
        }

        // Append the row group to the section group
        sectionGroup.appendChild(rowGroup);
        rowIndex++; // Move to the next row
      }
    }

    // Append the section group to the SVG
    svg.appendChild(sectionGroup);
    return svg;
  }

  appendSVGToContainer(container) {
    let svg = this.generateSVG();
    container.appendChild(svg);
  }
}

function createSVGsFromMap(svgConfigsMap, containerSelector) {
  let container = document.querySelector(containerSelector);
  container.innerHTML = ""; // Clear previous content

  let sectionOffsetX = 0; // Track horizontal position for sections

  for (let [section, sectors] of svgConfigsMap) {
    for (let [sectorName, sectorConfig] of sectors) {
      let grid = new SVGGrid(sectorName, sectorConfig, sectionOffsetX);
      grid.appendSVGToContainer(container);
      sectionOffsetX += sectorConfig.col_count * sectorConfig.spacingX + 100; // Offset next section horizontally
    }
  }
}

// Attach event listener to each <g> element
document.querySelectorAll("svg g").forEach((group) => {
  let modalContent = document.querySelector(".seatMapping");
  group.addEventListener("click", () => {
    modalContent.innerHTML = "";
    if (group.dataset.tooltip === "Section 1-2-3") {
      openModalWithSVG(10, 14, 50, 100, 15);
      openModalWithSVG(11, 14, 50, 100, 15);
      openModalWithSVG(10, 14, 50, 100, 15); // Example: 3 rows, 10 columns, 200px spacing, 50px radius
    }
    if (group.dataset.tooltip === "Section 28-29-30-31-32") {
      createSVGsFromMap(svgConfigsMap, ".seatMapping");
    }
  });
});
