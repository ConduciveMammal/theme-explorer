import React from 'react';
import DisplayDate from '../Date/FormatDate';
import ThemeAccordion from '../ThemeAccordion/ThemeAccordion';
import FooterBar from '../FooterBar/FooterBar';
import Icon from '../Icon/Icon';

import { useState } from 'react';
import Fuse from 'fuse.js';

import { Accordion } from '../../components/ui/accordion';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

const AdminComponent = ({ state }) => {
  const { themes, liveTheme, themesReady, storeUrl, shop } = state;

  const initialThemeData = themes || [];
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
      { name: 'id', weight: 3 },
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

    if ((themes?.length || 0) >= currentPlanLimit) {
      return 'No free space for themes is available';
    }
    return `${themes?.length || 0} of ${getPlanThemeLimit()} themes installed`;
  }

  const themeMessage = themeCountNotice();
  const visibleThemes = themesReady && !filteredThemes ? themes : filteredThemes;

  return (
    <div className="w-[450px] bg-background text-foreground">
      <div className="sticky top-0 z-10 border-b border-border bg-primary px-4 py-3 text-center text-sm font-bold text-primary-foreground">
        {themeMessage}
      </div>
      <div className="space-y-3 p-4">
        <Card>
          <CardHeader className="space-y-2 pb-3">
            <CardTitle className="text-2xl">{liveTheme?.name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Created at{' '}
              <strong>
                <DisplayDate date={liveTheme?.created_at} />
              </strong>{' '}
              and updated on{' '}
              <strong>
                <DisplayDate date={liveTheme?.updated_at} />
              </strong>
            </p>
            <Badge variant="secondary" className="w-fit">
              Theme ID: {liveTheme?.id}
            </Badge>
          </CardHeader>
          <CardContent className="pt-0">
            <Input
              type="text"
              aria-label="Search by theme ID, name or role."
              placeholder={`Search by theme ID, name, or role\u2026`}
              onChange={(evt) => {
                const value = evt.target.value;
                if (value.length > 2 || value.length === 0) {
                  filterThemesBasedOnInput(evt);
                }
              }}
            />
          </CardContent>
        </Card>
        <div className="space-y-2">
          <Accordion type="multiple" className="space-y-2">
            {(visibleThemes || []).map((theme, index) => (
              <ThemeAccordion
                key={theme.id}
                theme={theme}
                storeUrl={storeUrl}
                shop={shop}
                index={index}
                data-filtered-item={Boolean(filteredThemes)}
              />
            ))}
          </Accordion>
          {filteredThemes && filteredThemes.length === 0 && (
            <Card>
              <CardContent className="flex items-center gap-2 p-4 text-sm font-semibold text-muted-foreground">
                <Icon name="error" color="hsl(var(--primary))" size={16} classes="" />
                No themes found
              </CardContent>
            </Card>
          )}
          <Card>
            <CardContent className="flex items-center justify-between gap-3 p-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Icon name="json" color="hsl(var(--primary))" size={16} classes="" />
                View JSON
              </div>
              <Button asChild size="sm" variant="secondary">
                <a href={`${storeUrl}/themes.json`} target="_blank" rel="noreferrer">
                  Open
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
        <div className="pt-1">
          <FooterBar />
        </div>
      </div>
    </div>
  );
};

export default AdminComponent;
