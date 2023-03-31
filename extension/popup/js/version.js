const currentVersion = "1.0.1";
const versionDisplay = document.querySelector("#version");

async function getLastVersion() {
  const req = await fetch(
    "https://raw.githubusercontent.com/yoannchb-pro/MoodleGPT/main/package.json"
  );
  const rep = await req.json();
  return rep.version;
}

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

async function notifyUpdate() {
  const lastVersion = await getLastVersion().catch((err) => {
    console.error(err);
    return currentVersion;
  });
  if (currentVersion !== lastVersion) {
    setVersion(lastVersion, false);
  } else {
    setVersion(currentVersion);
  }
}

notifyUpdate();
