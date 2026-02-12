import React, { useState, useEffect, useCallback, useRef } from 'react';

import './Popup.scss';
import '@fontsource-variable/nunito'; // This contains ALL variable axes. Font files are larger.
import '@fontsource-variable/nunito/wght-italic.css'; // Italic variant.

import LoadingComponent from '../../containers/LoadingComponent/LoadingComponent';
import AdminComponent from '../../containers/AdminComponent/AdminComponent';
import StorefrontComponent from '../../containers/StorefrontComponent/StorefrontComponent';
import NotFound from '../../containers/NotFound/NotFound';

const Popup = () => {
  const MESSAGE_PORT_CLOSED_ERROR =
    'The message port closed before a response was received.';
  const RECEIVING_END_MISSING_ERROR =
    'Could not establish connection. Receiving end does not exist.';
  const STOREFRONT_TIMEOUT_MS = 1000;
  const STOREFRONT_MESSAGE_RETRY_INTERVAL_MS = 300;

  const [state, setState] = useState({
    themes: null,
    themesReady: false,
    liveTheme: null,
    storefrontInformation: null,
    adminShown: false,
    storeUrl: null,
    storeHandle: '',
    currentTab: null,
    urls: null,
    shop: null,
    loadError: false,
    errorTitle: '',
    errorMessage: '',
    currentTabResolved: false,
    storefrontCheckComplete: false,
  });
  const attemptedContentInjectionRef = useRef(false);
  const attemptedMainWorldFallbackRef = useRef(false);

  const setLoadError = useCallback((title, message) => {
    setState((prevState) => ({
      ...prevState,
      loadError: true,
      errorTitle: title,
      errorMessage: message,
      themesReady: true,
      storefrontCheckComplete: true,
    }));
  }, []);

  const fetchStorefrontDataFromMainWorld = useCallback(async (tabId) => {
    if (!tabId || !chrome.scripting?.executeScript) {
      return null;
    }

    try {
      const results = await chrome.scripting.executeScript({
        target: { tabId },
        world: 'MAIN',
        func: () => {
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
          const shop =
            typeof shopify.shop === 'string' ? shopify.shop : undefined;

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
        },
      });

      return results?.[0]?.result || null;
    } catch (error) {
      return null;
    }
  }, []);

  const ensureContentScriptInjected = useCallback(async (tabId) => {
    if (!tabId || !chrome.scripting?.executeScript) {
      return false;
    }

    if (attemptedContentInjectionRef.current) {
      return false;
    }

    attemptedContentInjectionRef.current = true;

    try {
      await chrome.scripting.executeScript({
        target: { tabId },
        files: ['src/pages/Content/index.js'],
      });
      return true;
    } catch (error) {
      return false;
    }
  }, []);

  const getLiveTheme = useCallback(() => {
    if (!state.themes) return;

    const liveTheme = state.themes.find((theme) => theme.role === 'main');
    if (liveTheme) {
      setState((prevState) => ({ ...prevState, liveTheme }));
    }
  }, [state.themes]);

  const fetchStore = async () => {
    if (!state.storeUrl) return;

    try {
      const response = await fetch(`${state.storeUrl}/shop.json`);
      if (!response.ok) {
        throw new Error(`Store request failed with status ${response.status}`);
      }

      const data = await response.json();
      const storeHandle = data?.shop?.domain?.split('.myshopify.com')[0] || '';

      setState((prevState) => ({
        ...prevState,
        shop: data?.shop || null,
        storeHandle,
        loadError: false,
        errorTitle: '',
        errorMessage: '',
      }));
    } catch (error) {
      console.error('Failed to fetch store:', error);
      setLoadError(
        'Unable to load Shopify store details',
        'The store responded with an error. Check the shop is reachable and retry.'
      );
    }
  };

  const getCurrentTab = async () => {
    try {
      const queryOptions = { active: true, currentWindow: true };
      const [tab] = await chrome.tabs.query(queryOptions);

      setState((prevState) => ({
        ...prevState,
        currentTab: tab || null,
        currentTabResolved: true,
      }));

      getTabData(tab);
    } catch (error) {
      console.error('Failed to get current tab:', error);
      setLoadError(
        'Unable to read browser tab',
        'Theme Explorer could not access the active tab. Try reopening the popup.'
      );
    }
  };

  const getTabData = async (tab) => {
    if (!tab || !tab.url) {
      setState((prevState) => ({
        ...prevState,
        adminShown: false,
        storeUrl: null,
        themesReady: true,
        storefrontCheckComplete: true,
      }));
      return;
    }
    const tabUrl = parseUrl(tab.url);

    if (!tabUrl) {
      setState((prevState) => ({
        ...prevState,
        adminShown: false,
        storeUrl: null,
        themesReady: true,
        storefrontCheckComplete: true,
      }));
      return;
    }

    const isAdmin = tabUrl.host.includes('admin.shopify.com');
    const adminStoreUrl = tabUrl.storeHandle
      ? `${tabUrl.protocol}//${tabUrl.host}/store/${tabUrl.storeHandle}`
      : null;

    setState((prevState) => ({
      ...prevState,
      adminShown: isAdmin,
      storeUrl: adminStoreUrl,
      themesReady: isAdmin && adminStoreUrl ? prevState.themesReady : true,
      storefrontCheckComplete: isAdmin,
    }));
  };

  function parseUrl(url) {
    try {
      const parsedUrl = new URL(url);
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        return null;
      }

      const urlSegments = parsedUrl.pathname
        .split('/')
        .filter((segment) => segment !== '');
      return {
        fullUrl: url,
        protocol: parsedUrl.protocol,
        host: parsedUrl.host,
        storeHandle: urlSegments[1] || '',
        currentPage: urlSegments[2] || '',
      };
    } catch (error) {
      console.debug('Theme Explorer: failed to parse tab URL:', url);
      return null;
    }
  }

  const fetchThemes = async () => {
    if (!state.storeUrl || !state.adminShown) return;

    try {
      const response = await fetch(`${state.storeUrl}/themes.json`);
      if (!response.ok) {
        throw new Error(`Theme request failed with status ${response.status}`);
      }

      const themesArray = await response.json();
      setState((prevState) => ({
        ...prevState,
        themes: themesArray?.themes || [],
        themesReady: true,
        loadError: false,
        errorTitle: '',
        errorMessage: '',
        storefrontCheckComplete: true,
      }));

      fetchStore();
    } catch (error) {
      console.error('Failed to fetch themes:', error);
      setState((prevState) => ({
        ...prevState,
        themes: [],
        themesReady: true,
        storefrontCheckComplete: true,
      }));
      setLoadError(
        'Unable to load themes',
        'Theme data could not be fetched from this store. Confirm you are in Shopify admin and retry.'
      );
    }
  };

  const registerOnMessage = (request) => {
    if (!request || request.type !== 'theme' || !request.data) {
      return;
    }

    const shopDomain =
      typeof request.data.shop === 'string' ? request.data.shop : '';
    const storeHandle = shopDomain.endsWith('.myshopify.com')
      ? shopDomain.split('.myshopify.com')[0]
      : '';

    setState((prevState) => ({
      ...prevState,
      storefrontInformation:
        request.data.theme || request.data.shop ? request.data : null,
      storeHandle: storeHandle || prevState.storeHandle,
      urls: storeHandle
        ? {
            adminBase: `admin.shopify.com/store/${storeHandle}`,
          }
        : prevState.urls,
      storefrontCheckComplete: true,
      loadError: false,
      errorTitle: '',
      errorMessage: '',
    }));
  };

  useEffect(() => {
    getCurrentTab();
    // Potentially remove fetchThemes() from here if it's dependent on the result of getCurrentTab()
  }, []); // This runs only once when the component mounts

  useEffect(() => {
    if (state.storeUrl) {
      fetchThemes();
    }
  }, [state.storeUrl]); // This runs when `state.storeUrl` changes

  useEffect(() => {
    getLiveTheme();
  }, [getLiveTheme]);

  //   useEffect(() => {
  //   const handleMessage = (request) => registerOnMessage(request);

  //   chrome.runtime.onMessage.addListener(handleMessage);

  //   return () => chrome.runtime.onMessage.removeListener(handleMessage);
  // }, []); // Adjust dependencies based on your needs

  useEffect(() => {
    const handleMessage = (request) => {
      registerOnMessage(request);
    };

    if (!state.storefrontInformation && state.currentTab && !state.adminShown) {
      let retryIntervalId = null;
      const stopPolling = () => {
        if (retryIntervalId) {
          window.clearInterval(retryIntervalId);
          retryIntervalId = null;
        }
      };

      const sendPopupOpenMessage = () => {
        chrome.tabs.sendMessage(
          state.currentTab.id,
          { popupIsOpen: true },
          (response) => {
            if (response && response.type === 'theme' && response.data) {
              registerOnMessage(response);
              return;
            }

            if (chrome.runtime.lastError) {
              const errorMessage = chrome.runtime.lastError.message || '';
              if (
                errorMessage.includes(MESSAGE_PORT_CLOSED_ERROR) ||
                errorMessage.includes(RECEIVING_END_MISSING_ERROR)
              ) {
                if (errorMessage.includes(RECEIVING_END_MISSING_ERROR)) {
                  ensureContentScriptInjected(state.currentTab.id);

                  if (!attemptedMainWorldFallbackRef.current) {
                    attemptedMainWorldFallbackRef.current = true;
                    fetchStorefrontDataFromMainWorld(state.currentTab.id).then(
                      (mainWorldData) => {
                        if (mainWorldData) {
                          registerOnMessage(mainWorldData);
                        }
                      }
                    );
                  }
                }
                return;
              }

              console.debug(
                'Theme Explorer: popup message not delivered:',
                errorMessage
              );
              stopPolling();
              setLoadError(
                'Unable to communicate with the page',
                'Theme Explorer could not read storefront data from this tab. Reload the page and retry.'
              );
            }
          }
        );
      };

      const timeoutId = window.setTimeout(() => {
        fetchStorefrontDataFromMainWorld(state.currentTab.id).then(
          (mainWorldData) => {
            if (mainWorldData) {
              registerOnMessage(mainWorldData);
              return;
            }
            stopPolling();
            setState((prevState) => ({
              ...prevState,
              storefrontCheckComplete: true,
            }));
          }
        );
      }, STOREFRONT_TIMEOUT_MS);
      retryIntervalId = window.setInterval(() => {
        sendPopupOpenMessage();
      }, STOREFRONT_MESSAGE_RETRY_INTERVAL_MS);

      chrome.runtime.onMessage.addListener(handleMessage);
      sendPopupOpenMessage();

      return () => {
        window.clearTimeout(timeoutId);
        stopPolling();
        chrome.runtime.onMessage.removeListener(handleMessage);
      };
    }
  }, [
    state.storefrontInformation,
    state.currentTab,
    state.adminShown,
    ensureContentScriptInjected,
    fetchStorefrontDataFromMainWorld,
    setLoadError,
  ]);

  const handleRetry = () => {
    window.location.reload();
  };

  // if (!state.storefrontInformation && state.currentTab && !state.adminShown) {
  //   chrome.runtime.onMessage.addListener((request) =>
  //     registerOnMessage(request)
  //   );
  //   chrome.tabs.sendMessage(state.currentTab?.id, { popupIsOpen: true });
  // }

  // if (state.storefrontInformation) {
  //   chrome.runtime.onMessage.removeListener(registerOnMessage);
  // }

  if (state.storefrontInformation) {
    return <StorefrontComponent state={state} />;
  } else if (state.loadError) {
    return (
      <NotFound
        title={state.errorTitle || 'Something went wrong'}
        message={
          state.errorMessage ||
          'Theme Explorer hit an unexpected error. Please try again.'
        }
        onRetry={handleRetry}
      />
    );
  } else if (
    state.adminShown &&
    state.themesReady &&
    !state.storeUrl &&
    !state.storefrontInformation
  ) {
    return (
      <NotFound
        title="Shopify admin store not detected"
        message="Open a specific Shopify admin store URL, then retry."
        onRetry={handleRetry}
      />
    );
  } else if (
    state.adminShown &&
    state.themesReady &&
    state.shop &&
    !state.storefrontInformation
  ) {
    return <AdminComponent state={state} />;
  } else if (
    state.currentTabResolved &&
    !state.adminShown &&
    state.storefrontCheckComplete
  ) {
    return (
      <NotFound
        title="No Shopify theme data found"
        message="Open a Shopify storefront or admin page, then retry."
        onRetry={handleRetry}
      />
    );
  } else {
    return <LoadingComponent />;
  }
};

export default Popup;
