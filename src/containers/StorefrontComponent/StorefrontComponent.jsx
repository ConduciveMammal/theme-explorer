import React from 'react';
import Icon from '../Icon/Icon';
import './StorefrontComponent.scss';
import '../../pages/Popup/Popup.scss';
import '@fontsource-variable/nunito'; // This contains ALL variable axes. Font files are larger.
import '@fontsource-variable/nunito/wght-italic.css'; // Italic variant.
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StorefrontComponent = ({ state }) => {
  const themeId = state?.storefrontInformation?.theme?.id;
  const shopDomain = state?.storefrontInformation?.shop;

  const getPreviewURL = () => {
    if (!shopDomain || !themeId) {
      return null;
    }

    const previewUrl = new URL(`https://${shopDomain}`);
    previewUrl.searchParams.set('preview_theme_id', themeId);

    return previewUrl.toString();
  };

  const getEditorURL = () => {
    if (!themeId || !state?.urls?.adminBase) {
      return null;
    }

    return `https://${state.urls.adminBase}/themes/${themeId}/editor`;
  };

  const launchSuccessToast = (message) => {
    toast.success(`${message}`, {
      position: 'bottom-center',
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
    });
  };

  const launchErrorToast = (message) => {
    toast.error(`${message}`, {
      position: 'bottom-center',
      autoClose: 1500,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
    });
  };

  const copyPreviewURL = () => {
    const previewUrl = getPreviewURL();

    if (!previewUrl) {
      launchErrorToast('Preview URL unavailable');
      return;
    }

    copyToClipboard(previewUrl, 'Preview URL copied');
  };

  const copyPreviewAndEditorURL = () => {
    const previewUrl = getPreviewURL();
    const editorUrl = getEditorURL();

    if (!previewUrl || !editorUrl) {
      launchErrorToast('Preview or Editor URL unavailable');
      return;
    }

    copyToClipboard(
      `Theme name: ${state.storefrontInformation.theme.name}\n\nPreview: ${previewUrl}\nEditor: ${editorUrl}`,
      'Preview & Editor URL copied'
    );
  };

  const copyThemeId = () => {
    if (!themeId) {
      launchErrorToast('Theme ID unavailable');
      return;
    }

    copyToClipboard(themeId, 'Theme ID copied');
  };

  const copyToClipboard = async (text, toastText) => {
    if (!text) {
      launchErrorToast('Nothing to copy');
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      launchSuccessToast(toastText);
    } catch (err) {
      console.error('Failed to copy:', err);
      launchErrorToast('Failed to copy to clipboard');
    }
  };

  const previewUrlAvailable = Boolean(getPreviewURL());
  const editorUrlAvailable = Boolean(getEditorURL());

  return (
    <div className="popup-container popup-storefront">
      <div className="popup-body">
        <div className="Panel">
          <div className="Alert Alert--padding">
            <div className="Alert__Icon-container">
              <Icon
                name="theme"
                color="#4d52bf"
                size={35}
                classes={'Alert__Icon'}
              />
              <h1 className="title">
                <small>Theme name:</small>
                <br />
                <strong>{state.storefrontInformation.theme.name}</strong>
              </h1>
            </div>
            <div className="Alert__Content">
              <p className="Alert__Message">
                Generate Preview or Preview &amp; Editor URL to this theme.
              </p>

              <div className="generator-actions">
                <button
                  className="button"
                  title="Copy theme ID"
                  onClick={() => copyThemeId()}
                >
                  Theme ID
                </button>
                <button
                  className="button"
                  title="Copy preview URL"
                  onClick={() => copyPreviewURL()}
                  disabled={!previewUrlAvailable}
                >
                  Preview URL
                </button>
                <button
                  className="button"
                  title="Copy preview &amp; editor URLs"
                  onClick={() => copyPreviewAndEditorURL()}
                  disabled={!previewUrlAvailable || !editorUrlAvailable}
                >
                  Preview &amp; Editor URL
                </button>
              </div>
            </div>
          </div>
          <footer className="Panel__Footer">
            <a
              href="https://github.com/ConduciveMammal/theme-explorer/issues"
              target="_blank"
              rel="noreferrer"
            >
              Report an issue
            </a>
          </footer>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default StorefrontComponent;
