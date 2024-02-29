'use strict';

const mode = document.querySelector('#mode');
const modes = mode.querySelectorAll('button');

let actualMode = 'autocomplete';

/* inputs id that need to be disabled for a specific mode */
const disabledForThisMode = {
  autocomplete: [],
  clipboard: ['typing', 'mouseover'],
  'question-to-answer': ['typing', 'infinite', 'mouseover']
};

/**
 * Handle when a mode change to show specific input or to hide them
 */
function handleModeChange() {
  const needDisable = disabledForThisMode[actualMode];
  const dontNeedDisable = inputsCheckbox.filter(input => !needDisable.includes(input));
  for (const id of needDisable) {
    document.querySelector('#' + id).parentElement.style.display = 'none';
  }
  for (const id of dontNeedDisable) {
    document.querySelector('#' + id).parentElement.style.display = null;
  }
}

/* Mode handler */
for (const button of modes) {
  button.addEventListener('click', function () {
    const value = button.value;
    actualMode = value;
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
