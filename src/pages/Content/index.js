let data = null;

var s = document.createElement('script');
s.src = chrome.runtime.getURL('injectScript.bundle.js');
s.onload = function () {
  this.remove();
};
(document.head || document.documentElement).appendChild(s);

function sendMessageToReact(objectData, popupIsOpen = false) {
  chrome.runtime.sendMessage(chrome.runtime.id, { ...objectData });
  if (!popupIsOpen) {
    data = { ...objectData };
  }
}

window.addEventListener(
  'message',
  (e) => {
    if (e.data.type === 'theme') {
      sendMessageToReact(e.data);
    }
  },
  false
);

chrome.runtime.onMessage.addListener((request) => {
  if (request.popupIsOpen) {
    sendMessageToReact(data, true);
  }
});

// console.log('test');
// console.log(chrome.runtime.getManifest().version);
chrome.runtime.onInstalled.addListener((details) => {
  if(details.reason === "update"){
    chrome.tabs.create({ url: `https://github.com/ConduciveMammal/theme-explorer/releases/tag/${chrome.runtime.getManifest().version}` });
  }
});