export const globalData = { actualMode: 'autocomplete' };

export const globalProvider = { value: 'openai' as 'openai' | 'ollama' };

export const inputsCheckbox = [
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
export const mode = document.querySelector('#mode')!;
export const modes = mode.querySelectorAll('button')!;
