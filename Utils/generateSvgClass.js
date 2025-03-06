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

  generateSVG() {
    let width = this.colCount * this.spacingX + this.radius * 2;
    let height = this.rowCount * this.spacingY + this.radius * 2;

    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", width / 6);
    svg.setAttribute("height", height / 6);
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.setAttribute("fill", "none");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("style", `transform: translateX(${this.offsetX}px);`);

    let sectorGroup = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    );

    let rowIndex = 0;
    for (let rowMap of this.rows) {
      for (let [[, rowConfig], [, colData]] of rowMap) {
        // Row label
        let rowLabel = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );
        rowLabel.setAttribute("x", 5);
        rowLabel.setAttribute("y", rowIndex * this.spacingY + this.radius * 2);
        rowLabel.setAttribute("fill", "black");
        rowLabel.textContent = rowConfig.rowName;
        sectorGroup.appendChild(rowLabel);

        // Columns (Circles)
        let colIndex = 0;
        for (let colName of colData) {
          let cx = colIndex * this.spacingX + this.radius * 2;
          let cy = rowIndex * this.spacingY + this.radius * 2;

          let circle = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
          );
          circle.setAttribute("cx", cx);
          circle.setAttribute("cy", cy);
          circle.setAttribute("r", this.radius);
          circle.setAttribute("fill", "#50CF70");
          circle.setAttribute("data-name", colName);

          sectorGroup.appendChild(circle);
          colIndex++;
        }

        rowIndex++;
      }
    }

    svg.appendChild(sectorGroup);
    return svg;
  }

  appendSVGToContainer(container) {
    let svg = this.generateSVG();
    container.appendChild(svg);
  }
}

export function createSVGsFromMap(
  svgConfigsMap,
  sectionName,
  containerSelector
) {
  let container = document.querySelector(containerSelector);
  container.innerHTML = ""; // Clear previous content

  if (!svgConfigsMap.has(sectionName)) {
    console.error(`Section ${sectionName} not found in svgConfigsMap`);
    return;
  }

  let sectors = svgConfigsMap.get(sectionName);
  let sectorOffsetX = 0;

  for (let [sectorName, sectorConfig] of sectors) {
    let grid = new SVGGrid(sectorName, sectorConfig, sectorOffsetX);
    let svgElement = grid.generateSVG();

    let spanWrapper = document.createElement("span");
    spanWrapper.appendChild(svgElement);

    container.appendChild(spanWrapper);

    // sectorOffsetX += parseInt(svgElement.getAttribute("width"), 10); // Offset the next sector horizontally
  }
}
