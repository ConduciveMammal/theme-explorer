import React from 'react';
import '../../pages/Popup/Popup.scss';
import '@fontsource-variable/nunito'; // This contains ALL variable axes. Font files are larger.
import '@fontsource-variable/nunito/wght-italic.css'; // Italic variant.

const NotFound = () => {
  return (
    <div className="popup-container">
      <div className="popup-body">
        <div className="Panel Panel__Loader-screen">
          <div className="Panel__Loader-wrapper">
            <p className="Panel__Loader-text">
              Shopify store not found
            </p>
          </div>
        </div>
          <footer className="Panel__Footer">
              <a href="https://github.com/ConduciveMammal/theme-explorer/issues" target="_blank" rel="noreferrer">Report an issue</a>
          </footer>
      </div>
    </div>
  );
};

export default NotFound;
