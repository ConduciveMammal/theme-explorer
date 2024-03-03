import React from 'react';
import Icon from '../Icon/Icon';
import DisplayDate from '../Date/FormatDate';
import ThemeAccordion from '../ThemeAccordion/ThemeAccordion';
import FooterBar from '../FooterBar/FooterBar';

import '../../pages/Popup/Popup.scss';
import '@fontsource-variable/nunito'; // This contains ALL variable axes. Font files are larger.
import '@fontsource-variable/nunito/wght-italic.css'; // Italic variant.
import { useState } from 'react';

const AdminComponent = ({ state }) => {
  console.log('state', state);
  const [filteredThemes, setFilteredThemes] = useState(null);

  const returnSearchItem = (term, compare) => {return term.toLowerCase().includes(compare.toLowerCase())}

  const filterThemesBasedOnInput = (evt) => {
    setFilteredThemes(state.themes.filter(theme => returnSearchItem(theme.name, evt.target.value)));
  }

  const plans = {
    plus: {
      name: 'shopify_plus',
      themeLimit: 100
    },
    nonPlus: {
      name: '',
      themeLimit: 20
    }
  }

  const getPlanName = () => {
    return state.shop?.plan_name
  }

  function getPlanThemeLimit() {
    return getPlanName() === plans.plus.name ? plans.plus.themeLimit : plans.nonPlus.themeLimit
  }

  function themeCountNotice() {
    const currentPlanLimit = getPlanThemeLimit();

    if ((state.themes.length >= currentPlanLimit)) {
      return 'No free space for themes is available'
    } else {
      return `${state.themes.length} of ${getPlanThemeLimit()} themes installed`
    }
  }

  const themeMessage = themeCountNotice();

  return (
    <div className="popup-container">
      <span className='AdminComponent__ThemeCount'>
        {themeMessage}
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
                console.log('theme state', state);
                return (
                  <ThemeAccordion
                    theme={theme}
                    storeUrl={state.storeUrl}
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
                    storeUrl={state.storeUrl}
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
                  href={`${state.storeUrl}/themes.json`}
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
      <FooterBar />
    </div>
  );
};

export default AdminComponent;
