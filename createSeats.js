import { svgConfigsMap } from "./Utils/data.js";
import { createSVGsFromMap } from "./Utils/generateSvgClass.js";
import highlightPathById from "./Utils/svgOutline.js";

// Wait for DOM to be fully loaded before adding event listeners
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("myModal");
  const modalContent = document.querySelector(".seatMapping");
  const closeBtn = document.querySelector(".close");

  // Use event delegation for better performance
  document.querySelector("svg").addEventListener("click", (event) => {
    // Find the closest 'g' parent element from the clicked element
    const group = event.target.closest("g");
    if (!group) return;

    // Clear previous content
    modalContent.innerHTML = "";

    // Show modal
    modal.style.display = "block";

    // Create appropriate seats based on section
    const sectionTooltip = group.dataset.tooltip;

    switch (sectionTooltip) {
      case "Section 1-2-3":
        // Example of creating multiple SVGs for a section
        createMultipleSectors();
        break;
      case "Section 28-29-30-31-32":
        highlightPathById("section1");
        createSVGsFromMap(svgConfigsMap, "Sec1", ".seatMapping");
        break;
      case "Section 18-19-20-21-22":
        highlightPathById("section2");
        createSVGsFromMap(svgConfigsMap, "Sec13", ".seatMapping");
        break;
      default:
        console.log(`No mapping defined for ${sectionTooltip}`);
    }
  });

  // Close modal functionality
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  // Close modal if user clicks outside the modal content
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
});

// Function to create multiple sectors in a single section
function createMultipleSectors() {
  // This could be optimized further by having a more structured approach
  // for sections that contain multiple sectors
  highlightPathById("section11");
  createSVGsFromMap(svgConfigsMap, "Sec1", ".seatMapping");
}
