import React from 'react';

import Icon from '../../containers/Icon/Icon';
import DisplayDate from '../../containers/Date/FormatDate';
import ThemeAccordion from '../../containers/ThemeAccordion/ThemeAccordion';
import './Popup.scss';
import "@fontsource/nunito/variable.css"; // This contains ALL variable axes. Font files are larger.
import "@fontsource/nunito/variable-italic.css"; // Italic variant.

class Popup extends React.Component {
  constructor() {
    super();
    this.state = {
      themes: JSON.parse,
      themesReady: false,
    };

    this.getCurrentTab().then(tab => {
      const tabUrl = new URL(tab.url);

      this.setState({
        adminShown: tabUrl.hostname.includes('.myshopify.com'),
        storeUrl: `${tabUrl.protocol}//${tabUrl.hostname}`,
      });
    })
    .then(() => {
      this.fetchThemes();
    });

  }
  getCurrentTab = async () => {
    let queryOptions = { active: true, currentWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);

    return tab;
  };

  fetchStore = async () => {
    await fetch(`${this.state.storeUrl}/admin/shop.json`)
    .then(response => response.json())
    .then(data => {
      this.setState({
        shop: data.shop,
      });
    })
  }

  fetchThemes = async () => {
    await fetch(`${this.state.storeUrl}/admin/themes.json`)
      .then(response => response.text())
      .then(data => {
        const themesArray = JSON.parse(data);
        this.setState({
          themes: themesArray.themes,
        });
      })
      .then(() => {
        this.getLiveTheme();
        this.fetchStore();
        this.setState({
          themesReady: true,
        });
    });
  }

  getLiveTheme = () => {
    this.state.themes.map((theme) => {
      if (!theme.role === 'main') {
        return false;
      }

      return this.setState({
        liveTheme: theme,
      });
    });
  }
  render() {
    if (!this.state.adminShown) {
      return (
        <div className="popup-container">
          <div className="popup-body">
            <div className="Panel Panel--error">
              <div className="Alert Alert--error">
                <div className="Alert__Icon-container">
                  <Icon name="error" color="#FFF" size={35} classes={"Alert__Icon"}/>
                </div>
                <div className="Alert__Content">
                  <p className="Alert__Message">Shopify admin was not found. Make sure the admin tab is focused.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (this.state.themesReady && this.state.shop) {
      return (
      <div className="popup-container">
        <header className="Popup__Header">
          <h1 className="Header__Title">{this.state.liveTheme.name}</h1>
          <div className="Header__Subtitle-wrapper">
            <h2 className="Header__Subtitle Subtitle--Primary">Updated: <DisplayDate date={this.state.liveTheme.updated_at} /></h2>
            <h3 className="Header__Subtitle Subtitle--Aside"><small>Theme ID: {this.state.liveTheme.id}</small></h3>
          </div>
          <div className="Header__Subtitle Subtitle--Secondary Header__Subtitle--subdued">Created at: <DisplayDate date={this.state.liveTheme.created_at} /></div>
        </header>
        <div className="popup-body">
          <div className="Panel">
            {
              this.state.themesReady && this.state.themes.map((theme, index) => {
                return <ThemeAccordion theme={theme} shop={this.state.shop} key={index} index={index} />;
              })
            }
            <div className="Accordion__Container">
              <header className="Accordion__Header Accordion__Header--json">
                <div className="Accordion__Icon-container">
                  <Icon name="json" color="#FFFFFF" size={35} classes={'Accordion__Icon'}/>
                </div>
                <p className="Accordion__Title">
                  <a href={`${this.state.storeUrl}/admin/themes.json`} target="_blank" rel="noreferrer">View JSON</a>
                </p>
              </header>
            </div>
          </div>
        </div>

        <svg xmlns="http://www.w3.org/2000/svg" style={{display: 'none'}}>
          <symbol id="icon-theme">
            <path d="M47.526 4.128a193.239 193.239 0 00-30.988-.005 13.462 13.462 0 00-12.41 12.35 192.439 192.439 0 00-.005 30.99 13.462 13.462 0 0012.35 12.41 192.446 192.446 0 0030.99.004 13.461 13.461 0 0012.41-12.35c.416-5.14.627-10.364.627-15.527a193 193 0 00-.623-15.462 13.462 13.462 0 00-12.35-12.41zm9.356 43.156a10.473 10.473 0 01-9.661 9.603 190.049 190.049 0 01-30.505-.005 10.474 10.474 0 01-9.603-9.66 189.453 189.453 0 01.005-30.506 10.474 10.474 0 019.66-9.603 189.452 189.452 0 0130.506.005 10.474 10.474 0 019.603 9.66 189.427 189.427 0 01-.005 30.506z"></path>
            <path d="M44.75 13.5h-25.5a1.5 1.5 0 00-1.5 1.5v17a5.757 5.757 0 005.75 5.75h2.75v7a5.75 5.75 0 0011.5 0v-7h2.75A5.756 5.756 0 0046.25 32V15a1.5 1.5 0 00-1.5-1.5zm-24 3h5.5v2.75a1.5 1.5 0 003 0V16.5h5.5v2.75a1.5 1.5 0 003 0V16.5h5.5v9.75h-22.5zM43.25 32a2.753 2.753 0 01-2.75 2.75h-4.25a1.5 1.5 0 00-1.5 1.5v8.5a2.75 2.75 0 01-5.5 0v-8.5a1.5 1.5 0 00-1.5-1.5H23.5A2.753 2.753 0 0120.75 32v-2.75h22.5z"></path>
          </symbol>
        </svg>
      </div>
      );
    } else {
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
    }
  }
}


export default Popup;
