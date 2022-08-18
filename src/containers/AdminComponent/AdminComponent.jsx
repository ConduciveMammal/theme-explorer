import React, { useState } from 'react';
import MixPanel from '../../Utilities/MixPanel';
import Icon from '../Icon/Icon';
import DisplayDate from '../Date/FormatDate';
import ThemeAccordion from '../ThemeAccordion/ThemeAccordion';
import '../../pages/Popup/Popup.scss';
import '@fontsource/nunito/variable.css'; // This contains ALL variable axes. Font files are larger.
import '@fontsource/nunito/variable-italic.css'; // Italic variant.

const AdminComponent = ({ state }) => {
  console.log(state);
  MixPanel('Admin Component', {"shop": state.shop.myshopify_domain});
  const [filteredThemes, setFilteredThemes] = useState(null);

  const returnSearchItem = (term, compare) => {return term.toLowerCase().includes(compare.toLowerCase())}

  const filterThemesBasedOnInput = (evt) => {
    setFilteredThemes(state.themes.filter(theme => returnSearchItem(theme.name, evt.target.value)));
  }

  return (
    <div className="popup-container">
      <span className='AdminComponent__ThemeCount'>
        {(state.shop?.plan_name === "shopify_plus" && state.themes.length === 100)
          || (state.shop?.plan_name !== "shopify_plus" && state.themes.length === 20) ?
          <>
            No free space for themes is available
          </>
          :
          <>
            {state.themes.length} of
            {state.shop?.plan_name === "shopify_plus" && " 100 "}
            {state.shop?.plan_name !== "shopify_plus" && " 20 "}
            themes installed
          </>
        }
      </span>
      <header className="AdminComponent__Header">
        <h1 className={"Header__Title"}>
          {state.liveTheme?.name}
        </h1>
        <div className={"Header__Date"}>
          <p>
            Created at <strong><DisplayDate date={state.liveTheme?.created_at} /></strong> and updated on <strong><DisplayDate date={state.liveTheme?.updated_at} /></strong>
          </p>
        </div>
        <p className={"Header__Id"}>
          Theme ID: {state.liveTheme?.id}
        </p>
      </header>
      <div className="popup-body">
        <div className="Popup__Search-wrapper">
          <input className={"popup-body-input"} placeholder={"Search for your theme"} onChange={(evt) => filterThemesBasedOnInput(evt)} />
        </div>
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
                <header className="Accordion__Header Accordion__Header--no-results">
                  <div className="Accordion__Icon-container">
                    <Icon
                      name="error"
                      color="#FFFFFF"
                      size={35}
                      classes={'Accordion__Icon'}
                    />
                  </div>
                  <p className="Accordion__Title">No themes found</p>
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
    </div>
  );
};

export default AdminComponent;
