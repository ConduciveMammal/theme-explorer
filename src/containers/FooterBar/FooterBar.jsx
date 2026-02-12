import React from 'react';
import Icon from '../Icon/Icon';
import { Info } from 'lucide-react';

import { Button } from '../../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';

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
  return (
    <footer className="flex items-center justify-between px-1 py-2">
      <p className="text-sm italic text-muted-foreground">Theme Explorer</p>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-primary">
            <Info className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {menuLinks.map((link) => (
            <DropdownMenuItem key={link.label} asChild>
              <a
                href={link.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Icon name={link.icon} color="currentColor" size={18} classes="" />
                <span>{link.label}</span>
              </a>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </footer>
  );
};

export default React.memo(FooterBar);
