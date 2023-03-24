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
    });
  } else {
    input.textContent = response;
  }

  return true;
}

export default handleContentEditable;
