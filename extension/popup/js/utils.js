"use strict";

/**
 * Show message into the popup
 */
function showMessage({ msg, error, infinite }) {
  const message = document.querySelector("#message");
  message.style.color = error ? "red" : "limegreen";
  message.textContent = msg;
  message.style.display = "block";
  if (!infinite) setTimeout(() => (message.style.display = "none"), 5000);
}
