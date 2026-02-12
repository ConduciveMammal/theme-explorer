import React from 'react';
import Icon from '../Icon/Icon';

import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';

const menuLinks = [
  {
    label: 'Github',
    link: 'https://github.com/ConduciveMammal/theme-explorer',
    icon: 'github',
  },
  {
    label: 'Rate Theme Explorer',
    link: 'https://chrome.google.com/webstore/detail/theme-explorer-for-shopif/jiapemkfhgejoifinncjnbdkpafhkcnj',
    icon: 'happy',
  },
  {
    label: 'Support',
    link: 'https://github.com/ConduciveMammal/theme-explorer/issues',
    icon: 'question',
  },
  {
    label: 'Changelog',
    link: 'https://theme-explorer.merlyndesignworks.co.uk/releases',
    icon: 'changelog',
  },
];

const FooterBar = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef(null);

  React.useEffect(() => {
    const onClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', onClickOutside);

    return () => {
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, []);

  return (
    <footer className="flex items-center justify-between px-1 py-2">
      <p className="text-sm italic text-muted-foreground">Theme Explorer</p>
      <div className="relative" ref={menuRef}>
        {menuOpen && (
          <Card className="absolute bottom-10 right-0 z-20 w-56 border-border shadow-md">
            <CardContent className="p-1">
              <ul className="space-y-1">
                {menuLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                    >
                      <Icon name={link.icon} color="currentColor" size={18} classes="" />
                      <span>{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-primary"
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          onClick={() => setMenuOpen((current) => !current)}
        >
          <Icon name="info" color="currentColor" size={20} classes="" />
        </Button>
      </div>
    </footer>
  );
};

export default React.memo(FooterBar);
