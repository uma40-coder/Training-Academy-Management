// customAlert.js - Override native browser alert with modern glassmorphic toasts
if (typeof window !== "undefined") {
  window.alert = function (message) {
    // 1. Create or select custom alert container
    let container = document.getElementById("custom-alert-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "custom-alert-container";
      document.body.appendChild(container);
    }

    // 2. Create the toast element
    const toast = document.createElement("div");
    toast.className = "custom-toast-alert animate-toast-in";

    // 3. Detect message status types for styling
    let icon = "🔔";
    let title = "Notification";
    const lowercaseMsg = String(message || "").toLowerCase();

    if (
      lowercaseMsg.includes("failed") ||
      lowercaseMsg.includes("error") ||
      lowercaseMsg.includes("not connected") ||
      lowercaseMsg.includes("required") ||
      lowercaseMsg.includes("aagala") ||
      lowercaseMsg.includes("invalid") ||
      lowercaseMsg.includes("denied")
    ) {
      icon = "❌";
      title = "Error";
      toast.classList.add("toast-error");
    } else if (
      lowercaseMsg.includes("success") ||
      lowercaseMsg.includes("updated") ||
      lowercaseMsg.includes("saved") ||
      lowercaseMsg.includes("sent") ||
      lowercaseMsg.includes("done") ||
      lowercaseMsg.includes("added") ||
      lowercaseMsg.includes("approved") ||
      lowercaseMsg.includes("registered")
    ) {
      icon = "✅";
      title = "Success";
      toast.classList.add("toast-success");
    } else {
      toast.classList.add("toast-info");
    }

    // 4. Inject visual HTML layout
    toast.innerHTML = `
      <div class="toast-icon-wrapper">${icon}</div>
      <div class="toast-content-wrapper">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close-btn">&times;</button>
    `;

    // 5. Append to container
    container.appendChild(toast);

    // 6. Dismiss handler
    const dismissToast = () => {
      if (toast.classList.contains("animate-toast-out")) return;
      toast.classList.remove("animate-toast-in");
      toast.classList.add("animate-toast-out");
      toast.addEventListener("animationend", () => {
        toast.remove();
        if (container.children.length === 0) {
          container.remove();
        }
      });
    };

    // Close button click listener
    const closeBtn = toast.querySelector(".toast-close-btn");
    closeBtn.addEventListener("click", dismissToast);

    // Auto dismiss after 4.5 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        dismissToast();
      }
    }, 4500);
  };
}
