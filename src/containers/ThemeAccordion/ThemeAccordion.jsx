import React from 'react';
import Collapse from '@kunukn/react-collapse';

import Icon from '../Icon/Icon';
import DisplayDate from '../Date/FormatDate';
import './ThemeAccordion.scss';

const ThemeAccordion = ({ theme, shop, index, storeUrl }) => {
  // console.log(shop);
  const [isOpen, setIsOpen] = React.useState(false);
  const onToggle = () => setIsOpen((shown) => !shown);
  const themePreviewUrl = `https://${shop.domain}?preview_theme_id=${theme.id}`;
  const themeJsonUrl = `${storeUrl}/themes/${theme.id}.json`;
  const themeCodeUrl = `${storeUrl}/themes/${theme.id}`;
  const themeCustomiseUrl = `${storeUrl}/themes/${theme.id}/editor`;
  const themeLanguageEditorUrl = `${storeUrl}/themes/${theme.id}/language`;

  return (
    <div className="Accordion__Container">
      <header
        className={`Accordion__Header${
          theme.role === 'main' ? ' Accordion__Header--main' : ''
        }${isOpen ? ' Accordion__Header--open' : ''}`}
        onClick={onToggle}
        aria-controls={`Accordion-${index}`}
      >
        <div className="Accordion__Icon-container">
          <Icon
            name="theme"
            color="#FFFFFF"
            size={35}
            classes={'Accordion__Icon'}
          />
        </div>
        <p className="Accordion__Title">{theme.name}</p>
        <p className="Accordion__Link">
          <a
            href={
              theme.role === 'main' ? `https://${shop.domain}` : themePreviewUrl
            }
            target="_blank"
            rel="noreferrer"
          >
            {theme.role === 'main' ? 'View' : 'Preview'}
          </a>
        </p>
      </header>
      <Collapse
        id={`Accordion-${index}`}
        className="Accordion__Body"
        aria-hidden={isOpen ? 'false' : 'true'}
        isOpen={isOpen}
        transition={`height .2s cubic-bezier(.4, 0, .2, 1)`}
      >
        <div className="Accordion__Body__Content">
          <p className="Accordion__Detail">
            <span className="Accordion__Label">Theme ID: </span>
            <span className="Accordion__Value">{theme.id}</span>
          </p>
          <p className="Accordion__Detail">
            <span className="Accordion__Label">Role: </span>
            <span className="Accordion__Value">{theme.role}</span>
          </p>
          <p className="Accordion__Detail">
            <span className="Accordion__Label">Updated at: </span>
            <span className="Accordion__Value">
              <DisplayDate date={theme.created_at} />
            </span>
          </p>
          <p className="Accordion__Detail">
            <span className="Accordion__Label">Created at: </span>
            <span className="Accordion__Value">
              <DisplayDate date={theme.created_at} />
            </span>
          </p>
          <footer className="Accordion__Footer">
            <p className="Footer__Link">
              <a href={themeJsonUrl} target="_blank" rel="noreferrer">
                View JSON
              </a>
            </p>
            <p className="Footer__Link">
              <a href={themeCustomiseUrl} target="_blank" rel="noreferrer">
                Customise
              </a>
            </p>
            <p className="Footer__Link">
              <a href={themeCodeUrl} target="_blank" rel="noreferrer">
                Edit code
              </a>
            </p>
            <p className="Footer__Link">
              <a href={themeLanguageEditorUrl} target="_blank" rel="noreferrer">
                Edit languages
              </a>
            </p>
          </footer>
        </div>
      </Collapse>
    </div>
  );
};

export default React.memo(ThemeAccordion);
