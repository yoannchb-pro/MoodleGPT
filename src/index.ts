import codeListener from "./core/code-listener";

chrome.storage.sync.get(["moodleGPT"]).then(function (storage) {
  const config = storage.moodleGPT;

  if (!config) throw new Error("Please configure MoodleGPT into the extension");

  codeListener(config);
});
