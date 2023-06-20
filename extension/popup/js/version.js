const currentVersion = "1.0.3";
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
 * Check the extension neeed an update or no
 */
async function notifyUpdate() {
  const lastVersion = await getLastVersion().catch((err) => {
    console.error(err);
    return currentVersion;
  });

  const lastVertionSplitted = lastVersion.split(".");
  const currentVersionSplitted = currentVersion.split(".");
  const minVersionLength = Math.min(
    lastVertionSplitted.length,
    currentVersionSplitted.length
  );

  for (let i = 0; i < minVersionLength; ++i) {
    if (parseInt(lastVertionSplitted[i]) > parseInt(currentVersionSplitted[i]))
      return setVersion(lastVersion, false);
  }

  setVersion(currentVersion);
}

notifyUpdate();
