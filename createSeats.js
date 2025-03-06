import { svgConfigsMap } from "./Utils/data.js";
import { createSVGsFromMap } from "./Utils/generateSvgClass.js";

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
      createSVGsFromMap(svgConfigsMap, "Sec1", ".seatMapping");
    }
  });
});
