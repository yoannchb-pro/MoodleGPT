/**
 * Show message into the popup
 */
export function showMessage({
  msg,
  isError,
  isInfinite
}: {
  msg: string;
  isError?: boolean;
  isInfinite?: boolean;
}) {
  const message: HTMLElement = document.querySelector('#message')!;
  message.style.color = isError ? 'red' : 'limegreen';
  message.textContent = msg;
  message.style.display = 'block';
  if (!isInfinite) setTimeout(() => (message.style.display = 'none'), 5000);
}

/**
 * Check if the current model support images integrations
 * @param {string} version
 * @returns
 */
export function isCurrentVersionSupportingImages(version: string) {
  const versionNumber = version.match(/gpt-(\d+)/);
  if (!versionNumber?.[1]) {
    return false;
  }
  return Number(versionNumber[1]) >= 4;
}
