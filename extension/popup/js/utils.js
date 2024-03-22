'use strict';

/**
 * Show message into the popup
 */
function showMessage({ msg, error, infinite }) {
  const message = document.querySelector('#message');
  message.style.color = error ? 'red' : 'limegreen';
  message.textContent = msg;
  message.style.display = 'block';
  if (!infinite) setTimeout(() => (message.style.display = 'none'), 5000);
}

/**
 * Check if the current model support images integrations
 * @param {string} version
 * @returns
 */
function isCurrentVersionSupportingImages(version) {
  const versionNumber = version.match(/gpt-(\d+)/);
  if (!versionNumber?.[1]) {
    return false;
  }
  return Number(versionNumber[1]) >= 4;
}
