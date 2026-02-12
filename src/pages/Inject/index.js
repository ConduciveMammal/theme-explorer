const MAX_SHOPIFY_LOOKUP_ATTEMPTS = 20;
const RETRY_INTERVAL_MS = 500;

let retryTimer = null;
let lookupAttempts = 0;
let hasPostedThemeData = false;

function shouldSkipInjection() {
  return window.location.href.includes('admin.shopify.com/store');
}

function getThemeData() {
  const shopify = window.Shopify;

  if (!shopify || (!shopify.theme && !shopify.shop)) {
    return null;
  }

  const theme =
    shopify.theme && shopify.theme.id
      ? {
          handle: shopify.theme.handle,
          id: shopify.theme.id,
          name: shopify.theme.name,
          role: shopify.theme.role,
        }
      : undefined;

  const shop = typeof shopify.shop === 'string' ? shopify.shop : null;

  if (!theme && !shop) {
    return null;
  }

  return {
    type: 'theme',
    data: {
      theme,
      shop,
      location: window.location.href,
    },
  };
}

function postThemeData() {
  const themeData = getThemeData();

  if (!themeData) {
    return false;
  }

  window.postMessage(themeData, window.location.origin);
  hasPostedThemeData = true;
  return true;
}

function stopRetryLoop() {
  if (!retryTimer) {
    return;
  }

  window.clearInterval(retryTimer);
  retryTimer = null;
}

function runThemeLookup() {
  if (shouldSkipInjection() || hasPostedThemeData) {
    stopRetryLoop();
    return;
  }

  lookupAttempts += 1;

  if (postThemeData()) {
    stopRetryLoop();
    return;
  }

  if (lookupAttempts >= MAX_SHOPIFY_LOOKUP_ATTEMPTS) {
    console.debug(
      'Theme Explorer: Shopify data was not available after retry limit.'
    );
    stopRetryLoop();
  }
}

function scheduleRetryLoop() {
  if (retryTimer || hasPostedThemeData || shouldSkipInjection()) {
    return;
  }

  retryTimer = window.setInterval(runThemeLookup, RETRY_INTERVAL_MS);
}

runThemeLookup();
scheduleRetryLoop();

document.addEventListener('DOMContentLoaded', runThemeLookup, { once: true });
window.addEventListener('load', runThemeLookup, { once: true });
