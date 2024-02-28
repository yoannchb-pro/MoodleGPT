import type Config from "@typing/config";
import titleIndications from "@utils/title-indications";
import reply from "./reply";

type Listener = {
  element: HTMLElement;
  fn: (this: HTMLElement, ev: MouseEvent) => any;
};

const pressedKeys: string[] = [];
const listeners: Listener[] = [];

/**
 * Create a listener on the keyboard to inject the code
 * @param config
 */
function codeListener(config: Config) {
  document.body.addEventListener("keydown", function (event) {
    pressedKeys.push(event.key);
    if (pressedKeys.length > config.code!.length) pressedKeys.shift();
    if (pressedKeys.join("") === config.code) {
      pressedKeys.length = 0;
      setUpMoodleGpt(config);
    }
  });
}

/**
 * Remove the event listener on a specific question
 * @param element
 */
function removeListener(element: HTMLElement) {
  const index = listeners.findIndex((listener) => listener.element === element);
  if (index !== -1) {
    const listener = listeners.splice(index, 1)[0];
    listener.element.removeEventListener("click", listener.fn);
  }
}

/**
 * Setup moodleGPT into the page (remove/injection)
 * @param config
 * @returns
 */
function setUpMoodleGpt(config: Config) {
  // Removing events if there are already declared
  if (listeners.length > 0) {
    for (const listener of listeners) {
      if (config.cursor) listener.element.style.cursor = "initial";
      listener.element.removeEventListener("click", listener.fn);
    }
    if (config.title) titleIndications("Removed");
    listeners.length = 0;
    return;
  }

  // Query to find inputs and forms
  const inputTypeQuery = ["checkbox", "radio", "text", "number"]
    .map((e) => `input[type="${e}"]`)
    .join(",");
  const inputQuery = inputTypeQuery + ", textarea, select, [contenteditable]";
  const forms = document.querySelectorAll(".formulation");

  // For each form we inject a function on the queqtion
  for (const form of forms) {
    const questionElement: HTMLElement | null = form.querySelector(".qtext");

    if (questionElement === null) continue;

    if (config.cursor) questionElement.style.cursor = "pointer";

    const injectionFunction = reply.bind(null, {
      config,
      questionElement,
      form: form as HTMLElement,
      inputQuery,
      removeListener: () => removeListener(questionElement),
    });

    listeners.push({ element: questionElement, fn: injectionFunction });
    questionElement.addEventListener("click", injectionFunction);
  }

  if (config.title) titleIndications("Injected");
}

export { codeListener, removeListener, setUpMoodleGpt };
