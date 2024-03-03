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
  const t0 = performance.now();
  chrome.runtime.sendMessage(chrome.runtime.id, objectData);
  console.log('firing');
  if (!isPopupOpen) {
    data = objectData;
  }

  const t1 = performance.now();
  console.log(`Call to sendMessageToReact took ${t1 - t0} milliseconds.`);
}

window.addEventListener(
  'message',
  (e) => {
    console.log('firing 2');
    if (e.data.type === 'theme') {
      sendMessageToReact(e.data);
    }
  },
  false
);

function handleChromeMessage(request) {
  if (request.popupIsOpen) {
    sendMessageToReact(request.data, true);
  }
  // Handle other message types...
}

chrome.runtime.onMessage.addListener(handleChromeMessage);
