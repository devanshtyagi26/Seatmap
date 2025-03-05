class SVGGrid {
  constructor(rows, cols, spacingX, spacingY, radius) {
    this.rows = rows;
    this.cols = cols;
    this.spacingX = spacingX;
    this.spacingY = spacingY;
    this.radius = radius;
    this.customCols = new Array(rows).fill({ count: cols, align: "left" }); // Default: all rows align left
  }

  // Method to update number of circles in specific rows and alignment
  setRowCircles(rowIndex, numCircles, align = "left") {
    if (rowIndex >= 0 && rowIndex < this.rows) {
      this.customCols[rowIndex] = { count: numCircles, align };
    }
  }

  // Method to generate SVG
  generateSVG() {
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", this.cols * this.spacingX + this.radius * 2);
    svg.setAttribute("height", this.rows * this.spacingY + this.radius * 2);
    svg.setAttribute(
      "viewBox",
      `0 0 ${this.cols * this.spacingX + this.radius * 2} ${
        this.rows * this.spacingY + this.radius * 2
      }`
    );
    svg.setAttribute("fill", "none");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

    // Generate circles based on row-specific settings
    for (let row = 0; row < this.rows; row++) {
      let { count: actualCols, align } = this.customCols[row];
      for (let col = 0; col < actualCols; col++) {
        let cx;
        if (align === "right") {
          cx = (this.cols - actualCols + col) * this.spacingX + this.radius;
        } else if (align === "center") {
          let startX = ((this.cols - actualCols) * this.spacingX) / 2;
          cx = startX + col * this.spacingX + this.radius;
        } else {
          cx = col * this.spacingX + this.radius;
        }
        let cy = row * this.spacingY + this.radius;

        let circle = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle"
        );
        circle.setAttribute("cx", cx);
        circle.setAttribute("cy", cy);
        circle.setAttribute("r", this.radius);
        circle.setAttribute("fill", "#50CF70");

        svg.appendChild(circle);
      }
    }
    return svg;
  }

  // Function to append the SVG to a container
  appendSVGToContainer(container) {
    let svg = this.generateSVG();
    container.appendChild(svg);
  }
}

// Function to create and display multiple SVGs
function createMultipleSVGs(configs, containerSelector) {
  let container = document.querySelector(containerSelector);

  configs.forEach((config) => {
    let grid = new SVGGrid(
      config.rows,
      config.cols,
      config.spacingX,
      config.spacingY,
      config.radius
    );
    config.customRows.forEach(({ rowIndex, count, align }) => {
      grid.setRowCircles(rowIndex, count, align);
    });
    grid.appendSVGToContainer(container);
  });
}

// Example usage:
let svgConfigs = [
  {
    rows: 7,
    cols: 11,
    spacingX: 50,
    spacingY: 100,
    radius: 15,
    customRows: [
      { rowIndex: 3, count: 10, align: "right" },
      { rowIndex: 4, count: 9, align: "right" },
      { rowIndex: 5, count: 9, align: "right" },
      { rowIndex: 6, count: 8, align: "right" },
      { rowIndex: 7, count: 7, align: "right" },
      { rowIndex: 8, count: 5, align: "center" },
    ],
  },
  {
    rows: 7,
    cols: 8,
    spacingX: 50,
    spacingY: 100,
    radius: 15,
    customRows: [{ rowIndex: 6, count: 6, align: "center" }],
  },
  {
    rows: 7,
    cols: 8,
    spacingX: 50,
    spacingY: 100,
    radius: 15,
    customRows: [{ rowIndex: 6, count: 6, align: "center" }],
  },
  {
    rows: 7,
    cols: 12,
    spacingX: 50,
    spacingY: 100,
    radius: 15,
    customRows: [{ rowIndex: 6, count: 7, align: "center" }],
  },
];

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
      createMultipleSVGs(svgConfigs, ".seatMapping");
    }
  });
});
