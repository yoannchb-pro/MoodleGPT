'use strict';

const modelInput = document.querySelector('#model');
const imagesIntegrationLine = document.querySelector('#includeImages-line');

/**
 * Check if the gpt version is at least 4 to show the option 'Include images'
 */
function checkCanIncludeImages() {
  const version = modelInput.value;
  if (isCurrentVersionSupportingImages(version)) {
    imagesIntegrationLine.style.display = 'flex';
  } else {
    imagesIntegrationLine.style.display = 'none';
  }
}

modelInput.addEventListener('input', checkCanIncludeImages);

/**
 * Get the list of chatgpt versions
 */
function getLastChatGPTVersion(selectedModel) {
  const apiKeySelector = document.querySelector('#apiKey');
  const selectModel = document.querySelector('#model');

  let apiKey = apiKeySelector.value?.trim();

  // If the api key is set we enable the button to get the last chatgpt version
  async function getGptVersions() {
    if (!apiKey) {
      selectModel.setAttribute('disabled', true);
      return;
    }

    selectModel.innerHTML = '';

    try {
      const req = await fetch('https://api.openai.com/v1/models', {
        headers: {
          Authorization: `Bearer ${apiKey}`
        }
      });
      const rep = await req.json();
      rep.data.sort((a, b) => b.id.localeCompare(a.id)); // we sort the model to get the best chatgpt version
      const models = rep.data.filter(model => model.id.startsWith('gpt'));

      for (const model of models) {
        const opt = document.createElement('option');
        opt.value = model.id;
        opt.textContent = model.id;
        opt.selected = selectedModel && model.id === selectedModel;
        selectModel.appendChild(opt);
      }

      checkCanIncludeImages();
    } catch (err) {
      console.error(err);
      showMessage({ msg: 'Failed to fetch last ChatGPT version', error: true });
    }

    selectModel.removeAttribute('disabled');
  }

  // Check if the api key is set
  apiKeySelector.addEventListener('blur', function () {
    apiKey = apiKeySelector.value.trim();
    getGptVersions();
  });

  getGptVersions();
}
