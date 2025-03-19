import { globalData, inputsCheckbox, modes } from './data';

// input to don't take in consideration
const toExcludes = ['includeImages'];

// inputs id that need to be disabled for a specific mode
const disabledForThisMode: Record<string, string[]> = {
  autocomplete: [],
  clipboard: ['typing', 'mouseover'],
  'question-to-answer': ['typing', 'infinite', 'mouseover']
};

/**
 * Handle when a mode change to show specific input or to hide them
 */
export function handleModeChange() {
  const needDisable = disabledForThisMode[globalData.actualMode];
  const dontNeedDisable = inputsCheckbox.filter(
    input => !needDisable.includes(input) && !toExcludes.includes(input)
  );
  for (const id of needDisable) {
    document.querySelector('#' + id)!.parentElement!.style.display = 'none';
  }
  for (const id of dontNeedDisable) {
    document.querySelector('#' + id)!.parentElement!.style.display = '';
  }
}

// Mode hanlder
for (const button of modes) {
  button.addEventListener('click', function () {
    const value = button.value;
    globalData.actualMode = value;
    for (const mode of modes) {
      if (mode.value !== value) {
        mode.classList.add('not-selected');
      } else {
        mode.classList.remove('not-selected');
      }
    }
    handleModeChange();
  });
}
