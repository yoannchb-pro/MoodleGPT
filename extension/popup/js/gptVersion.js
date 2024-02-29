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

checkCanIncludeImages();
modelInput.addEventListener('input', checkCanIncludeImages);

/**
 * Get the last ChatGPT version
 */
function getLastChatGPTVersion() {
  const apiKeySelector = document.querySelector('#apiKey');
  const reloadModel = document.querySelector('#reloadModel');

  let apiKey = apiKeySelector.value?.trim();

  // If the api key is set we enable the button to get the last chatgpt version
  function checkFiledApiKey() {
    if (apiKey) {
      reloadModel.removeAttribute('disabled');
      reloadModel.setAttribute('title', 'Get last ChatGPT version');
      return;
    }

    reloadModel.setAttribute('disabled', true);
    reloadModel.setAttribute('title', 'Provide an api key first');
  }
  checkFiledApiKey();

  // Check if the api key is set
  apiKeySelector.addEventListener('input', function () {
    apiKey = apiKeySelector.value.trim();
    checkFiledApiKey();
  });

  // Event listener to handle a click on the relaod icon button
  reloadModel.addEventListener('click', async function () {
    if (!apiKey) return;

    try {
      const req = await fetch('https://api.openai.com/v1/models', {
        headers: {
          Authorization: `Bearer ${apiKey}`
        }
      });
      const rep = await req.json();
      const model = rep.data.find(model => model.id.startsWith('gpt'));
      modelInput.value = model.id;
    } catch (err) {
      console.error(err);
      showMessage({ msg: 'Failed to fetch last ChatGPT version', error: true });
    }
  });
}
