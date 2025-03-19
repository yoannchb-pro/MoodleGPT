import { globalData, inputsCheckbox, modes } from './data';
import { checkCanIncludeImages } from './gpt-version';
import { handleModeChange } from './mode-handler';
import './version';
import './settings';

import { showMessage } from './utils';

const saveBtn = document.querySelector('.save')!;

// inputs id
const inputsText = ['apiKey', 'code', 'model', 'baseURL', 'maxTokens'];

// Save the configuration
saveBtn.addEventListener('click', function () {
  const [apiKey, code, model, baseURL, maxTokens] = inputsText.map(selector =>
    (document.querySelector('#' + selector) as HTMLInputElement).value.trim()
  );
  const [logs, title, cursor, typing, mouseover, infinite, timeout, history, includeImages] =
    inputsCheckbox.map(selector => {
      const element: HTMLInputElement = document.querySelector('#' + selector)!;
      return element.checked && element.parentElement!.style.display !== 'none';
    });

  if (!apiKey || !model) {
    showMessage({ msg: 'Please complete all the form', isError: true });
    return;
  }

  if (code.length > 0 && code.length < 2) {
    showMessage({
      msg: 'The code should at least contain 2 characters',
      isError: true
    });
    return;
  }

  chrome.storage.sync.set({
    moodleGPT: {
      apiKey,
      code,
      model,
      baseURL,
      maxTokens: maxTokens ? parseInt(maxTokens) : undefined,
      logs,
      title,
      cursor,
      typing,
      mouseover,
      infinite,
      timeout,
      history,
      includeImages,
      mode: globalData.actualMode
    }
  });

  showMessage({ msg: 'Configuration saved' });
});

// we load back the configuration
chrome.storage.sync.get(['moodleGPT']).then(function (storage) {
  const config = storage.moodleGPT;

  if (config) {
    if (config.mode) {
      globalData.actualMode = config.mode;
      for (const mode of modes) {
        if (mode.value === config.mode) {
          mode.classList.remove('not-selected');
        } else {
          mode.classList.add('not-selected');
        }
      }
    }

    inputsText.forEach(key =>
      config[key]
        ? ((document.querySelector('#' + key) as HTMLInputElement).value = config[key])
        : null
    );
    inputsCheckbox.forEach(
      key => ((document.querySelector('#' + key) as HTMLInputElement).checked = config[key] || '')
    );
  }

  handleModeChange();
  checkCanIncludeImages();
});
