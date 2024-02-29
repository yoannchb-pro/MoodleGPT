!function(e){"function"==typeof define&&define.amd?define(e):e()}((function(){"use strict";function e(e){const n=document.title;document.title=e,setTimeout((()=>document.title=n),3e3)}function n(e,n,t,o){return new(t||(t=Promise))((function(r,i){function s(e){try{c(o.next(e))}catch(e){i(e)}}function l(e){try{c(o.throw(e))}catch(e){i(e)}}function c(e){var n;e.done?r(e.value):(n=e.value,n instanceof t?n:new t((function(e){e(n)}))).then(s,l)}c((o=o.apply(e,n||[])).next())}))}function t(e,n){const t=e.length>n.length?e.length:n.length;return 0===t?1:(t-function(e,n){if(0===e.length)return n.length;if(0===n.length)return e.length;const t=[],o=e.replace(/\s+/,""),r=n.replace(/\s+/,"");for(let e=0;e<=o.length;++e){t.push([e]);for(let n=1;n<=r.length;++n)t[e][n]=0===e?n:Math.min(t[e-1][n]+1,t[e][n-1]+1,t[e-1][n-1]+(o[e-1]===r[n-1]?0:1))}return t[o.length][r.length]}(e,n))/t}function o(e,n){let o={element:null,similarity:0,value:null};for(const r of n){const n=t(r.value,e);if(1===n)return{element:r.element,value:r.value,similarity:n};n>o.similarity&&(o={element:r.element,value:r.value,similarity:n})}return o}"function"==typeof SuppressedError&&SuppressedError;class r{static question(e){console.log("%c[QUESTION]: %s","color: cyan",e)}static bestAnswer(e,n){console.log("%c[BEST ANSWER]: %s","color: green",`"${e}" with a similarity of ${function(e){return Math.round(100*e*100)/100+"%"}(n)}`)}static array(e){console.log("[CORRECTS] ",e)}static response(e){console.log("Original:\n"+e.response),console.log("Normalized:\n"+e.normalizedResponse)}}function i(e,n=!0){n&&(e=e.toLowerCase());return e.replace(/\n+/gi,"\n").replace(/(\n\s*\n)+/g,"\n").replace(/[ \t]+/gi," ").trim().replace(/^[a-z\d]\.\s/gi,"").replace(/\n[a-z\d]\.\s/gi,"\n")}function s(e){const n=e.match(/gpt-(\d+)/);return!!(null==n?void 0:n[1])&&Number(n[1])>=4}var l,c;!function(e){e.SYSTEM="system",e.USER="user",e.ASSISTANT="assistant"}(l||(l={})),function(e){e.TEXT="text",e.IMAGE="image_url"}(c||(c={}));const a="\nAct as a quiz solver for the best notation with the following rules:\n- When asked for the result of an equation, provide only the result without any other information and skip the other rules.\n- If no answer(s) are given, answer the statement as usual without following the other rules, providing the most detailed, complete and precise explanation.\n- For 'put in order' questions, provide the position of the answer separated by a new line (e.g., '1\n3\n2') and ignore other rules.- Always reply in this format: '<answer 1>\n<answer 2>\n...'\n- Always reply in the format: '<answer 1>\n<answer 2>\n...'.\n- Retain only the correct answer(s).\n- Maintain the same order for the answers as in the text.\n- Retain all text from the answer with its description, content or definition.\n- Only provide answers that exactly match the given answer in the text.\n- The question always has the correct answer(s), so you should always provide an answer.\n- Always respond in the same language as the user's question.\n".trim(),u={url:null,system:{role:l.SYSTEM,content:a},history:[]};function f(e,t,o){return n(this,void 0,void 0,(function*(){const n=t.querySelectorAll("img");if(e.includeImages&&s(e.model)&&0===n.length)return o;let r=[];const i=Array.from(n).map((e=>{return n=e,new Promise(((e,t)=>{const o=document.createElement("canvas"),r=o.getContext("2d");if(!r)return void e(null);const i=new Image;i.crossOrigin="Anonymous",i.onload=()=>{o.width=i.width,o.height=i.height,r.drawImage(i,0,0);const n=o.toDataURL("image/png");e(n)},i.onerror=e=>{t(e)},i.src=n.src}));var n})),l=(yield Promise.all(i)).filter((e=>null!==e));for(const e of l)r.push({type:c.IMAGE,image_url:{url:e}});return r.length>0?r.push({type:c.TEXT,text:o}):r=o,r}))}function d(e){const n=[],t=Array.from(e.querySelectorAll("tr")),o=[];t.map((e=>{const t=Array.from(e.querySelectorAll("td, th")).map(((e,n)=>{var t;const r=null===(t=e.textContent)||void 0===t?void 0:t.trim();return o[n]=Math.max(o[n]||0,(null==r?void 0:r.length)||0),null!=r?r:""}));n.push(t)}));const r=o.reduce(((e,n)=>e+n))+3*n[0].length+1,i="\n"+Array(r).fill("-").join("")+"\n",s=n.map((e=>"| "+e.map(((e,n)=>e.padEnd(o[n]," "))).join(" | ")+" |"));return s.shift()+i+s.join("\n")}function m(n,t){n.title&&e("Copied to clipboard"),navigator.clipboard.writeText(t.response)}function p(e,n,t){const o=n[0];if(1!==n.length||"true"!==o.getAttribute("contenteditable"))return!1;if(e.typing){let e=0;o.addEventListener("keydown",(function(n){if("Backspace"===n.key&&(e=t.response.length+1),e>t.response.length)return;n.preventDefault(),o.textContent=t.response.slice(0,++e),o.focus();const r=document.createRange();r.selectNodeContents(o),r.collapse(!1);const i=window.getSelection();null!==i&&(i.removeAllRanges(),i.addRange(r))}))}else o.textContent=t.response;return!0}function h(e,n,t){var o,r;const i=n[0];if(1!==n.length||"number"!==i.type)return!1;const s=null===(r=null===(o=t.normalizedResponse.match(/\d+([,.]\d+)?/gi))||void 0===o?void 0:o[0])||void 0===r?void 0:r.replace(",",".");if(void 0===s)return!1;if(e.typing){let e=0;i.addEventListener("keydown",(function(n){n.preventDefault(),"Backspace"===n.key&&(e=s.length+1),e>s.length||("."===s.slice(e,e+1)&&++e,i.value=s.slice(0,++e))}))}else i.value=s;return!0}function g(e,n,t){const s=null==n?void 0:n[0];if(!s||"radio"!==s.type)return!1;const l=Array.from(n).map((e=>{var n,t;return{element:e,value:i(null!==(t=null===(n=null==e?void 0:e.parentElement)||void 0===n?void 0:n.textContent)&&void 0!==t?t:"")}})).filter((e=>""!==e.value)),c=o(t.normalizedResponse,l);e.logs&&c.value&&r.bestAnswer(c.value,c.similarity);const a=c.element;return e.mouseover?a.addEventListener("mouseover",(()=>a.checked=!0),{once:!0}):a.checked=!0,!0}function v(e,n,t){const s=null==n?void 0:n[0];if(!s||"checkbox"!==s.type)return!1;const l=t.normalizedResponse.split("\n"),c=Array.from(n).map((e=>{var n,t;return{element:e,value:i(null!==(t=null===(n=null==e?void 0:e.parentElement)||void 0===n?void 0:n.textContent)&&void 0!==t?t:"")}})).filter((e=>""!==e.value));for(const n of l){const t=o(n,c);e.logs&&t.value&&r.bestAnswer(t.value,t.similarity);const i=t.element;e.mouseover?i.addEventListener("mouseover",(()=>i.checked=!0),{once:!0}):i.checked=!0}return!0}function y(e,n,t){if(0===n.length||"SELECT"!==n[0].tagName)return!1;const s=t.normalizedResponse.split("\n");e.logs&&r.array(s);for(let t=0;t<n.length&&s[t];++t){const l=n[t].querySelectorAll("option"),c=Array.from(l).map((e=>{var n;return{element:e,value:i(null!==(n=e.textContent)&&void 0!==n?n:"")}})).filter((e=>""!==e.value)),a=o(s[t],c);e.logs&&a.value&&r.bestAnswer(a.value,a.similarity);const u=a.element,f=u.closest("select");null!==f&&(e.mouseover?f.addEventListener("click",(()=>u.selected=!0),{once:!0}):u.selected=!0)}return!0}function w(e,n,t){const o=n[0];if(1!==n.length||"TEXTAREA"!==o.tagName&&"text"!==o.type)return!1;if(e.typing){let e=0;o.addEventListener("keydown",(function(n){n.preventDefault(),"Backspace"===n.key&&(e=t.response.length+1),e>t.response.length||(o.value=t.response.slice(0,++e))}))}else o.value=t.response;return!0}function A(e){return n(this,void 0,void 0,(function*(){e.config.cursor&&(e.questionElement.style.cursor="wait");const t=function(e){let n=e.innerText;const t=e.querySelectorAll(".accesshide");for(const e of t)n=n.replace(e.innerText,"");const o=e.querySelectorAll(".qtext table");for(const e of o)n=n.replace(e.innerText,"\n"+d(e)+"\n");return i(n,!1)}(e.form),o=e.form.querySelectorAll(e.inputQuery),c=yield function(e,t,o){return n(this,void 0,void 0,(function*(){const n=location.hostname+location.pathname;e.history&&u.url===n||(u.url=n,u.history=[]);const r=new AbortController,c=setTimeout((()=>r.abort()),15e3),a=yield f(e,t,o),d={role:l.USER,content:a},m=yield fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${e.apiKey}`},signal:e.timeout?r.signal:null,body:JSON.stringify(Object.assign({model:e.model,messages:[u.system,...u.history,d],temperature:.8,top_p:1,presence_penalty:1},s(e.model)?{max_tokens:1e3}:{stop:null}))});clearTimeout(c);const p=(yield m.json()).choices[0].message.content;return e.history&&(u.history.push(d),u.history.push({role:l.ASSISTANT,content:p})),{question:o,response:p,normalizedResponse:i(p)}}))}(e.config,e.questionElement,t).catch((e=>({error:e}))),a="object"==typeof c&&"error"in c;if(e.config.cursor&&(e.questionElement.style.cursor=e.config.infinite||a?"pointer":"initial"),a)console.error(c.error);else switch(e.config.logs&&(r.question(t),r.response(c)),e.config.mode){case"clipboard":!function(e){e.config.infinite||e.removeListener(),m(e.config,e.gptAnswer)}({config:e.config,questionElement:e.questionElement,gptAnswer:c,removeListener:e.removeListener});break;case"question-to-answer":!function(e){const n=e.questionElement;e.removeListener();const t=n.textContent;n.textContent=e.gptAnswer.response,n.style.whiteSpace="pre-wrap";let o=!0;n.addEventListener("click",(function(){n.style.whiteSpace=o?"":"pre-warp",n.textContent=o?t:e.gptAnswer.response,o=!o}))}({gptAnswer:c,questionElement:e.questionElement,removeListener:e.removeListener});break;case"autocomplete":!function(e){e.config.infinite||e.removeListener();const n=[p,w,h,y,g,v];for(const t of n)if(t(e.config,e.inputList,e.gptAnswer))return;m(e.config,e.gptAnswer)}({config:e.config,gptAnswer:c,inputList:o,questionElement:e.questionElement,removeListener:e.removeListener})}}))}const E=[],x=[];function S(e){const n=x.findIndex((n=>n.element===e));if(-1!==n){const e=x.splice(n,1)[0];e.element.removeEventListener("click",e.fn)}}function q(n){if(x.length>0){for(const e of x)n.cursor&&(e.element.style.cursor="initial"),e.element.removeEventListener("click",e.fn);return n.title&&e("Removed"),void(x.length=0)}const t=["checkbox","radio","text","number"].map((e=>`input[type="${e}"]`)).join(",")+", textarea, select, [contenteditable]",o=document.querySelectorAll(".formulation");for(const e of o){const o=e.querySelector(".qtext");if(null===o)continue;n.cursor&&(o.style.cursor="pointer");const r=A.bind(null,{config:n,questionElement:o,form:e,inputQuery:t,removeListener:()=>S(o)});x.push({element:o,fn:r}),o.addEventListener("click",r)}n.title&&e("Injected")}chrome.storage.sync.get(["moodleGPT"]).then((function(e){const n=e.moodleGPT;if(!n)throw new Error("Please configure MoodleGPT into the extension");n.code?function(e){document.body.addEventListener("keydown",(function(n){E.push(n.key),E.length>e.code.length&&E.shift(),E.join("")===e.code&&(E.length=0,q(e))}))}(n):q(n)}))}));
//# sourceMappingURL=MoodleGPT.js.map
