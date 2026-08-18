import type Config from './types/config';
import { ACTION, type GetChatCompletionRequest } from './types/message';
import { codeListener, setUpMoodleGpt } from './core/code-listener';
import { runChatCompletion } from './core/run-chat-completion';

chrome.runtime.onMessage.addListener((message: GetChatCompletionRequest, _sender, sendResponse) => {
  if (message?.action !== ACTION.GET_CHAT_COMPLETION) return;

  runChatCompletion(message.payload).then(sendResponse);
  return true;
});

if (typeof document !== 'undefined') {
  chrome.storage.sync.get(['moodleGPT']).then(function (storage) {
    const config: Config = storage.moodleGPT;

    if (!config) throw new Error('Please configure MoodleGPT into the extension');

    if (config.code) {
      codeListener(config);
    } else {
      setUpMoodleGpt(config);
    }
  });
}
