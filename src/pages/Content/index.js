let data = null;

function appendInjectScript(srcPath, onError) {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL(srcPath);
  script.onload = function () {
    this.remove();
  };

  script.onerror = function (event) {
    this.remove();
    if (onError) onError(event);
  };

  (document.head || document.documentElement).appendChild(script);
}

appendInjectScript('src/pages/Inject/index.js', (event) => {
  console.error('Error loading script:', event);
});

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
