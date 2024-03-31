import * as Sentry from '@sentry/react';
let data = null;

function loadScripts(scripts) {
  scripts.forEach((scriptSrc) => {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL(scriptSrc);

    script.onload = function () {
      console.log(`${scriptSrc} loaded successfully`);
      this.remove(); // Remove the script element once loaded
    };

    script.onerror = function (event) {
      console.error('Error loading script:', scriptSrc, event);
    };

    (document.head || document.documentElement).appendChild(script);
  });
}

// Usage
loadScripts(['injectScript.bundle.js', 'sentry.js']);

window.addEventListener('load', function () {
  console.log('Sentry here!');
  Sentry.init({
    dsn: 'https://769de98c6320a26b71a868f8ba5ab915@o4506865007722496.ingest.us.sentry.io/4506865009557504',
    tracesSampleRate: 1.0,
  });
});

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

chrome.runtime.onMessage.addListener((request) => {
  if (request.popupIsOpen) {
    try {
      sendMessageToReact(data, true);
    } catch (err) {
      Sentry.captureException(err);
    }
  }
});
