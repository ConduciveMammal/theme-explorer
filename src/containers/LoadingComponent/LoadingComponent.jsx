import React from 'react';
import '../../pages/Popup/Popup.scss';
import './LoadingComponent.scss';
import '@fontsource-variable/nunito'; // This contains ALL variable axes. Font files are larger.
import '@fontsource-variable/nunito/wght-italic.css'; // Italic variant.

const LoadingComponent = () => {
  return (
    <div className="popup-container">
      <div className="popup-body">
        <div className="Panel Panel__Loader-screen">
          <div className="Panel__Loader-wrapper">
            <span className="Panel__Loader"></span>
            <p className="Panel__Loader-text">Loading&hellip;</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingComponent;
