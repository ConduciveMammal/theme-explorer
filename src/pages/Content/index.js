import MixPanel from '../../Utilities/MixPanel';
let data = null;

var s = document.createElement('script');
s.src = chrome.runtime.getURL('injectScript.bundle.js');
s.onload = function () {
  this.remove();
};
(document.head || document.documentElement).appendChild(s);

chrome.runtime.onInstalled.addListener(function(details) {
  MixPanel('Extension Installed', {"details": details.reason});
  console.log('Extension installed: ' + details.reason);
});

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
  console.log('request', request);
  if (request.popupIsOpen) {
    console.log('popupIsOpen');
    MixPanel('Opened Popup');
    sendMessageToReact(data, true);
  }
});
