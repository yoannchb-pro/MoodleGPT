chrome.storage.sync.get(["moodleGPT"]).then(function (storage) {
  const config = storage.moodleGPT;

  if (!config) throw new Error("Please configure MoodleGPT into the extension");

  //listening to the keys to inject moodleGPT
  const pressedKeys = [];
  const listeners = [];
  document.body.addEventListener("keypress", function (e) {
    pressedKeys.push(e.key);
    if (pressedKeys.length > config.code.length) pressedKeys.shift();
    if (pressedKeys.join("") === config.code) {
      pressedKeys.length = 0;
      setUpMoodleGpt();
    }
  });

  /**
   * Show some informations into the document title and remove it after 3000ms
   * @param {*} text
   */
  function titleIndications(text) {
    const backTitle = document.title;
    document.title = text;
    setTimeout(() => (document.title = backTitle), 3000);
  }

  /**
   * Setup moodleGPT into the page (remove/injection)
   */
  function setUpMoodleGpt() {
    //removing events
    if (listeners.length > 0) {
      for (const listener of listeners) {
        if (config.cursor) listener.element.style.cursor = "initial";
        listener.element.removeEventListener("click", listener.fn, {
          once: true,
        });
      }
      if (config.title) titleIndications("Removed");
      listeners.length = 0;
      return;
    }

    //injection
    const inputQuery = ["checkbox", "radio", "text"]
      .map((e) => `input[type="${e}"]`)
      .join(",");
    const query = inputQuery + ", textarea, select";
    const forms = Array.from(document.querySelectorAll(".formulation"));

    for (const form of forms) {
      const hiddenButton = form.querySelector(".qtext");
      if (config.cursor) hiddenButton.style.cursor = "pointer";
      const fn = reply.bind(null, hiddenButton, form, query);
      listeners.push({ element: hiddenButton, fn });
      hiddenButton.addEventListener("click", fn, { once: true });
    }

    if (config.title) titleIndications("Injected");
  }

  /**
   * Normlize text
   * @param {*} text
   */
  function normalizeText(text) {
    return text.replace(/\n+/g, "\n").replace(/\s+/g, " ").toLowerCase().trim();
  }

  /**
   * Get the response from chatGPT api
   * @param {*} question
   * @returns
   */
  async function getChatGPTResponse(question) {
    const req = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: question }],
        temperature: 0.8,
        top_p: 1.0,
        presence_penalty: 1.0,
        stop: null,
      }),
    });
    const rep = await req.json();
    const response = rep.choices[0].message.content;
    return normalizeText(response);
  }

  /**
   * Handling logs into the console
   */
  class Logs {
    static question(text) {
      const css = "color: blue";
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
   * Reply to the question
   * @param {*} form
   * @param {*} query
   * @returns
   */
  async function reply(hiddenButton, form, query) {
    if (config.cursor) hiddenButton.style.cursor = "wait";

    form.querySelector(".accesshide")?.remove();

    const question = normalizeText(form.textContent);
    const inputList = form.querySelectorAll(query);
    const response = await getChatGPTResponse(
      `Give a short response as possible for this question, reply in this langage "${config.langage}" and only show the result: 
      ${question} 
      (If you have to choose between multiple results only show the corrects one and do not change the initial text)`
    );

    if (config.logs) {
      Logs.question(question);
      Logs.response(response);
    }

    if (config.cursor) hiddenButton.style.cursor = "initial";

    //if we dont find the input we copy into the clipboard
    if (inputList.length === 0) {
      if (config.title) titleIndications("Copied to clipboard");
      navigator.clipboard.writeText(response);
      return;
    }

    //if it's a text
    if (
      (inputList.length === 1 && inputList[0].type === "text") ||
      inputList[0].tagName === "TEXTAREA"
    ) {
      if (config.typing) {
        for (let i = 0; i < response.length; ++i) {
          setTimeout(
            () => (inputList[0].value = response.slice(0, i + 1)),
            i * 50
          );
        }
      } else {
        inputList[0].value = response;
      }
      return;
    }

    //if it's a select
    if (inputList[0].tagName === "SELECT") {
      let correct = response.split("\n");
      if (correct.length === 1 && correct.length !== inputList)
        correct = response.split(",");

      if (config.logs) Logs.array(correct);

      for (let j = 0; j < inputList.length; ++j) {
        const options = inputList[j].querySelectorAll("option");

        for (const option of options) {
          const content = option.textContent.toLocaleLowerCase().trim();
          const valide = correct[j].includes(content);

          //if it's a put in order
          if (!isNaN(parseInt(content))) {
            const content = normalizeText(
              option.parentNode.closest("tr").querySelector(".text").textContent
            );
            const index = correct.findIndex((c) => {
              const valide = c.includes(content);
              if (config.logs) Logs.responseTry(content, valide);
              return valide;
            });
            if (index !== -1) {
              if (config.mouseover) {
                options[index + 1].closest("select").addEventListener(
                  "click",
                  function () {
                    options[index + 1].selected = "selected";
                  },
                  { once: true }
                );
              } else {
                options[index + 1].selected = "selected";
              }
              break;
            }
          }

          if (config.logs) Logs.responseTry(content, valide);
          if (valide) {
            if (config.mouseover) {
              option.closest("select").addEventListener(
                "click",
                function () {
                  option.selected = "selected";
                },
                { once: true }
              );
            } else {
              option.selected = "selected";
            }
            break;
          }
        }
      }
      return;
    }

    //if it's a radio button or checkbox
    for (const input of inputList) {
      const content = normalizeText(input.parentNode.textContent);
      const valide = response
        .replace(/^[a-z\d]\.\s/gi, "")
        .includes(content.replace(/^[a-z\d]\.\s/gi, ""));
      if (config.logs) Logs.responseTry(content, valide);
      if (valide) {
        if (config.mouseover) {
          input.addEventListener(
            "mouseover",
            function (event) {
              event.target.checked = true;
            },
            { once: true }
          );
        } else {
          input.checked = true;
        }
      }
    }
  }
});
