import React from 'react';

import Icon from '../Icon/Icon';
import DisplayDate from '../Date/FormatDate';
import { AccordionContent, AccordionItem, AccordionTrigger } from '../../components/ui/accordion';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';

const ThemeAccordion = ({ theme, shop, index, storeUrl, ...additionalAttrs }) => {
  const shopDomain = shop?.domain;
  const themePreviewUrl = shopDomain
    ? `https://${shopDomain}?preview_theme_id=${theme.id}`
    : null;
  const themeJsonUrl = `${storeUrl}/themes/${theme.id}.json`;
  const themeCodeUrl = `${storeUrl}/themes/${theme.id}`;
  const themeCustomiseUrl = `${storeUrl}/themes/${theme.id}/editor`;
  const themeLanguageEditorUrl = `${storeUrl}/themes/${theme.id}/language`;
  const processing = theme.processing;

  return (
    <AccordionItem
      value={`theme-${theme.id}-${index}`}
      className={`rounded-md border border-border bg-card ${
        theme.role === 'main' ? 'border-l-4 border-l-primary' : ''
      } ${processing ? 'opacity-80' : ''}`}
      {...additionalAttrs}
    >
      <AccordionTrigger
        className="px-3 py-3 hover:no-underline"
        disabled={processing}
      >
        <div className="flex w-full items-center gap-3 pr-2 text-left">
          <Icon name="theme" color="hsl(var(--primary))" size={26} classes="" />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="truncate text-sm font-semibold text-foreground">
              {theme.name}
            </span>
            <div className="flex items-center gap-2">
              <Badge variant={theme.role === 'main' ? 'default' : 'secondary'}>
                {theme.role}
              </Badge>
              {processing && (
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Icon name="spinner" color="currentColor" size={12} classes="animate-spin" />
                  Processing
                </span>
              )}
            </div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-3">
        <div className="space-y-1.5 pb-3 text-xs">
          <p>
            <span className="font-semibold text-foreground">Theme ID: </span>
            <span className="text-muted-foreground">{theme.id}</span>
          </p>
          <p>
            <span className="font-semibold text-foreground">Role: </span>
            <span className="text-muted-foreground">{theme.role}</span>
          </p>
          <p>
            <span className="font-semibold text-foreground">Updated at: </span>
            <span className="text-muted-foreground">
              <DisplayDate date={theme.updated_at} />
            </span>
          </p>
          <p>
            <span className="font-semibold text-foreground">Created at: </span>
            <span className="text-muted-foreground">
              <DisplayDate date={theme.created_at} />
            </span>
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {themePreviewUrl && (
              <Button asChild size="sm" variant="secondary">
                <a
                  href={theme.role === 'main' ? `https://${shopDomain}` : themePreviewUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {theme.role === 'main' ? 'View' : 'Preview'}
                </a>
              </Button>
            )}
            <Button asChild size="sm" variant="secondary">
              <a href={themeJsonUrl} target="_blank" rel="noreferrer">
                View JSON
              </a>
            </Button>
            <Button asChild size="sm" variant="secondary">
              <a href={themeCustomiseUrl} target="_blank" rel="noreferrer">
                Customise
              </a>
            </Button>
            <Button asChild size="sm" variant="secondary">
              <a href={themeCodeUrl} target="_blank" rel="noreferrer">
                Edit code
              </a>
            </Button>
            <Button asChild size="sm" variant="secondary">
              <a href={themeLanguageEditorUrl} target="_blank" rel="noreferrer">
                Edit languages
              </a>
            </Button>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default React.memo(ThemeAccordion);
