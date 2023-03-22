import Config from "../../types/config";

/**
 * Handle textbox
 * @param config
 * @param inputList
 * @param response
 * @returns
 */
function handleTextbox(
  config: Config,
  inputList: NodeListOf<HTMLElement>,
  response: string
): boolean {
  const input = inputList[0] as HTMLInputElement | HTMLTextAreaElement;

  if (
    inputList.length !== 1 ||
    (input.tagName !== "TEXTAREA" && input.type !== "text")
  )
    return false;

  if (config.typing) {
    let index = 0;
    input.addEventListener("keydown", function (event: KeyboardEvent) {
      if (event.key === "Backspace") index = response.length + 1;
      if (index > response.length) return;
      event.preventDefault();
      input.value = response.slice(0, ++index);
    });
  } else {
    input.value = response;
  }

  return true;
}

export default handleTextbox;
