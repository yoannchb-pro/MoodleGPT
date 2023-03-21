<p align="center"><a
href="https://www.flaticon.com/free-icons/mortarboard" target="_blank" rel="noopener noreferrer"
title="Mortarboard icons created by itim2101 - Flaticon" ><img src="./extension/icon.png" alt="Mortarboard icons created by itim2101 - Flaticon" width="150" style="display:block; margin:auto;"></a></p>

# Moodle-gpt

This extension allows you to hide CHAT-GPT in a Moodle quiz. You just need to enter <b>the code configured in the extension</b> on the keyboard and then click on the question you want to solve, and CHAT-GPT will automatically provide the answer. However, one needs to be careful because as we know, CHAT-GPT can make errors especially in calculations.

## Disclaimer !

I hereby declare that I am not responsible for any misuse or illegal activities carried out using my program. The code is provided for educational and research purposes only, and any use of it outside of these purposes is at the user's own risk.

## Update

See [changelog](./CHANGELOG.md)

## Set up

Go to <b>"Manage my extensions"</b> on your browser, then click on <b>"Load unpacked extension"</b> and select the <b>"extension"</b> folder. Afterwards, click on the extension icons and enter the apiKey obtained from [openai](https://platform.openai.com/). Finally, enter a code that will activate the extension on your moodle page and enter the langage of the quiz.

## Inject the code into the moodle

You just need to enter on the keyboard the <b>code</b> you have set into the extension.

## Remove injection

Type back the <b>code</b> on the keyboard and the code will be removed from the current page.

## Test

To test the code, you can run the index.js file located in the <b>"test"</b> folder.

## Options

<p align="center">
<img src="./assets/popup.png" alt="Popup"  height="300">
</p>

- <b>Cursor indication</b>: show a pointer cursor and a hourglass to know when the request is finished.
- <b>Title indication</b>: Show some informations into the title to know for example if the code have been injected.
  <br/> ![Injected](./assets/title-injected.png)
- <b>Console logs</b>: show logs into the console.
  <br/><img src="./assets/logs.png" alt="Logs" width="250">
- <b>Typing effect</b>: create a typing effect for text.
  <br/> ![Typing](./assets/typing.gif)
- <b>Mouseover effect</b>: you will need to hover (or click for select) the question response to complete it automaticaly.
  <br/> ![Mouseover](./assets/mouseover.gif)
  <br/> ![Mouseover2](./assets/mouseover2.gif)

## Examples

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

### Text

![Text](./assets/text.gif)

## If it can't complete the question, the answer will be copied to your clipboard

To know if the answer has been copied to the clipboard, you can look at the title of the page which will become <b>"Copied to clipboard"</b> for 3 seconds.

![Clipboard](./assets/clipboard.gif)
