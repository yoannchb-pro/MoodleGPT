import { globalData, globalProvider, inputsCheckbox, modes } from './data';
import { checkCanIncludeImages } from './gpt-version';
import { handleModeChange } from './mode-handler';
import './version';
import './settings';

import { showMessage } from './utils';

const saveBtn = document.querySelector('.save')!;
const providerSelector = document.querySelector('#provider') as HTMLSelectElement;
const apiKeyInput = document.querySelector('#apiKey') as HTMLInputElement;
const codeInput = document.querySelector('#code') as HTMLInputElement;
const modelInput = document.querySelector('#model') as HTMLInputElement;
const baseURLInput = document.querySelector('#baseURL') as HTMLInputElement;
const maxTokensInput = document.querySelector('#maxTokens') as HTMLInputElement;
const ollamaTimeoutInput = document.querySelector('#ollamaTimeout') as HTMLInputElement;
const ollamaTimeoutLine = document.querySelector('#ollamaTimeout-line') as HTMLElement;
const webSearchInput = document.querySelector('#webSearch') as HTMLInputElement;
const webSearchLine = document.querySelector('#webSearch-line') as HTMLElement;
const ragDocumentsInput = document.querySelector('#ragDocuments') as HTMLInputElement;
const ragDocumentsLine = document.querySelector('#ragDocuments-line') as HTMLElement;
const uploadDocsLine = document.querySelector('#uploadDocs-line') as HTMLElement;
const manageDocsLine = document.querySelector('#manageDocs-line') as HTMLElement;
const docUploadInput = document.querySelector('#docUpload') as HTMLInputElement;
const clearDocsBtn = document.querySelector('#clearDocs') as HTMLButtonElement;
const docsCount = document.querySelector('#docsCount') as HTMLSpanElement;

function setTextValue(selector: string, value?: string | number) {
  const input = document.querySelector(selector) as HTMLInputElement;
  input.value = typeof value === 'number' ? String(value) : value || '';
}

function splitChunks(text: string, chunkSize = 1200, overlap = 200) {
  const clean = text.replace(/\r/g, '\n').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  const chunks: string[] = [];
  let start = 0;

  while (start < clean.length) {
    const end = Math.min(clean.length, start + chunkSize);
    chunks.push(clean.slice(start, end).trim());
    if (end >= clean.length) break;
    start = Math.max(0, end - overlap);
  }

  return chunks.filter(Boolean);
}

async function readFileText(file: File): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

async function loadDocs() {
  const data = await chrome.storage.local.get(['moodleGPTDocuments']);
  return (data.moodleGPTDocuments as Array<{
    id: string;
    name: string;
    size: number;
    type: string;
    chunks: string[];
    createdAt: number;
  }>) || [];
}

async function refreshDocsCount() {
  const docs = await loadDocs();
  docsCount.textContent = docs.length ? `${docs.length} file(s) stored` : 'No documents uploaded';
}

saveBtn.addEventListener('click', function () {
  const apiKey = apiKeyInput.value.trim();
  const code = codeInput.value.trim();
  const model = modelInput.value.trim();
  const baseURL = baseURLInput.value.trim();
  const maxTokens = maxTokensInput.value.trim();
  const ollamaTimeout = ollamaTimeoutInput.value.trim();
  const provider = providerSelector.value as 'openai' | 'ollama';
  const [logs, title, cursor, typing, mouseover, infinite, timeout, history, includeImages] =
    inputsCheckbox.map(selector => {
      const element: HTMLInputElement = document.querySelector('#' + selector)!;
      return element.checked && element.parentElement!.style.display !== 'none';
    });

  if (!model) {
    showMessage({ msg: 'Please complete all the form', isError: true });
    return;
  }

  if (provider === 'openai' && !apiKey) {
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
      provider,
      apiKey: provider === 'ollama' ? apiKey || 'ollama' : apiKey,
      code,
      model,
      baseURL,
      maxTokens: maxTokens ? parseInt(maxTokens) : undefined,
      ollamaTimeout: ollamaTimeout ? parseInt(ollamaTimeout) : 0,
      webSearch: webSearchInput.checked,
      ragDocuments: ragDocumentsInput.checked,
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

chrome.storage.sync.get(['moodleGPT']).then(function (storage) {
  const config = storage.moodleGPT;

  if (config) {
    providerSelector.value = config.provider || 'openai';

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

    setTextValue('#apiKey', config.apiKey);
    setTextValue('#code', config.code);
    setTextValue('#model', config.model);
    setTextValue('#baseURL', config.baseURL);
    setTextValue('#maxTokens', config.maxTokens);
    setTextValue('#ollamaTimeout', config.ollamaTimeout);
    webSearchInput.checked = !!config.webSearch;
    ragDocumentsInput.checked = !!config.ragDocuments;

    inputsCheckbox.forEach(
      key => ((document.querySelector('#' + key) as HTMLInputElement).checked = config[key] || '')
    );
  }

  function syncProviderUi() {
    const isOllama = providerSelector.value === 'ollama';
    globalProvider.value = providerSelector.value as 'openai' | 'ollama';
    apiKeyInput.parentElement!.style.display = isOllama ? 'none' : 'flex';
    ollamaTimeoutLine.style.display = isOllama ? 'flex' : 'none';
    webSearchLine.style.display = isOllama ? 'flex' : 'none';
    ragDocumentsLine.style.display = 'flex';
    uploadDocsLine.style.display = 'flex';
    manageDocsLine.style.display = 'flex';
    baseURLInput.value = baseURLInput.value || (isOllama ? 'http://127.0.0.1:8787/v1' : '');
    if (isOllama && !ollamaTimeoutInput.value) ollamaTimeoutInput.value = '0';
    const apiKeyRequired = apiKeyInput.parentElement!.querySelector('.required') as HTMLElement;
    apiKeyRequired.style.display = isOllama ? 'none' : 'inline';
    checkCanIncludeImages();
  }

  providerSelector.addEventListener('change', syncProviderUi);
  syncProviderUi();

  docUploadInput.addEventListener('change', async () => {
    const files = Array.from(docUploadInput.files || []);
    if (!files.length) return;

    const existing = await loadDocs();
    const next = [...existing];

    for (const file of files) {
      if (!/\.(txt|md|markdown|csv|json|html?|log)$/i.test(file.name)) {
        continue;
      }

      const text = await readFileText(file);
      const chunks = splitChunks(text);
      if (!chunks.length) continue;

      next.push({
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        type: file.type,
        chunks,
        createdAt: Date.now()
      });
    }

    await chrome.storage.local.set({ moodleGPTDocuments: next });
    await refreshDocsCount();
    docUploadInput.value = '';
    showMessage({ msg: 'Documents uploaded' });
  });

  clearDocsBtn.addEventListener('click', async () => {
    await chrome.storage.local.remove(['moodleGPTDocuments']);
    await refreshDocsCount();
    showMessage({ msg: 'Documents cleared' });
  });

  refreshDocsCount();

  handleModeChange();
});
