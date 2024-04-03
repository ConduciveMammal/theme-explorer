import React from 'react';
import Icon from '../Icon/Icon';
import "./StorefrontComponent.scss";
import '../../pages/Popup/Popup.scss';
import '@fontsource-variable/nunito'; // This contains ALL variable axes. Font files are larger.
import '@fontsource-variable/nunito/wght-italic.css'; // Italic variant.
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StorefrontComponent = ({ state }) => {
  // console.log('State', state);
  const getPreviewURL = () => {
    if (state.storefrontInformation.location) {
        const url = new URL(state.storefrontInformation.location);

        return url.search ? `${url.href}&preview_theme_id=${state.storefrontInformation.theme.id}` : `${url.href}?preview_theme_id=${state.storefrontInformation.theme.id}`;
    }
  }

  const getEditorURL = () => {
    return `https://${state.urls.adminBase}/themes/${state.storefrontInformation.theme.id}/editor`;
  }

  const launchToast = (message) => {
    toast.success(`${message}`, {
      position: "bottom-center",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false
    });
  }

  const copyPreviewURL = () => {
    copyToClipboard(getPreviewURL(), 'Preview URL copied');
  }

  const copyPreviewAndEditorURL = () => {
    copyToClipboard(`Theme name: ${state.storefrontInformation.theme.name}\n\nPreview: ${getPreviewURL()}\nEditor: ${getEditorURL()}`, 'Preview & Editor URL copied');
  }

  const copyThemeId = () => {
    copyToClipboard(state.storefrontInformation.theme.id, 'Theme ID copied');
  }

  const copyToClipboard = async (text, toastText) => {
    try {
      await navigator.clipboard.writeText(text);
      launchToast(toastText);
    } catch (err) {
      console.error('Failed to copy:', err);
      launchToast('Failed to copy to clipboard', 'error'); // Assuming launchToast can handle error messages
    }
  }


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

              <div className='generator-actions'>
                <button className='button' title="Copy theme ID" onClick={() => copyThemeId()}>
                  Theme ID
                </button>
                <button className='button' title="Copy preview URL" onClick={() => copyPreviewURL()}>
                  Preview URL
                </button>
                <button className='button' title="Copy preview &amp; editor URLs" onClick={() => copyPreviewAndEditorURL()}>
                  Preview &amp; Editor URL
                </button>
              </div>
            </div>
          </div>
          <footer className="Panel__Footer">
            <a href="https://github.com/ConduciveMammal/theme-explorer/issues" target="_blank" rel="noreferrer">Report an issue</a>
          </footer>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};


export default StorefrontComponent;
