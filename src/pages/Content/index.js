let data = null;

const script = document.createElement('script');
script.src = chrome.runtime.getURL('injectScript.bundle.js');
script.onload = function () {
  this.remove();
};

script.onerror = function (event) {
  console.error('Error loading script:', event);
};

(document.head || document.documentElement).appendChild(script);

// function sendMessageToReact(objectData, popupIsOpen = false) {
//   chrome.runtime.sendMessage(chrome.runtime.id, { ...objectData });
//   if (!popupIsOpen) {
//     data = { ...objectData };
//   }
// }
function sendMessageToReact(objectData, isPopupOpen = false) {
  chrome.runtime.sendMessage(chrome.runtime.id, objectData);

  if (!isPopupOpen) {
    data = objectData;
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