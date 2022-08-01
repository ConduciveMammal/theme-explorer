import React from 'react';
import Icon from '../../containers/Icon/Icon';
import DisplayDate from '../../containers/Date/FormatDate';
import ThemeAccordion from '../../containers/ThemeAccordion/ThemeAccordion';
import './Popup.scss';
import '@fontsource/nunito/variable.css'; // This contains ALL variable axes. Font files are larger.
import '@fontsource/nunito/variable-italic.css'; // Italic variant.
import { useState } from 'react';

const AdminComponent = ({ state }) => {
  const [filteredThemes, setFilteredThemes] = useState(null);

  const filterThemesBasedOnInput = (evt) => {
    setFilteredThemes(state.themes.filter(theme => theme.name.includes(evt.target.value)));
  }

  console.log(state.shop);

  return (
    <div className="popup-container">
      <span className='AdminComponent__ThemeCount'>
        {(state.shop?.plan_name === "shopify_plus" && state.themes.length === 100)
          || (state.shop?.plan_name !== "shopify_plus" && state.themes.length === 20) ?
          <>
            No free space for Themes are available
          </>
          :
          <>
            {state.themes.length} of
            {state.shop?.plan_name === "shopify_plus" && " 100 "}
            {state.shop?.plan_name !== "shopify_plus" && " 20 "}
            Themes are occupied
          </>
        }
      </span>
      <header className="AdminComponent__Header">
        <h1 className={"Header__Title"}>
          {state.liveTheme?.name}
        </h1>
        <div className={"Header__Date"}>
          <p>
            Created at <b><DisplayDate date={state.liveTheme?.created_at} /></b> and updated on <b><DisplayDate date={state.liveTheme?.updated_at} /></b>
          </p>
        </div>
        <p className={"Header__Id"}>
          Theme ID: {state.liveTheme?.id}
        </p>
      </header>
      <div className="popup-body">
        <input className={"popup-body-input"} placeholder={"Search for your theme"} onChange={(evt) => filterThemesBasedOnInput(evt)} />
        <div className="Panel">
          <>
            {state.themesReady && !filteredThemes ?
              state.themes.map((theme, index) => {
                return (
                  <ThemeAccordion
                    theme={theme}
                    shop={state.shop}
                    key={index}
                    index={index}
                  />
                );
              })
              :
              filteredThemes.map((theme, index) => {
                return (
                  <ThemeAccordion
                    theme={theme}
                    shop={state.shop}
                    key={index}
                    index={index}
                  />
                );
              })
            }
            {filteredThemes && filteredThemes.length === 0 &&
              <div className="Accordion__Container">
                <header className={"Accordion__Header"}>
                  <div className="Accordion__Icon-container">
                    <Icon
                      name="error"
                      color="#FFFFFF"
                      size={35}
                      classes={'Accordion__Icon'}
                    />
                  </div>
                  <p className="Accordion__Title">No Theme found!</p>
                </header>
              </div>
            }
          </>
          <div className="Accordion__Container">
            <header className="Accordion__Header Accordion__Header--json">
              <div className="Accordion__Icon-container">
                <Icon
                  name="json"
                  color="#FFFFFF"
                  size={35}
                  classes={'Accordion__Icon'}
                />
              </div>
              <p className="Accordion__Title">
                <a
                  href={`${state.storeUrl}/admin/themes.json`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View JSON
                </a>
              </p>
            </header>
          </div>
        </div>
      </div>

      <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }}>
        <symbol id="icon-theme">
          <path d="M47.526 4.128a193.239 193.239 0 00-30.988-.005 13.462 13.462 0 00-12.41 12.35 192.439 192.439 0 00-.005 30.99 13.462 13.462 0 0012.35 12.41 192.446 192.446 0 0030.99.004 13.461 13.461 0 0012.41-12.35c.416-5.14.627-10.364.627-15.527a193 193 0 00-.623-15.462 13.462 13.462 0 00-12.35-12.41zm9.356 43.156a10.473 10.473 0 01-9.661 9.603 190.049 190.049 0 01-30.505-.005 10.474 10.474 0 01-9.603-9.66 189.453 189.453 0 01.005-30.506 10.474 10.474 0 019.66-9.603 189.452 189.452 0 0130.506.005 10.474 10.474 0 019.603 9.66 189.427 189.427 0 01-.005 30.506z"></path>
          <path d="M44.75 13.5h-25.5a1.5 1.5 0 00-1.5 1.5v17a5.757 5.757 0 005.75 5.75h2.75v7a5.75 5.75 0 0011.5 0v-7h2.75A5.756 5.756 0 0046.25 32V15a1.5 1.5 0 00-1.5-1.5zm-24 3h5.5v2.75a1.5 1.5 0 003 0V16.5h5.5v2.75a1.5 1.5 0 003 0V16.5h5.5v9.75h-22.5zM43.25 32a2.753 2.753 0 01-2.75 2.75h-4.25a1.5 1.5 0 00-1.5 1.5v8.5a2.75 2.75 0 01-5.5 0v-8.5a1.5 1.5 0 00-1.5-1.5H23.5A2.753 2.753 0 0120.75 32v-2.75h22.5z"></path>
        </symbol>
      </svg>
    </div>
  );
};

export default AdminComponent;
