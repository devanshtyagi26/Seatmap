const tooltip = document.getElementById("tooltip");
const modal = document.getElementById("myModal");
const modalContent = document.querySelector(".modal-content p");
const closeBtn = document.querySelector(".close");

// Select all <g> elements inside the SVG
document.querySelectorAll("svg g").forEach((group) => {
  // Tooltip Functionality
  group.addEventListener("mouseenter", (event) => {
    tooltip.style.display = "block";
    tooltip.textContent = group.dataset.tooltip || "Seat Section";
  });

  group.addEventListener("mousemove", (event) => {
    tooltip.style.left = event.pageX + 10 + "px";
    tooltip.style.top = event.pageY + 10 + "px";
  });

  group.addEventListener("mouseleave", () => {
    tooltip.style.display = "none";
  });

  // Modal Functionality - Open modal on click
  group.addEventListener("click", () => {
    const sectionName = group.dataset.tooltip || "Unknown Section";
    modalContent.textContent = `You clicked on: ${sectionName}`;
    modal.style.display = "flex";
  });
});

// Close modal when clicking the close button
closeBtn.onclick = function () {
  modal.style.display = "none";
};

// Close modal when clicking outside the modal
window.onclick = function (event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};
