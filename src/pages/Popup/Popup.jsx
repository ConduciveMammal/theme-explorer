import React, { useState, useEffect } from 'react';

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
    currentTab: null,
  });

  const getLiveTheme = () => {
    if (!state.themes) return;

    state.themes.map((theme) => {
      if (theme.role === 'main') {
        setState((prevState) => ({
          ...prevState,
          liveTheme: theme,
        }));
      }
    });
  };

  const fetchStore = async () => {
    if (!state.storeUrl) return;

    await fetch(`${state.storeUrl}/admin/shop.json`)
      .then((response) => response.json())
      .then((data) => {
        setState((prevState) => ({
          ...prevState,
          shop: data.shop,
        }));
      });
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
    console.log('t', tab);
    console.log(tabUrl);


    setState((prevState) => ({
      ...prevState,
      adminShown: tabUrl.host.includes('admin.shopify.com'),
      storeUrl: `${tabUrl.protocol}//${tabUrl.host}/store/${tabUrl.storeHandle}`,
    }));
    console.log('Tab', `${tabUrl.protocol}//${tabUrl.host}/store/${tabUrl.storeHandle}`);
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
    fetchThemes();
  }, [state.storeUrl]);

  useEffect(() => {
    getLiveTheme();
  }, [state.themes]);

  if (!state.storefrontInformation && state.currentTab && !state.adminShown) {
    chrome.runtime.onMessage.addListener((request) =>
      registerOnMessage(request)
    );
    chrome.tabs.sendMessage(state.currentTab?.id, { popupIsOpen: true });
  }

  if (state.storefrontInformation) {
    chrome.runtime.onMessage.removeListener(registerOnMessage);
  }

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
