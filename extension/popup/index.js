const saveBtn = document.querySelector(".save");
const message = document.querySelector("#message");

const inputsText = ["apiKey", "code", "model"];
const inputsCheckbox = [
  "logs",
  "title",
  "cursor",
  "typing",
  "mouseover",
  "infinite",
  "table",
  "timeout",
];

function showMessage(messageTxt, valide) {
  message.style.color = valide ? "limegreen" : "red";
  message.textContent = messageTxt;
  message.style.display = "block";
  setTimeout(() => (message.style.display = "none"), 5000);
}

//save the configuration
saveBtn.addEventListener("click", function () {
  const [apiKey, code, model] = inputsText.map((selector) =>
    document.querySelector("#" + selector).value.trim()
  );
  const [logs, title, cursor, typing, mouseover, infinite, table, timeout] =
    inputsCheckbox.map(
      (selector) => document.querySelector("#" + selector).checked
    );

  if (!apiKey || !code || !model) {
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
      model,
      logs,
      title,
      cursor,
      typing,
      mouseover,
      infinite,
      table,
      timeout,
    },
  });

  showMessage("Configuration saved", true);
});

//we load back the configuration
chrome.storage.sync.get(["moodleGPT"]).then(function (storage) {
  if (storage.moodleGPT) {
    const config = storage.moodleGPT;
    inputsText.forEach((key) =>
      config[key]
        ? (document.querySelector("#" + key).value = config[key])
        : null
    );
    inputsCheckbox.forEach(
      (key) => (document.querySelector("#" + key).checked = config[key] || "")
    );
  }

  //getting the last chatgpt version
  const apiKeySelector = document.querySelector("#apiKey");
  const reloadModel = document.querySelector("#reloadModel");

  let apiKey = apiKeySelector.value;

  function checkFileldApiKey() {
    if (apiKey) {
      reloadModel.removeAttribute("disabled");
      reloadModel.setAttribute("title", "Get last ChatGPT version");
      return;
    }

    reloadModel.setAttribute("disabled", true);
    reloadModel.setAttribute("title", "Provide an api key first");
  }

  checkFileldApiKey();

  apiKeySelector.addEventListener("change", function (event) {
    apiKey = apiKeySelector.value.trim();
    checkFileldApiKey();
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
});
