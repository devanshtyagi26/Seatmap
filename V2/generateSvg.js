function createSVG() {
  const svgNamespace = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNamespace, "svg");
  svg.setAttribute("width", "8182");
  svg.setAttribute("height", "7126");
  svg.setAttribute("viewBox", "0 0 8182 7126");
  svg.setAttribute("fill", "none");

  const circles = [
    { cx: 84, cy: 7042 },
    { cx: 307, cy: 7042 },
    { cx: 530, cy: 7042 },
    { cx: 5201, cy: 1078 },
    { cx: 2971, cy: 581 },
    { cx: 3194, cy: 581 },
    { cx: 3417, cy: 581 },
    { cx: 3640, cy: 581 },
    { cx: 3863, cy: 581 },
    { cx: 4086, cy: 581 },
    { cx: 4309, cy: 581 },
    { cx: 4532, cy: 581 },
    { cx: 4755, cy: 581 },
    { cx: 4978, cy: 581 },
    { cx: 5201, cy: 581 },
    { cx: 2971, cy: 84 },
    { cx: 3194, cy: 84 },
    { cx: 3417, cy: 84 },
    { cx: 3640, cy: 84 },
    { cx: 3863, cy: 84 },
    { cx: 4086, cy: 84 },
    { cx: 4309, cy: 84 },
    { cx: 4532, cy: 84 },
    { cx: 4755, cy: 84 },
    { cx: 4978, cy: 84 },
    { cx: 5201, cy: 84 },
  ];

  circles.forEach(({ cx, cy }) => {
    const circle = document.createElementNS(svgNamespace, "circle");
    circle.setAttribute("cx", cx);
    circle.setAttribute("cy", cy);
    circle.setAttribute("r", "84");
    circle.setAttribute("fill", "#50CF70");
    svg.appendChild(circle);
  });

  const modalContent = document.querySelector(".seatMapping");

  modalContent.appendChild(svg);
}

// createSVG();

function generateSVG(rows, cols, spacingX, spacingY, radius) {
  // Create the SVG element
  let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", cols * spacingX + radius * 2);
  svg.setAttribute("height", rows * spacingY + radius * 2);
  svg.setAttribute(
    "viewBox",
    `0 0 ${cols * spacingX + radius * 2} ${rows * spacingY + radius * 2}`
  );
  svg.setAttribute("fill", "none");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

  // Generate circles in a grid pattern
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let cx = col * spacingX + radius;
      let cy = row * spacingY + radius;

      let circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      circle.setAttribute("cx", cx);
      circle.setAttribute("cy", cy);
      circle.setAttribute("r", radius);
      circle.setAttribute("fill", "#50CF70");

      svg.appendChild(circle);
    }
  }

  return svg;
}

// Function to open the modal and append the SVG
function openModalWithSVG(rows, cols, spacingX, spacingY, radius) {
  let modalContent = document.querySelector(".seatMapping");
  let svg = generateSVG(rows, cols, spacingX, spacingY, radius);
  modalContent.appendChild(svg);

  document.getElementById("myModal").style.display = "flex";
}

// Attach event listener to each <g> element
document.querySelectorAll("svg g").forEach((group) => {
  let modalContent = document.querySelector(".seatMapping");
  group.addEventListener("click", () => {
    modalContent.innerHTML = "";
    if (group.dataset.tooltip === "Section 1-2-3") {
      openModalWithSVG(10, 14, 50, 100, 15); // Example: 3 rows, 10 columns, 200px spacing, 50px radius
      openModalWithSVG(11, 14, 50, 100, 15); // Example: 3 rows, 10 columns, 200px spacing, 50px radius
      openModalWithSVG(10, 14, 50, 100, 15); // Example: 3 rows, 10 columns, 200px spacing, 50px radius
    }
  });
});
