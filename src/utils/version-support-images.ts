/**
 * Check if the current ChatGPT version support image sending
 * @param version
 * @returns
 */
function isCurrentVersionSupportingImages(version: string): boolean {
  const versionNumber = version.match(/gpt-(\d+)/);
  if (!versionNumber?.[1]) {
    return false;
  }
  return Number(versionNumber[1]) >= 4;
}

export default isCurrentVersionSupportingImages;
