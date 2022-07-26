import React from 'react';
import Icon from '../../containers/Icon/Icon';
import './Popup.scss';
import '@fontsource/nunito/variable.css'; // This contains ALL variable axes. Font files are larger.
import '@fontsource/nunito/variable-italic.css'; // Italic variant.
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StorefrontComponent = ({ state }) => {
  const getPreviewURL = () => {
    if (state.storefrontInformation.location) {
      const url = new URL(state.storefrontInformation.location);

      if (url.search) {
        return url.href + '&preview_theme_id=' + state.storefrontInformation.theme.id;
      } else {
        return url.href + '?preview_theme_id=' + state.storefrontInformation.theme.id;
      }
    }
  }

  const getEditorURL = () => {
    return "https://" + state.storefrontInformation.shop + "/admin/themes/" + state.storefrontInformation.theme.id + "/editor";
  }

  const launchToast = (message) => {
    toast.success(`${message}`, {
      position: "bottom-center",
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false
    });
  }

  const copyPreviewURL = () => {
    navigator.clipboard.writeText(getPreviewURL());
    launchToast('Preview URL copied');
  }

  const copyPreviewAndEditorURL = () => {
    navigator.clipboard.writeText(`Themename: ${state.storefrontInformation.theme.name}\n\nPreview: ${getPreviewURL()}\nEditor: ${getEditorURL()}`);
    launchToast('Preview & Editor URL copied');
  }

  return (
    <div className="popup-container popup-storefront">
      <div className="popup-body">
        <div className="Panel Panel--error">
          <div className="Alert Alert--error">
            <div className="Alert__Icon-container">
              <Icon
                name="theme"
                color="#4d52bf"
                size={35}
                classes={'Alert__Icon'}
              />
              <h1 className="title">
                <small>You're spectating</small>
                <br />
                <b>{state.storefrontInformation.theme.name}</b>
              </h1>
            </div>
            <div className="Alert__Content">
              <p className="Alert__Message">
                Generate Preview or Preview & Editor URL to this theme.
              </p>

              <div className='generator-actions'>
                <button className='button' onClick={() => copyPreviewURL()}>
                  Preview URL
                </button>
                <button className='button' onClick={() => copyPreviewAndEditorURL()}>
                  Preview & Editor URL
                </button>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};


export default StorefrontComponent;
