import React, { useState, useEffect, useCallback } from 'react';
import * as Sentry from '@sentry/browser';

import './Popup.scss';
import '@fontsource-variable/nunito'; // This contains ALL variable axes. Font files are larger.
import '@fontsource-variable/nunito/wght-italic.css'; // Italic variant.

import LoadingComponent from '../../containers/LoadingComponent/LoadingComponent';
import AdminComponent from '../../containers/AdminComponent/AdminComponent';
import StorefrontComponent from '../../containers/StorefrontComponent/StorefrontComponent';
import NotFound from '../../containers/NotFound/NotFound';


window.addEventListener("load", function () {
  Sentry.init({
    dsn:
    "https://769de98c6320a26b71a868f8ba5ab915@o4506865007722496.ingest.us.sentry.io/4506865009557504",
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    integrations: [
      Sentry.replayIntegration(),
    ]
  });
});

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
  });

  const getLiveTheme = useCallback(() => {
    if (!state.themes) return;

    const liveTheme = state.themes.find(theme => theme.role === 'main');
    console.log('ll', liveTheme);
    if (liveTheme) {
      setState(prevState => ({ ...prevState, liveTheme }));
    }
  }, [state.themes]);

  const fetchStore = async () => {
    if (!state.storeUrl) return;

    try {
      console.log('shop state', state);
      const response = await fetch(`${state.storeUrl}/shop.json`);
      const data = await response.json();

      setState(prevState => ({
        ...prevState,
        shop: data.shop,
        storeHandle: data.shop.domain.split('.myshopify.com')[0]
      }));
    } catch (error) {
      console.error('Failed to fetch store: ', error)
    }
  };

  const getCurrentTab = async () => {
    let queryOptions = { active: true, currentWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);

    setState((prevState) => ({
      ...prevState,
      currentTab: tab,
    }));

    getTabData(tab);
  };

  const getTabData = async (tab) => {
    if (!tab) return;

    // const tabUrl = await new URL(tab.url);
    const tabUrl = parseUrl(tab.url);

    // console.log('t', tab);
    // console.log(tabUrl);


    setState((prevState) => ({
      ...prevState,
      adminShown: tabUrl.host.includes('admin.shopify.com'),
      storeUrl: `${tabUrl.protocol}//${tabUrl.host}/store/${tabUrl.storeHandle}`,
    }));
    // console.log('Tab', `${tabUrl.protocol}//${tabUrl.host}/store/${tabUrl.storeHandle}`);
  };

  function parseUrl(url) {
    const parsedUrl = new URL(url);
    const urlSegments = parsedUrl.pathname.split('/').filter(segment => segment !== '')
    return {
      fullUrl: url,
      protocol: parsedUrl.protocol,
      host: parsedUrl.host,
      storeHandle: urlSegments[1],
      currentPage: urlSegments[2]
    };
  }

  const fetchThemes = async () => {
    if (!state.storeUrl || !state.adminShown) return;
    console.log('url', state.storeUrl);
    await fetch(`${state.storeUrl}/themes.json`)
      .then((response) => response.text())
      .then((data) => {
        const themesArray = JSON.parse(data);

        setState((prevState) => ({
          ...prevState,
          themes: themesArray.themes,
        }));
      })
      .then(() => {
        fetchStore();

        setState((prevState) => ({
          ...prevState,
          themesReady: true,
        }));
      });
  };

  const registerOnMessage = (request) => {
    // console.log('loloo', request);
    const storeHandle = request.data.shop.split('.myshopify.com')[0];

    if (request.type === 'theme') {
      setState((prevState) => ({
        ...prevState,
        storefrontInformation: request.data.hasOwnProperty('theme') ? request.data : null,
        storeHandle,
        urls: {
          adminBase: `admin.shopify.com/store/${storeHandle}`
        }
      }));
    }
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
  // Define a function that will handle incoming messages
  const handleMessage = (request) => {
    registerOnMessage(request);
  };

  // Conditionally add the event listener
  if (!state.storefrontInformation && state.currentTab && !state.adminShown) {
    chrome.runtime.onMessage.addListener(handleMessage);
    chrome.tabs.sendMessage(state.currentTab.id, { popupIsOpen: true });

    // Return a cleanup function that removes the event listener
    return () => chrome.runtime.onMessage.removeListener(handleMessage);
  }

  // This effect should depend on the state that dictates whether the listener should be added or removed
}, [state.storefrontInformation, state.currentTab, state.adminShown]); // Adjust this array based on actual dependencies


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
  } else if (state.adminShown && state.themesReady && state.shop && !state.storefrontInformation) {
    return <AdminComponent state={state} />;
  } else if (!state.storefrontInformation && !state.adminShown && !state.themesReady) {
    return <NotFound />;
  } else {
    return <LoadingComponent />;
  }
};

export default Popup;
