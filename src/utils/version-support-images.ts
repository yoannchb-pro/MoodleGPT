/**
 * Check if the current ChatGPT version is greater or equal to 4
 * @param version
 * @returns
 */
function isGPTModelGreaterOrEqualTo4(version: string): boolean {
  const versionNumber = version.match(/gpt-(\d+)/);
  if (!versionNumber?.[1]) {
    return false;
  }
  return Number(versionNumber[1]) >= 4;
}

export default isGPTModelGreaterOrEqualTo4;
