let data = null;
const MESSAGE_PORT_CLOSED_ERROR =
  'The message port closed before a response was received.';

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
  if (!objectData) {
    return;
  }

  chrome.runtime.sendMessage(chrome.runtime.id, objectData, () => {
    if (chrome.runtime.lastError) {
      const errorMessage = chrome.runtime.lastError.message || '';
      if (errorMessage.includes(MESSAGE_PORT_CLOSED_ERROR)) {
        return;
      }

      console.debug('Theme Explorer: runtime message skipped:', errorMessage);
    }
  });

  if (!isPopupOpen) {
    data = objectData;
  }
}

window.addEventListener(
  'message',
  (e) => {
    if (e.source !== window || e.origin !== window.location.origin) {
      return;
    }

    if (e.data && e.data.type === 'theme' && e.data.data) {
      sendMessageToReact(e.data);
    }
  },
  false
);

chrome.runtime.onMessage.addListener((request) => {
  if (request.popupIsOpen) {
    if (!data) {
      appendInjectScript('src/pages/Inject/index.js', (event) => {
        console.error('Error reloading script for popup request:', event);
      });
      return;
    }

    sendMessageToReact(data, true);
  }
});
