const saveBtn = document.querySelector(".save");
const message = document.querySelector("#message");

const inputsText = ["apiKey", "code", "langage"];
const inputsCheckbox = ["logs", "title", "cursor", "typing", "mouseover"];

function showMessage(messageTxt, valide) {
  message.style.color = valide ? "limegreen" : "red";
  message.textContent = messageTxt;
  message.style.display = "block";
  setTimeout(() => (message.style.display = "none"), 5000);
}

//save the configuration
saveBtn.addEventListener("click", function () {
  const [apiKey, code, langage] = inputsText.map((selector) =>
    document.querySelector("#" + selector).value.trim()
  );
  const [logs, title, cursor, typing, mouseover] = inputsCheckbox.map(
    (selector) => document.querySelector("#" + selector).checked
  );

  if (!apiKey || !code) {
    showMessage("Please comple all the form");
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
      langage,
      logs,
      title,
      cursor,
      typing,
      mouseover,
    },
  });

  showMessage("Configuration saved", true);
});

//we load back the configuration
chrome.storage.sync.get(["moodleGPT"]).then(function (storage) {
  if (storage.moodleGPT) {
    const config = storage.moodleGPT;
    inputsText.forEach(
      (key) => (document.querySelector("#" + key).value = config[key] || "")
    );
    inputsCheckbox.forEach(
      (key) => (document.querySelector("#" + key).checked = config[key] || "")
    );
  }
});
