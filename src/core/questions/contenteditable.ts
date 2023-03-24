import Config from "../../types/config";

function handleContentEditable(
  config: Config,
  inputList: NodeListOf<HTMLElement>,
  response: string
): boolean {
  const input = inputList[0];

  if (
    inputList.length !== 1 ||
    input.getAttribute("contenteditable") !== "true"
  )
    return false;

  if (config.typing) {
    let index = 0;
    input.addEventListener("keydown", function (event: KeyboardEvent) {
      if (event.key === "Backspace") index = response.length + 1;
      if (index > response.length) return;
      event.preventDefault();
      input.textContent = response.slice(0, ++index);

      //put the cursor at the end
      input.focus();
      const range = document.createRange();
      range.selectNodeContents(input);
      range.collapse(false);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    });
  } else {
    input.textContent = response;
  }

  return true;
}

export default handleContentEditable;
