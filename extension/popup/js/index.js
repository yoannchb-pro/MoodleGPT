const saveBtn = document.querySelector(".save");

/* inputs id */
const inputsText = ["apiKey", "code", "model"];
const inputsCheckbox = [
  "logs",
  "title",
  "cursor",
  "typing",
  "mouseover",
  "infinite",
  "timeout",
];

/* Save the configuration */
saveBtn.addEventListener("click", function () {
  const [apiKey, code, model] = inputsText.map((selector) =>
    document.querySelector("#" + selector).value.trim()
  );
  const [logs, title, cursor, typing, mouseover, infinite, timeout] =
    inputsCheckbox.map((selector) => {
      const element = document.querySelector("#" + selector);
      return element.checked && element.parentElement.style.display !== "none";
    });

  if (!apiKey || !model) {
    showMessage("Please complete all the form");
    return;
  }

  if (code.length > 0 && code.length < 3) {
    showMessage("The code should at least contain 3 characters");
    return;
  }

  chrome.storage.sync.set({
    moodleGPT: {
      apiKey,
      code,
      model,
      logs,
      title,
      cursor,
      typing,
      mouseover,
      infinite,
      timeout,
      mode: actualMode,
    },
  });

  showMessage("Configuration saved", true);
});

/* we load back the configuration */
chrome.storage.sync.get(["moodleGPT"]).then(function (storage) {
  const config = storage.moodleGPT;

  if (config) {
    if (config.mode) {
      actualMode = config.mode;
      for (const mode of modes) {
        if (mode.value === config.mode) {
          mode.classList.remove("not-selected");
        } else {
          mode.classList.add("not-selected");
        }
      }
    }

    inputsText.forEach((key) =>
      config[key]
        ? (document.querySelector("#" + key).value = config[key])
        : null
    );
    inputsCheckbox.forEach(
      (key) => (document.querySelector("#" + key).checked = config[key] || "")
    );
  }

  handleModeChange();
  getLastChatGPTVersion();
});
