"use strict";

const message = document.querySelector("#message");

/**
 * Show message into the popup
 * @param {string} messageTxt
 * @param {boolean} valide
 * @param {boolean} infinite
 */
function showMessage(messageTxt, valide, infinite) {
  message.style.color = valide ? "limegreen" : "red";
  message.textContent = messageTxt;
  message.style.display = "block";
  if (!infinite) setTimeout(() => (message.style.display = "none"), 5000);
}
