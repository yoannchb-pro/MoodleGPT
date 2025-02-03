import OpenAI from 'openai';
import { isCurrentVersionSupportingImages, showMessage } from './utils';

const apiKeySelector: HTMLInputElement = document.querySelector('#apiKey')!;
const inputModel: HTMLInputElement = document.querySelector('#model')!;
const modelsList: HTMLElement = document.querySelector('#models')!;
const imagesIntegrationLine: HTMLInputElement = document.querySelector('#includeImages-line')!;
const baseURLSelector: HTMLInputElement = document.querySelector('#baseURL')!;
/**
 * Check if the gpt version is at least 4 to show the option 'Include images'
 */
export function checkCanIncludeImages() {
  const version = inputModel.value;
  if (isCurrentVersionSupportingImages(version)) {
    imagesIntegrationLine.style.display = 'flex';
  } else {
    imagesIntegrationLine.style.display = 'none';
  }
}

inputModel.addEventListener('input', checkCanIncludeImages);

// We populate the datalist of the chatgpt model
export async function populateDatalistWithGptVersions() {
  const apiKey = apiKeySelector.value?.trim();
  const baseURL = baseURLSelector.value?.trim();

  if (!apiKey) return;

  inputModel.innerHTML = '';

  try {
    const client = new OpenAI({
      apiKey,
      baseURL,
      dangerouslyAllowBrowser: true
    });

    const rep = await client.models.list();

    const models = rep.data.filter(
      model =>
        model.id.startsWith('gpt') || model.id.startsWith('o1') || model.id.startsWith('chatgpt')
    );
    models.sort((a, b) => b.id.localeCompare(a.id)); // we sort the model to get the best chatgpt version first

    for (const model of models) {
      const opt = document.createElement('option');
      opt.value = model.id;
      opt.textContent = model.id;
      modelsList.appendChild(opt);
    }

    checkCanIncludeImages();
  } catch (err: any) {
    console.error(err);
    showMessage({ msg: err, isError: true });
  }
}

inputModel.addEventListener('focus', populateDatalistWithGptVersions);

export async function checkModel() {
  const model = inputModel.value?.trim();
  const apiKey = apiKeySelector.value?.trim();
  const baseURL = baseURLSelector.value?.trim();

  try {
    const client = new OpenAI({ apiKey, baseURL, dangerouslyAllowBrowser: true });
    await client.chat.completions.create({
      model,
      messages: [{ role: 'user', content: 'reply just pong' }]
    });
    showMessage({ msg: 'The model is valid!' });
  } catch (err: any) {
    showMessage({ msg: err, isError: true });
  }
}

const checkModelBtn: HTMLElement = document.querySelector('#check-model')!;
checkModelBtn.addEventListener('click', checkModel);
