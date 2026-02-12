import React from 'react';
import '../../pages/Popup/Popup.scss';
import '@fontsource-variable/nunito'; // This contains ALL variable axes. Font files are larger.
import '@fontsource-variable/nunito/wght-italic.css'; // Italic variant.

const NotFound = ({
  title = 'Shopify store not found',
  message = 'Open a Shopify admin or storefront tab, then try again.',
  onRetry,
  retryLabel = 'Retry',
}) => {
  return (
    <div className="popup-container">
      <div className="popup-body">
        <div className="Panel Panel__Loader-screen Panel__Status-screen">
          <div className="Panel__Loader-wrapper Panel__Status-wrapper">
            <p className="Panel__Status-title">{title}</p>
            <p className="Panel__Status-message">{message}</p>
            {onRetry && (
              <button className="button Panel__Status-retry" onClick={onRetry}>
                {retryLabel}
              </button>
            )}
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
    </div>
  );
};

export default NotFound;
