import React, { useState, useEffect } from 'react';

import './Popup.scss';
import '@fontsource/nunito/variable.css'; // This contains ALL variable axes. Font files are larger.
import '@fontsource/nunito/variable-italic.css'; // Italic variant.;

import LoadingComponent from './LoadingComponent';
import AdminComponent from './AdminComponent';
import StorefrontComponent from './StorefrontComponent';

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

    const tabUrl = await new URL(tab.url);

    setState((prevState) => ({
      ...prevState,
      adminShown: tabUrl.hostname.includes('.myshopify.com'),
      storeUrl: `${tabUrl.protocol}//${tabUrl.hostname}`,
    }));
  };

  const fetchThemes = async () => {
    if (!state.storeUrl || !state.adminShown) return;

    await fetch(`${state.storeUrl}/admin/themes.json`)
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
    if (request.type === 'theme') {
      setState((prevState) => ({
        ...prevState,
        storefrontInformation: request.data,
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

  if (!state.adminShown && state.storefrontInformation && !state.storefrontInformation.location.includes("admin")) {
    return <StorefrontComponent state={state} />;
  } else if (state.adminShown && state.themesReady && state.shop) {
    return <AdminComponent state={state} />;
  } else {
    return <LoadingComponent />;
  }
};

export default Popup;
