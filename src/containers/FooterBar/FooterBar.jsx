import React, {useState, useRef, useEffect} from 'react';
import Icons from '../../assets/img/icons/icons.svg';
import Icon from '../Icon/Icon';
import parse from 'html-react-parser';

import "./FooterBar.scss";

const menuLinks = [
  {
    label: "Github",
    link: "https://github.com/ConduciveMammal/theme-explorer",
    icon: 'github'
  },
  {
    label: "Rate Theme Explorer",
    link: "https://chrome.google.com/webstore/detail/theme-explorer-for-shopif/jiapemkfhgejoifinncjnbdkpafhkcnj",
    icon: 'happy'
  },
  {
    label: "Support",
    link: "https://github.com/ConduciveMammal/theme-explorer/issues",
    icon: "question"
  },
  {
    label: "Changelog",
    link: 'https://theme-explorer.merlyndesignworks.co.uk',
    icon: "changelog"
  }
]

const FooterBar = () => {
  const ref = useRef();

  const [contextMenuOpen, toggleContextMenu] = useState(false);
  const onToggle = () => toggleContextMenu((contextMenuOpen) => !contextMenuOpen);

  useEffect(() => {
    const checkIfClickedOutside = e => {
      // If the menu is open and the clicked target is not within the menu,
      // then close the menu
      if (contextMenuOpen && ref.current && !ref.current.contains(e.target)) {
        toggleContextMenu(false)
      }
    }
    document.addEventListener("mousedown", checkIfClickedOutside)
    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", checkIfClickedOutside)
    }
  }, [contextMenuOpen])

  return (
    <footer className="footer">
      <div className="footer__name">
        <p>Theme Explorer</p>
      </div>

      <div className="footer__info-wrapper"
        ref={ref}>
        <div className={`footer__menu-wrapper${contextMenuOpen ? ' footer__menu-wrapper--open' : '' }`}>
          <nav className="footer__menu">
            <ul>
              {
                menuLinks.map((link, index) => {
                  return parse(`
                    <li key="${index}">
                      <a href="${link.link}" target="_blank" rel="noopener">
                        <svg
                          className="icon icon-${link.icon}"
                          fill="currentColor"
                          width="20"
                          height="20"
                        >
                          <use xlinkHref="${Icons}#icon-${link.icon}" />
                        </svg>
                        <span>${link.label}</span>
                      </a>
                    </li>
                  `)
                })
              }
            </ul>
          </nav>
        </div>
       <button className="footer__menu-toggle" onClick={onToggle}>
         <Icon
            name="info"
            color="#4d52bf"
            size={25}
            classes={`footer__menu-icon${contextMenuOpen ? ' footer__menu-icon--active' : '' }`}
          />
       </button>
      </div>
    </footer>
  )
}

export default FooterBar;
