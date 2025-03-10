// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  const tooltip = document.getElementById("tooltip");
  const modal = document.getElementById("myModal");
  const modalContent = document.querySelector(".modal-content p");
  const closeBtn = document.querySelector(".close");
  const svgContainer = document.querySelector(".template");

  // Use event delegation for all SVG interactions
  // This is more efficient than attaching events to each element
  if (svgContainer) {
    // Tooltip functionality using event delegation
    svgContainer.addEventListener("mouseover", (event) => {
      const group = event.target.closest("g");
      if (group) {
        tooltip.style.display = "block";
        tooltip.textContent = group.dataset.tooltip || "Seat Section";
      }
    });

    svgContainer.addEventListener("mousemove", (event) => {
      // Only update tooltip position if it's visible
      if (tooltip.style.display === "block") {
        // Use requestAnimationFrame for smoother tooltip movement
        requestAnimationFrame(() => {
          tooltip.style.left = event.pageX + 10 + "px";
          tooltip.style.top = event.pageY + 10 + "px";
        });
      }
    });

    svgContainer.addEventListener("mouseout", (event) => {
      const group = event.target.closest("g");
      const relatedTarget = event.relatedTarget;

      // Only hide the tooltip if we're leaving the group element
      if (group && !group.contains(relatedTarget)) {
        tooltip.style.display = "none";
      }
    });
  }

  // Close modal when clicking the close button
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  // Close modal when clicking outside the modal
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // Event delegation for seat selection in the modal
  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("circleSeats")) {
      const seatElement = event.target;

      // Toggle seat selection state
      if (seatElement.getAttribute("fill") === "#50CF70") {
        seatElement.setAttribute("fill", "#FF6B6B");

        // Add to checkout section
        addToCheckout(seatElement);
      } else {
        seatElement.setAttribute("fill", "#50CF70");

        // Remove from checkout section
        removeFromCheckout(seatElement);
      }
    }
  });
});

// Function to add selected seat to checkout area
function addToCheckout(seatElement) {
  const checkout = document.querySelector(".checkout");
  if (!checkout) return;

  const seatId = seatElement.id;
  const seatName = seatElement.getAttribute("data-name");
  const rowName = seatElement
    .closest(".row-group")
    .querySelector(".svg-text").textContent;

  // Create a new seat item in checkout
  const seatItem = document.createElement("div");
  seatItem.classList.add("checkout-item");
  seatItem.dataset.seatId = seatId;
  seatItem.innerHTML = `
    <span>Row ${rowName}, Seat ${seatName}</span>
    <button class="remove-seat" data-seat-id="${seatId}">×</button>
  `;

  checkout.appendChild(seatItem);
}

// Function to remove seat from checkout area
function removeFromCheckout(seatElement) {
  const checkout = document.querySelector(".checkout");
  if (!checkout) return;

  const seatId = seatElement.id;
  const seatItem = checkout.querySelector(
    `.checkout-item[data-seat-id="${seatId}"]`
  );

  if (seatItem) {
    checkout.removeChild(seatItem);
  }
}

// Event delegation for removing seats from checkout
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("remove-seat")) {
    const seatId = event.target.dataset.seatId;
    const seatElement = document.getElementById(seatId);

    // Reset the seat color
    if (seatElement) {
      seatElement.setAttribute("fill", "#50CF70");
    }

    // Remove from checkout
    const checkoutItem = event.target.closest(".checkout-item");
    if (checkoutItem) {
      checkoutItem.parentNode.removeChild(checkoutItem);
    }
  }
});
