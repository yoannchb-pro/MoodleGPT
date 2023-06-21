const saveBtn = document.querySelector(".save");
const message = document.querySelector("#message");

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

const mode = document.querySelector("#mode");
const modes = mode.querySelectorAll("button");
let actualMode = "autocomplete";
/* inputs id that need to be disabled for a specific mode */
const disabledForThisMode = {
  autocomplete: [],
  clipboard: ["typing", "mouseover"],
  "question-to-answer": ["typing", "infinite", "mouseover"],
};

/**
 * Show message into the popup
 * @param {string} messageTxt
 * @param {boolean} valide
 */
function showMessage(messageTxt, valide) {
  message.style.color = valide ? "limegreen" : "red";
  message.textContent = messageTxt;
  message.style.display = "block";
  setTimeout(() => (message.style.display = "none"), 5000);
}

/**
 * Handle when a mode change to show specific input
 */
function handleModeChange() {
  const needDisable = disabledForThisMode[actualMode];
  const dontNeedDisable = inputsCheckbox.filter(
    (input) => !needDisable.includes(input)
  );
  for (const id of needDisable) {
    document.querySelector("#" + id).parentElement.style.display = "none";
  }
  for (const id of dontNeedDisable) {
    document.querySelector("#" + id).parentElement.style.display = null;
  }
}

/* Mode handler */
modes.forEach((button) => {
  button.addEventListener("click", function () {
    const value = button.value;
    actualMode = value;
    for (const mode of modes) {
      if (mode.value !== value) {
        mode.classList.add("not-selected");
      } else {
        mode.classList.remove("not-selected");
      }
    }
    handleModeChange();
  });
});

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

  if (!apiKey || !code || !model) {
    showMessage("Please complete all the form");
    return;
  }

  if (code.length < 3) {
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

/**
 * Get the last ChatGPT version
 */
function getLastChatGPTVersion() {
  const apiKeySelector = document.querySelector("#apiKey");
  const reloadModel = document.querySelector("#reloadModel");

  let apiKey = apiKeySelector.value;

  function checkFiledApiKey() {
    if (apiKey) {
      reloadModel.removeAttribute("disabled");
      reloadModel.setAttribute("title", "Get last ChatGPT version");
      return;
    }

    reloadModel.setAttribute("disabled", true);
    reloadModel.setAttribute("title", "Provide an api key first");
  }

  checkFiledApiKey();

  apiKeySelector.addEventListener("input", function () {
    apiKey = apiKeySelector.value.trim();
    checkFiledApiKey();
  });

  reloadModel.addEventListener("click", async function () {
    if (!apiKey) return;
    try {
      const req = await fetch("https://api.openai.com/v1/models", {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });
      const rep = await req.json();
      const model = rep.data.find((model) => model.id.includes("gpt"));
      document.querySelector("#model").value = model.root;
    } catch (err) {
      console.error(err);
      showMessage("Failed to fetch last ChatGPT version");
    }
  });
}

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
