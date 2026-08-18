# CHANGELOG

## v1.1.6

- Added support for uploading local text documents in the popup.
- Stored uploaded documents locally and used them as retrieval context for answers.
- Added a Web search before answering toggle for Ollama.
- Implemented a local proxy search route so web search works without browser CORS issues (may happen only on my machine).
- Added an Ollama timeout setting in the popup.
- Made 0 mean no automatic timeout for Ollama, with Esc held for 2 seconds used to cancel a request.
- Improved popup styling for the new document and web search controls.

## v1.1.5

- Support for gpt-5

## v1.1.4

- Support for all `o` models
- Removed `Clear my choice` in the api call
- Code dependencies update

## v1.1.3

- Added `base url` and `max token` in config (by dmunozv04)
- Code dependencies update

## v1.1.2

- Advanced settings
- Added OpenAI SDK for better support
- o1 model support

## v1.1.1

- Bugs correction
- Support for Atto editor

## v1.1.0

- Bugs correction
- Adjusted the abort timeout to 20seconds
- `code` is not required anymore
- Issue [#9](https://github.com/yoannchb-pro/MoodleGPT/issues/9) resolved
- GPT model autocompletation
- Better algorithm to find the correct answer (levenshtein distance)
- Better ChatGPT prompt
- Added `history` to the options/configuration
- Added `include images` to the option/configuration
- `gpt-4` support

## v1.0.3

- Removed the option `table formating` because it will now set to true by default
- Adjusted the abort timeout to 15seconds
- If an error occur the user can now click back on the question
- `Textbox, question to answser mode and clipboard mode` is not formatted anymore
- Fixed many bugs
- Write AI system instructions

## v1.0.2

- Added `mode`

## v1.0.1

- Removed langage
- Added a button next to model to get the last ChatGPT version
- Added update message

## v1.0.0

- Initial commit
