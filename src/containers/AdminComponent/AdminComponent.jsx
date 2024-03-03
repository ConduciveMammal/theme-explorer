import React from 'react';
import Icon from '../Icon/Icon';
import DisplayDate from '../Date/FormatDate';
import ThemeAccordion from '../ThemeAccordion/ThemeAccordion';
import FooterBar from '../FooterBar/FooterBar';

import '../../pages/Popup/Popup.scss';
import '@fontsource-variable/nunito';
import '@fontsource-variable/nunito/wght-italic.css'; // Italic variant.
import { useState } from 'react';
import Fuse from 'fuse.js';

const AdminComponent = ({ state }) => {
  const { themes, liveTheme, themesReady, storeUrl, shop } = state;

  const initialThemeData = themes
  const [filteredThemes, setFilteredThemes] = useState(initialThemeData);

  const fuseOptions = {
    includeScore: true,
    useExtendedSearch: false,
    threshold: 0.4,
    location: 0,
    ignoreLocation: true,
    distance: 2,
    maxPatternLength: 32,
    minMatchCharLength: 2,
    keys: [
      'name',
      {
        name: 'id',
        weight: 3
      },
      {
        name: 'role',
        weight: 2,
      },
    ],
  };

  const fuse = new Fuse(initialThemeData, fuseOptions);

  const filterThemesBasedOnInput = (evt) => {
    const { value } = evt.target;

    if (value.length === 0) {
      setFilteredThemes(initialThemeData);
      return;
    }

    const results = fuse.search(value);
    const items = results.map((result) => result.item);

    setFilteredThemes(items);
  };

  const plans = {
    plus: {
      name: 'shopify_plus',
      themeLimit: 100,
    },
    nonPlus: {
      name: '',
      themeLimit: 20,
    },
  };

  const getPlanName = () => {
    return shop?.plan_name;
  };

  function getPlanThemeLimit() {
    return getPlanName() === plans.plus.name
      ? plans.plus.themeLimit
      : plans.nonPlus.themeLimit;
  }

  function themeCountNotice() {
    const currentPlanLimit = getPlanThemeLimit();

    if (themes.length >= currentPlanLimit) {
      return 'No free space for themes is available';
    } else {
      return `${
        themes.length
      } of ${getPlanThemeLimit()} themes installed`;
    }
  }

  const themeMessage = themeCountNotice();

  return (
    <div className="popup-container">
      <span className="AdminComponent__ThemeCount">{themeMessage}</span>
      <header className="AdminComponent__Header">
        <h1 className={'Header__Title'}>{liveTheme?.name}</h1>
        <div className={'Header__Date'}>
          <p>
            Created at{' '}
            <strong>
              <DisplayDate date={liveTheme?.created_at} />
            </strong>{' '}
            and updated on{' '}
            <strong>
              <DisplayDate date={liveTheme?.updated_at} />
            </strong>
          </p>
        </div>
        <p className={'Header__Id'}>Theme ID: {liveTheme?.id}</p>
      </header>
      <div className="popup-body">
        <div className="Popup__Search-wrapper">
          <input
            className={'popup-body-input'}
            aria-label="Search by theme ID, name or role."
            placeholder={`Search by theme ID, name, or role\u2026`}
            onChange={(evt) => {
              const value = evt.target.value;
              if (value.length > 2 || value.length === 0) {
                filterThemesBasedOnInput(evt);
              }
            }}
          />
        </div>
        <div className="Panel">
          <>
            {themesReady && !filteredThemes
              ? themes.map((theme, index) => {
                  return (
                    <ThemeAccordion
                      theme={theme}
                      storeUrl={storeUrl}
                      shop={shop}
                      key={theme.id}
                      index={index}
                    />
                  );
                })
              : filteredThemes.map((theme, index) => {
                  return (
                    <ThemeAccordion
                      data-filtered-item
                      theme={theme}
                      storeUrl={state.storeUrl}
                      shop={state.shop}
                      key={theme.id}
                      index={index}
                    />
                  );
                })}
            {filteredThemes && filteredThemes.length === 0 && (
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
            )}
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
                  href={`${storeUrl}/themes.json`}
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
