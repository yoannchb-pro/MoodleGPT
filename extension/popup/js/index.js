'use strict';

const saveBtn = document.querySelector('.save');

// inputs id
const inputsText = ['apiKey', 'code', 'model'];
const inputsCheckbox = [
  'logs',
  'title',
  'cursor',
  'typing',
  'mouseover',
  'infinite',
  'timeout',
  'history',
  'includeImages'
];

// Save the configuration
saveBtn.addEventListener('click', function () {
  const [apiKey, code, model] = inputsText.map(selector =>
    document.querySelector('#' + selector).value.trim()
  );
  const [logs, title, cursor, typing, mouseover, infinite, timeout, history, includeImages] =
    inputsCheckbox.map(selector => {
      const element = document.querySelector('#' + selector);
      return element.checked && element.parentElement.style.display !== 'none';
    });

  if (!apiKey || !model) {
    showMessage({ msg: 'Please complete all the form', error: true });
    return;
  }

  if (code.length > 0 && code.length < 3) {
    showMessage({
      msg: 'The code should at least contain 3 characters',
      error: true
    });
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
      history,
      includeImages,
      mode: actualMode
    }
  });

  showMessage({ msg: 'Configuration saved' });
});

// we load back the configuration
chrome.storage.sync.get(['moodleGPT']).then(function (storage) {
  const config = storage.moodleGPT;

  if (config) {
    if (config.mode) {
      actualMode = config.mode;
      for (const mode of modes) {
        if (mode.value === config.mode) {
          mode.classList.remove('not-selected');
        } else {
          mode.classList.add('not-selected');
        }
      }
    }

    inputsText.forEach(key =>
      config[key] ? (document.querySelector('#' + key).value = config[key]) : null
    );
    inputsCheckbox.forEach(key => (document.querySelector('#' + key).checked = config[key] || ''));
  }

  handleModeChange();
  checkCanIncludeImages();
});
