const settings: HTMLElement = document.querySelector('#settings')!;
const advencedSettings: HTMLElement = document.querySelector('#advanced-settings')!;
const switchSettings: HTMLLinkElement = document.querySelector('#switch-settings')!;

export function switchSettingsMode() {
  const isAdvancedSettings = advencedSettings.style.display === 'flex';

  if (isAdvancedSettings) {
    settings.style.display = 'flex';
    advencedSettings.style.display = 'none';
    switchSettings.textContent = 'Advanced settings';
  } else {
    settings.style.display = 'none';
    advencedSettings.style.display = 'flex';
    switchSettings.textContent = 'Go back to settings';
  }
}
switchSettings.addEventListener('click', function (event) {
  event.preventDefault();
  switchSettingsMode();
});
