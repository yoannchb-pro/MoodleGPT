(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
})((function () { 'use strict';

  /**
   * Show some informations into the document title and remove it after 3000ms
   * @param text
   */
  function titleIndications(text) {
      const backTitle = document.title;
      document.title = text;
      setTimeout(() => (document.title = backTitle), 3000);
  }

  /******************************************************************************
  Copyright (c) Microsoft Corporation.

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */

  function __awaiter(thisArg, _arguments, P, generator) {
      function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
      return new (P || (P = Promise))(function (resolve, reject) {
          function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
          function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
          function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
  }

  class Logs {
      static question(text) {
          const css = "color: cyan";
          console.log("%c[QUESTION]: %s", css, text);
      }
      static responseTry(text, valide) {
          const css = "color: " + (valide ? "green" : "red");
          console.log("%c[CHECKING]: %s", css, text);
      }
      static array(arr) {
          console.log("[CORRECTS] ", arr);
      }
      static response(text) {
          console.log(text);
      }
  }

  /**
   * Normlize text
   * @param text
   */
  function normalizeText(text) {
      return text
          .replace(/\n+/g, "\n")
          .replace(/[ \t]+/g, " ")
          .toLowerCase()
          .trim()
          .replace(/^[a-z\d]\.\s/gi, "") //a. text, b. text, c. text, 1. text, 2. text, 3.text
          .replace(/\n[a-z\d]\.\s/gi, "\n"); //same but with new line
  }

  /**
   * Get the response from chatGPT api
   * @param config
   * @param question
   * @returns
   */
  function getChatGPTResponse(config, question) {
      return __awaiter(this, void 0, void 0, function* () {
          const req = yield fetch("https://api.openai.com/v1/chat/completions", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${config.apiKey}`,
              },
              body: JSON.stringify({
                  model: config.model && config.model !== "" ? config.model : "gpt-3.5-turbo",
                  messages: [{ role: "user", content: question }],
                  temperature: 0.8,
                  top_p: 1.0,
                  presence_penalty: 1.0,
                  stop: null,
              }),
          });
          const rep = yield req.json();
          const response = rep.choices[0].message.content;
          return normalizeText(response);
      });
  }

  /**
   * Normalize the question and add sub informations
   * @param langage
   * @param question
   * @returns
   */
  function normalizeQuestion(langage, question) {
      const finalQuestion = `Give a short response as possible for this question, reply in ${langage && langage !== ""
        ? 'this langage "' + langage + '"'
        : "the following question langage"} and only show the result: 
      ${question} 
      (If you have to choose between multiple results only show the corrects one, separate them with new line and take the same text as the question)`;
      return normalizeText(finalQuestion);
  }

  /**
   * Handle checkbox and input elements
   * @param config
   * @param inputList
   * @param response
   */
  function handleRadioAndCheckbox(config, inputList, response) {
      const input = inputList === null || inputList === void 0 ? void 0 : inputList[0];
      if (!input || (input.type !== "checkbox" && input.type !== "radio"))
          return false;
      for (const input of inputList) {
          const content = normalizeText(input.parentNode.textContent);
          const valide = response.includes(content);
          if (config.logs)
              Logs.responseTry(content, valide);
          if (valide) {
              if (config.mouseover) {
                  input.addEventListener("mouseover", () => (input.checked = true), {
                      once: true,
                  });
              }
              else {
                  input.checked = true;
              }
          }
      }
      return true;
  }

  /**
   * Handle select elements (and put in order select)
   * @param config
   * @param inputList
   * @param response
   * @returns
   */
  function handleSelect(config, inputList, response) {
      if (inputList.length === 0 || inputList[0].tagName !== "SELECT")
          return false;
      let correct = response.split("\n");
      if (correct.length === 1 && correct.length !== inputList.length)
          correct = response.split(",");
      if (config.logs)
          Logs.array(correct);
      for (let j = 0; j < inputList.length; ++j) {
          const options = inputList[j].querySelectorAll("option");
          for (const option of options) {
              const content = normalizeText(option.textContent);
              const valide = correct[j].includes(content);
              //if it's a put in order
              if (!isNaN(parseInt(content))) {
                  const content = normalizeText(option.parentNode
                      .closest("tr")
                      .querySelector(".text").textContent);
                  const index = correct.findIndex((c) => {
                      const valide = c.includes(content);
                      if (config.logs)
                          Logs.responseTry(content, valide);
                      return valide;
                  });
                  if (index !== -1) {
                      if (config.mouseover) {
                          options[index + 1].closest("select").addEventListener("click", function () {
                              options[index + 1].selected = "selected";
                          }, { once: true });
                      }
                      else {
                          options[index + 1].selected = "selected";
                      }
                      break;
                  }
              }
              //end put in order
              if (config.logs)
                  Logs.responseTry(content, valide);
              if (valide) {
                  if (config.mouseover) {
                      option
                          .closest("select")
                          .addEventListener("click", () => (option.selected = true), {
                          once: true,
                      });
                  }
                  else {
                      option.selected = true;
                  }
                  break;
              }
          }
      }
      return true;
  }

  /**
   * Handle textbox
   * @param config
   * @param inputList
   * @param response
   * @returns
   */
  function handleTextbox(config, inputList, response) {
      const input = inputList[0];
      if (inputList.length !== 1 ||
          (input.tagName !== "TEXTAREA" && input.type !== "text"))
          return false;
      if (config.typing) {
          let index = 0;
          input.addEventListener("keydown", function (event) {
              if (event.key === "Backspace")
                  index = response.length + 1;
              if (index > response.length)
                  return;
              event.preventDefault();
              input.value = response.slice(0, ++index);
          });
      }
      else {
          input.value = response;
      }
      return true;
  }

  /**
   * Copy the response in the clipboard if we can automaticaly fill the question
   * @param config
   * @param inputList
   * @param response
   * @param force Force the copy to clipboard
   * @returns
   */
  function handleClipboard(config, response) {
      if (config.title)
          titleIndications("Copied to clipboard");
      navigator.clipboard.writeText(response);
  }

  /**
   * Handle number input
   * @param config
   * @param inputList
   * @param response
   * @returns
   */
  function handleNumber(config, inputList, response) {
      var _a, _b;
      const input = inputList[0];
      if (inputList.length !== 1 || input.type !== "number")
          return false;
      const number = (_b = (_a = response.match(/\d+([,\.]\d+)?/gi)) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.replace(",", ".");
      if (!number)
          return false;
      if (config.typing) {
          let index = 0;
          input.addEventListener("keydown", function (event) {
              if (event.key === "Backspace")
                  index = number.length + 1;
              if (index > number.length)
                  return;
              event.preventDefault();
              if (number.slice(index, index + 1) === ".")
                  ++index;
              input.value = number.slice(0, ++index);
          });
      }
      else {
          input.value = number;
      }
      return true;
  }

  /**
   * Reply to the question
   * @param config
   * @param hiddenButton
   * @param form
   * @param query
   * @returns
   */
  function reply(config, hiddenButton, form, query) {
      var _a;
      return __awaiter(this, void 0, void 0, function* () {
          if (config.cursor)
              hiddenButton.style.cursor = "wait";
          (_a = form.querySelector(".accesshide")) === null || _a === void 0 ? void 0 : _a.remove();
          const question = normalizeQuestion(config.langage, form.textContent);
          const inputList = form.querySelectorAll(query);
          const response = yield getChatGPTResponse(config, question);
          if (config.logs) {
              Logs.question(question);
              Logs.response(response);
          }
          if (config.cursor)
              hiddenButton.style.cursor = config.infinite ? "pointer" : "initial";
          const handlers = [
              handleTextbox,
              handleNumber,
              handleSelect,
              handleRadioAndCheckbox,
          ];
          for (const handler of handlers) {
              if (handler(config, inputList, response))
                  return;
          }
          handleClipboard(config, response);
      });
  }

  const pressedKeys = [];
  const listeners = [];
  /**
   * Create a listener on the keyboard to inject the code
   * @param config
   */
  function codeListener(config) {
      document.body.addEventListener("keydown", function (event) {
          pressedKeys.push(event.key);
          if (pressedKeys.length > config.code.length)
              pressedKeys.shift();
          if (pressedKeys.join("") === config.code) {
              pressedKeys.length = 0;
              setUpMoodleGpt(config);
          }
      });
  }
  /**
   * Setup moodleGPT into the page (remove/injection)
   * @param config
   * @returns
   */
  function setUpMoodleGpt(config) {
      //removing events
      if (listeners.length > 0) {
          for (const listener of listeners) {
              if (config.cursor)
                  listener.element.style.cursor = "initial";
              listener.element.removeEventListener("click", listener.fn);
          }
          if (config.title)
              titleIndications("Removed");
          listeners.length = 0;
          return;
      }
      //injection
      const inputQuery = ["checkbox", "radio", "text", "number"]
          .map((e) => `input[type="${e}"]`)
          .join(",");
      const query = inputQuery + ", textarea, select";
      const forms = Array.from(document.querySelectorAll(".formulation"));
      for (const form of forms) {
          const hiddenButton = form.querySelector(".qtext");
          if (config.cursor)
              hiddenButton.style.cursor = "pointer";
          const fn = reply.bind(null, config, hiddenButton, form, query);
          listeners.push({ element: hiddenButton, fn });
          hiddenButton.addEventListener("click", fn, { once: !config.infinite });
      }
      if (config.title)
          titleIndications("Injected");
  }

  chrome.storage.sync.get(["moodleGPT"]).then(function (storage) {
      const config = storage.moodleGPT;
      if (!config)
          throw new Error("Please configure MoodleGPT into the extension");
      codeListener(config);
  });

}));
//# sourceMappingURL=moodle-gpt.js.map
