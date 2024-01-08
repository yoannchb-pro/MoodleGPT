"use strict";

const CURRENT_VERSION = "1.0.4";
const versionDisplay = document.querySelector("#version");

/**
 * Get the last version from the github
 * @returns
 */
async function getLastVersion() {
  const req = await fetch(
    "https://raw.githubusercontent.com/yoannchb-pro/MoodleGPT/main/package.json"
  );
  const rep = await req.json();
  return rep.version;
}

/**
 * Display the version or an update message
 * @param {string} version
 * @param {boolean} isCurrent
 * @returns
 */
function setVersion(version, isCurrent = true) {
  if (isCurrent) {
    versionDisplay.textContent = "v" + version;
    return;
  }

  const link = document.createElement("a");
  link.href = "https://github.com/yoannchb-pro/MoodleGPT";
  link.rel = "noopener noreferrer";
  link.target = "_blank";
  link.textContent = "v" + version;
  versionDisplay.appendChild(link);
  versionDisplay.appendChild(document.createTextNode(" is now available !"));
}

/**
 * Check if the extension neeed an update or not
 */
async function notifyUpdate() {
  const lastVersion = await getLastVersion().catch((err) => {
    console.error(err);
    return CURRENT_VERSION;
  });

  const lastVertionSplitted = lastVersion.split(".");
  const currentVersionSplitted = CURRENT_VERSION.split(".");
  const minVersionLength = Math.min(
    lastVertionSplitted.length,
    currentVersionSplitted.length
  );

  for (let i = 0; i < minVersionLength; ++i) {
    if (parseInt(lastVertionSplitted[i]) > parseInt(currentVersionSplitted[i]))
      return setVersion(lastVersion, false);
  }

  setVersion(CURRENT_VERSION);
}

notifyUpdate();
