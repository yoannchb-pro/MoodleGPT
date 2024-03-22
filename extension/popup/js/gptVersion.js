'use strict';

const apiKeySelector = document.querySelector('#apiKey');
const inputModel = document.querySelector('#model');
const modelsList = document.querySelector('#models');
const imagesIntegrationLine = document.querySelector('#includeImages-line');

/**
 * Check if the gpt version is at least 4 to show the option 'Include images'
 */
function checkCanIncludeImages() {
  const version = inputModel.value;
  if (isCurrentVersionSupportingImages(version)) {
    imagesIntegrationLine.style.display = 'flex';
  } else {
    imagesIntegrationLine.style.display = 'none';
  }
}

inputModel.addEventListener('input', checkCanIncludeImages);

// We populate the datalist of the chatgpt model
async function populateDatalistWithGptVersions() {
  const apiKey = apiKeySelector.value?.trim();

  if (!apiKey) return;

  inputModel.innerHTML = '';

  try {
    const req = await fetch('https://api.openai.com/v1/models', {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    });
    const rep = await req.json();
    rep.data.sort((a, b) => b.id.localeCompare(a.id)); // we sort the model to get the best chatgpt version first
    const models = rep.data.filter(model => model.id.startsWith('gpt'));

    for (const model of models) {
      const opt = document.createElement('option');
      opt.value = model.id;
      opt.textContent = model.id;
      modelsList.appendChild(opt);
    }

    checkCanIncludeImages();
  } catch (err) {
    console.error(err);
    showMessage({ msg: 'Failed to fetch last ChatGPT versions', error: true });
  }
}

inputModel.addEventListener('focus', populateDatalistWithGptVersions);
