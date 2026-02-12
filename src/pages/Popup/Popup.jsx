import React, { useState, useEffect, useCallback } from 'react';

import './Popup.scss';
import '@fontsource-variable/nunito'; // This contains ALL variable axes. Font files are larger.
import '@fontsource-variable/nunito/wght-italic.css'; // Italic variant.

import LoadingComponent from '../../containers/LoadingComponent/LoadingComponent';
import AdminComponent from '../../containers/AdminComponent/AdminComponent';
import StorefrontComponent from '../../containers/StorefrontComponent/StorefrontComponent';
import NotFound from '../../containers/NotFound/NotFound';

const Popup = () => {
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
  });

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
      }));
    } catch (error) {
      console.error('Failed to fetch store:', error);
      setState((prevState) => ({
        ...prevState,
        loadError: true,
      }));
    }
  };

  const getCurrentTab = async () => {
    try {
      const queryOptions = { active: true, currentWindow: true };
      const [tab] = await chrome.tabs.query(queryOptions);

      setState((prevState) => ({
        ...prevState,
        currentTab: tab || null,
      }));

      getTabData(tab);
    } catch (error) {
      console.error('Failed to get current tab:', error);
      setState((prevState) => ({
        ...prevState,
        loadError: true,
      }));
    }
  };

  const getTabData = async (tab) => {
    if (!tab || !tab.url) return;
    const tabUrl = parseUrl(tab.url);

    if (!tabUrl) {
      setState((prevState) => ({
        ...prevState,
        adminShown: false,
        storeUrl: null,
      }));
      return;
    }

    setState((prevState) => ({
      ...prevState,
      adminShown: tabUrl.host.includes('admin.shopify.com'),
      storeUrl: tabUrl.storeHandle
        ? `${tabUrl.protocol}//${tabUrl.host}/store/${tabUrl.storeHandle}`
        : null,
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
      }));

      fetchStore();
    } catch (error) {
      console.error('Failed to fetch themes:', error);
      setState((prevState) => ({
        ...prevState,
        themes: [],
        themesReady: true,
        loadError: true,
      }));
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
      storefrontInformation: request.data.theme ? request.data : null,
      storeHandle: storeHandle || prevState.storeHandle,
      urls: storeHandle
        ? {
            adminBase: `admin.shopify.com/store/${storeHandle}`,
          }
        : prevState.urls,
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
      chrome.runtime.onMessage.addListener(handleMessage);
      chrome.tabs.sendMessage(
        state.currentTab.id,
        { popupIsOpen: true },
        () => {
          if (chrome.runtime.lastError) {
            console.debug(
              'Theme Explorer: popup message not delivered:',
              chrome.runtime.lastError.message
            );
          }
        }
      );

      return () => chrome.runtime.onMessage.removeListener(handleMessage);
    }
  }, [state.storefrontInformation, state.currentTab, state.adminShown]);

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
    return <NotFound />;
  } else if (
    state.adminShown &&
    state.themesReady &&
    state.shop &&
    !state.storefrontInformation
  ) {
    return <AdminComponent state={state} />;
  } else if (
    !state.storefrontInformation &&
    !state.adminShown &&
    !state.themesReady
  ) {
    return <NotFound />;
  } else {
    return <LoadingComponent />;
  }
};

export default Popup;
