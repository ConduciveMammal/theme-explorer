import getExtensionApi from '../../utils/getExtensionApi';

let data = null;
let injectScriptIsLoading = false;
let lastInjectAttemptAt = 0;
const MESSAGE_PORT_CLOSED_ERROR =
  'The message port closed before a response was received.';
const INJECT_RETRY_INTERVAL_MS = 1000;
const INJECT_SCRIPT_MARKER_ATTRIBUTE = 'data-theme-explorer-inject';

const extensionApi = getExtensionApi();

function parseThemeObject(scriptText) {
  if (!scriptText) {
    return null;
  }

  const themeMatch = scriptText.match(/Shopify\.theme\s*=\s*(\{[\s\S]*?\});/);
  if (!themeMatch || !themeMatch[1]) {
    return null;
  }

  try {
    const parsedTheme = JSON.parse(themeMatch[1]);
    if (!parsedTheme || !parsedTheme.id) {
      return null;
    }

    return {
      handle: parsedTheme.handle,
      id: parsedTheme.id,
      name: parsedTheme.name,
      role: parsedTheme.role,
    };
  } catch (error) {
    return null;
  }
}

function parseShopDomain(scriptText) {
  if (!scriptText) {
    return null;
  }

  const shopMatch = scriptText.match(/Shopify\.shop\s*=\s*['"]([^'"]+)['"]/);
  return shopMatch && shopMatch[1] ? shopMatch[1] : null;
}

function getFallbackThemeData() {
  const scripts = document.querySelectorAll('script');
  let theme = null;
  let shop = null;

  for (const scriptElement of scripts) {
    const scriptText = scriptElement?.textContent;
    if (!theme) {
      theme = parseThemeObject(scriptText);
    }

    if (!shop) {
      shop = parseShopDomain(scriptText);
    }

    if (theme && shop) {
      break;
    }
  }

  if (!theme && !shop) {
    return null;
  }

  return {
    type: 'theme',
    data: {
      theme: theme || undefined,
      shop,
      location: window.location.href,
    },
  };
}

function appendInjectScript(srcPath, onError) {
  if (!extensionApi?.runtime?.getURL) {
    return;
  }

  const now = Date.now();
  if (
    injectScriptIsLoading ||
    now - lastInjectAttemptAt < INJECT_RETRY_INTERVAL_MS
  ) {
    return;
  }

  const scriptUrl = extensionApi.runtime.getURL(srcPath);
  const existingInjectScript = document.querySelector(
    `script[${INJECT_SCRIPT_MARKER_ATTRIBUTE}="true"][src="${scriptUrl}"]`
  );
  if (existingInjectScript) {
    return;
  }

  injectScriptIsLoading = true;
  lastInjectAttemptAt = now;

  const script = document.createElement('script');
  script.src = scriptUrl;
  script.setAttribute(INJECT_SCRIPT_MARKER_ATTRIBUTE, 'true');
  script.onload = function () {
    injectScriptIsLoading = false;
    this.remove();
  };

  script.onerror = function (event) {
    injectScriptIsLoading = false;
    this.remove();
    if (onError) onError(event);
  };

  (document.head || document.documentElement).appendChild(script);
}

appendInjectScript('src/pages/Inject/index.js', (event) => {
  console.error('Error loading script:', event);
});

const initialFallbackData = getFallbackThemeData();
if (initialFallbackData) {
  data = initialFallbackData;
  sendMessageToReact(initialFallbackData);
}

// function sendMessageToReact(objectData, popupIsOpen = false) {
//   chrome.runtime.sendMessage(chrome.runtime.id, { ...objectData });
//   if (!popupIsOpen) {
//     data = { ...objectData };
//   }
// }
function sendMessageToReact(objectData, isPopupOpen = false) {
  if (!objectData || !extensionApi?.runtime?.sendMessage) {
    return;
  }

  extensionApi.runtime.sendMessage(objectData, () => {
    if (extensionApi.runtime.lastError) {
      const errorMessage = extensionApi.runtime.lastError.message || '';
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

if (extensionApi?.runtime?.onMessage?.addListener) {
  extensionApi.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.popupIsOpen) {
      if (!data) {
        const fallbackData = getFallbackThemeData();
        if (fallbackData) {
          data = fallbackData;
          sendResponse(fallbackData);
          sendMessageToReact(fallbackData, true);
          return;
        }

        appendInjectScript('src/pages/Inject/index.js', (event) => {
          console.error('Error reloading script for popup request:', event);
        });
        sendResponse(null);
        return;
      }

      sendResponse(data);
      sendMessageToReact(data, true);
    }
  });
}
