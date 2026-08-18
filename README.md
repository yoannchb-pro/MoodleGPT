<p align="center"><a
href="https://www.flaticon.com/free-icons/mortarboard" target="_blank" rel="noopener noreferrer"
title="Mortarboard icons created by itim2101 - Flaticon" ><img src="./extension/icon.png" alt="Mortarboard icons created by itim2101 - Flaticon" width="150" style="display:block; margin:auto;"></a></p>

# MoodleGPT 1.1.5

This extension allows you to hide CHAT-GPT in a Moodle quiz. You just need to click on the question you want to solve, and CHAT-GPT will automatically provide the answer. However, one needs to be careful because as we know, CHAT-GPT can make errors especially in calculations.

## Chrome Webstore

Find the extension on the Chrome Webstore right [here](https://chrome.google.com/webstore/detail/moodlegpt/fgiepdkoifhpcgdhbiikpgdapjdoemko)

## Summary

- [MoodleGPT 1.1.5](#moodlegpt-115)
  - [Chrome Webstore](#chrome-webstore)
  - [Summary](#summary)
  - [Disclaimer !](#disclaimer-)
  - [Donate](#donate)
  - [Update](#update)
  - [Set up](#set-up)
  - [Settings](#settings)
- [Advanced Settings](#advanced-settings)
- [Local workflow](#local-workflow)
- [Mode](#mode)
- [Options](#options)
  - [Internal other features](#internal-other-features)
    - [Support table](#support-table)
  - [Supported questions type](#supported-questions-type)
    - [Select](#select)
    - [Put in order question](#put-in-order-question)
    - [Resolve equation](#resolve-equation)
    - [One response (radio button)](#one-response-radio-button)
    - [Multiples responses (checkbox)](#multiples-responses-checkbox)
    - [True or false](#true-or-false)
    - [Number](#number)
    - [Text](#text)
    - [Atto](#atto)
  - [What about if the question can't be autocompleted ?](#what-about-if-the-question-cant-be-autocompleted-)
  - [Test](#test)
  - [Beta version with advanced features](#beta-version-with-advanced-features)

## Disclaimer !

I hereby declare that I am not responsible for any misuse or illegal activities carried out using my program. The code is provided for educational and research purposes only, and any use of it outside of these purposes is at the user's own risk.

## Donate

Will be a pleasure if you want to support this project :). I'm alone working on this project and I'm still a student.
<br/>
<a href="https://www.buymeacoffee.com/yoannchbpro" target="_blank" rel="noopener noreferrer"><img src="./assets/bmc-button.png" alt="Mortarboard icons created by itim2101 - Flaticon" width="150"></a>

## Update

See the [changelog](./CHANGELOG.md) to see every updates !

## Set up

> NOTE: This extension only works on Chromium-based browsers like Edge, Chrome, etc.

<p align="center">
<img src="./assets/setup.png" alt="Popup" width="300">
</p>

Go to <b>"Manage my extensions"</b> on your browser, then click on <b>"Load unpacked extension"</b> and select the <b>"extension"</b> folder. Afterwards, click on the extension icon and enter the ApiKey obtained from [openai api](https://platform.openai.com/api-keys). Finally, select a [gpt model](https://platform.openai.com/docs/models) (ensure it work with completion api).

If you want to use Ollama, the extension now supports a local provider mode. The easiest setup is to run the local proxy included in this repo and point the Ollama `Base URL` to `http://127.0.0.1:8787/v1`.

## Local workflow

The extension can now work in two ways:

- <b>OpenAI API</b>: send the question directly to an OpenAI-compatible endpoint.
- <b>Ollama local</b>: send the question to your local Ollama server through the bundled proxy.

When Ollama is selected:

- the API key field is hidden
- the popup shows an Ollama timeout field
- `0` means no automatic timeout
- while a request is running, hold <b>Esc</b> for 2 seconds to cancel it

You can also enable:

- <b>Web search before answering</b>: the extension fetches a quick web summary through the local proxy and adds it as extra context before the model answers.
- <b>Use uploaded documents</b>: upload local text files and the extension will keep them as a lightweight local RAG source.

## Settings

- <b>API KEY\*</b>: Your openai [API KEY](https://platform.openai.com/api-keys)
- <b>GPT MODEL\*</b>: The [gpt model](https://platform.openai.com/docs/models) (you can click on the play button to ensure the model work with the extension)

## Advanced Settings

- <b>CODE</b>: A code you will need to type on your keyboard to inject/remove the extension code from the moodle page. It allow you to be more discret and control the injection so it's recommended.
- <b>BASE URL</b>: The API endpoint if you need to use your own llm.
- <b>PROVIDER</b>: Switch between OpenAI API and a local Ollama server.
- <b>MAX TOKENS</b>: The max tokens length you want the api to respond with.
- <b>OLLAMA TIMEOUT</b>: Ollama-only setting. `0` means no auto timeout, and you can stop the request by holding <b>Esc</b> for 2 seconds.
<<<<<<< HEAD
- <b>WEB SEARCH</b>: Ollama-only setting. The proxy will look up the question on the web and pass the top results to the model.
- <b>USE UPLOADED DOCUMENTS</b>: Enables the local document store for lightweight RAG-style context.
- <b>UPLOAD DOCS</b>: Add text files. Here are the supported file extensions:
  * `.txt` - Plain text files
  * `.md` / `.markdown` - Markdown files
  * `.csv` - Comma-separated values
  * `.json` - JSON data syntax
  * `.html` / `.htm` - Web pages
  * `.log` - System log files
- <b>CLEAR UPLOADED DOCS</b>: Removes all stored documents.
- <b>WEB SEARCH BEFORE ANSWERING</b>: Ollama-only setting. The proxy will look up the question on the web and pass the top results to the model.
- <b>USE UPLOADED DOCUMENTS</b>: Enables the local document store for lightweight RAG-style context.
- <b>UPLOAD DOCS</b>: Add text files to the local document store.
- <b>CLEAR UPLOADED DOCS</b>: Removes all locally stored documents.

## Mode

<p align="center">
<img src="./assets/mode.png" alt="Popup" width="300">
</p>

- <b>Autocomplete:</b> The extension will complete the question for you by selecting the correct(s) answer(s).
- <b>Clipboard:</b> The response is copied into the clipboard.
- <b>Question to answer:</b> The question is converted to the answer and you can click on it to show back the question (or show back the answer).
  <br/><img src="./assets/question-to-answer.gif" alt="Question to Answer">

## Options

<p align="center">
<img src="./assets/settings.png" alt="Popup" width="300">
</p>

- <b>Api key\*</b>: the [openai api key](https://platform.openai.com/api-keys) from your account (Note you have to put credits by entering a credit card onto your account).
- <b>GPT Model\*</b>: the [gpt model](https://platform.openai.com/docs/models) you want to use.
- <b>Code</b>: a code to be more discret for injecting/removing the extension from the page. Simply type your code you entered into the configuration on the keyboard when you are on your moodle quiz and the extension will be inject. If you want to remove the injection just simply type back the code on your keyboard.
- <b>Cursor indication</b>: show a pointer cursor and a hourglass to know when the request is finished.
- <b>Title indication</b>: show some informations into the title to know for example if the code have been injected.
  <br/> ![Injected](./assets/title-injected.png)
- <b>Console logs</b>: show logs into the console for the question, chatgpt answer and which response has been chosen.
  <br/><img src="./assets/logs.png" alt="Logs" width="250">
- <b>Request timeout</b>: if the request is too long it will be abort after 20 seconds.
- <b>Typing effect</b>: create a typing effect for text. Type any text and it will be replaced by the correct one. If you want to stop it press <b>Backspace</b> key.
  <br/> ![Typing](./assets/typing.gif)
- <b>Mouseover effect</b>: you will need to hover (or click for select) the question response to complete it automaticaly.
  <br/> ![Mouseover](./assets/mouseover.gif)
  <br/> ![Mouseover2](./assets/mouseover2.gif)
- <b>Infinite try</b>: click as much as you want on the question (don't forget to reset the question).
- <b>Save history</b>: allows you to create a conversation with ChatGPT by saving the previous question with its answer. However, note that it can consume a significant number of tokens.
- <b>Include images</b> (only work with gpt-4): allows you to include the images from the question to be send to the chatgpt api. The quality is reduced to 75% to use less tokens. However, note that it can consume a significant number of tokens.
  <br/> ![Images](./assets/images.gif)
- <b>Web search before answering</b>: adds retrieved search snippets to the prompt when using Ollama.
- <b>Use uploaded documents</b>: lets you upload local text files and reuse them as context for answers.

## Internal other features

### Support table

Table are formated from the question to make it more readable for CHAT-GPT. Example of formatted table output:

```
id       | name  | birthDate  | cars
------------------------------------
Person 1 | Yvick | 15/08/1999 | yes 
Person 2 | Yann  | 19/01/2000 | no
```

![Table](./assets/table.gif)

## Supported questions type

### Select

![Select](./assets/select.gif)

### Put in order question

![Order](./assets/order.gif)

### Resolve equation

![Equations](./assets/equations.gif)

### One response (radio button)

![Radio](./assets/radio.gif)

### Multiples responses (checkbox)

![Checkbox](./assets/checkbox.gif)

### True or false

![True-false](./assets/true-false.gif)

### Number

![Number](./assets/number.gif)

### Text

![Text](./assets/text.gif)

### Atto

![Atto](./assets/atto.gif)

## What about if the question can't be autocompleted ?

To know if the answer has been copied to the clipboard, you can look at the title of the page which will become <b>"Copied to clipboard"</b> for 3 seconds if `Title indication` is on.

![Clipboard](./assets/clipboard.gif)

## Test

- <b>Solution 1</b>: Go on this [moodle demo page](https://moodle.org/demo).
- <b>Solution 2</b>: Run the `index.html` file located in the `test/fake-moodle` folder.

## Ollama quick setup

1. Install and run Ollama locally.
2. Pull a model, for example:

   ```bash
   ollama pull qwen2.5:7b
   ```

3. Start the proxy from the project root:

   ```bash
   npm run proxy
   ```

4. Open the extension popup and choose <b>Ollama local</b>.
5. Set the <b>Base URL</b> to:

   ```text
   http://127.0.0.1:8787/v1
   ```

6. Enter your model name, for example `qwen2.5:7b`.
7. Optional:

   - turn on <b>Web search before answering</b>
   - turn on <b>Use uploaded documents</b>
   - set <b>Ollama Timeout</b> to `0` if you want only Esc to cancel

### Suggested Ollama models

- `qwen2.5:7b` for a good speed/quality balance
- `llama3.1:8b` for a strong general model
- `gemma3:4b` or a smaller 7B model for faster responses
- larger models like `qwen3:14b` or `gemma4:26b` when you want stronger reasoning and can accept slower output

## Beta version with advanced features

If you're interested in accessing advanced features ahead of their official release, please consider downloading the extension from the [dev branch](https://github.com/yoannchb-pro/MoodleGPT/tree/dev). However, please be aware that this branch is under development and may contain bugs. If you encounter any issues, don't hesitate to contact me or create an issue on GitHub. Your feedback is invaluable in helping us improve the extension.
