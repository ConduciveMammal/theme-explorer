import React from 'react';
import Icon from '../Icon/Icon';

import { Alert, AlertDescription } from '../../components/ui/alert';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { cn } from '../../lib/utils';

const StorefrontComponent = ({ state }) => {
  const [notification, setNotification] = React.useState(null);
  const notificationTimeoutRef = React.useRef(null);
  const theme = state?.storefrontInformation?.theme || null;
  const themeId = theme?.id;
  const shopDomain = state?.storefrontInformation?.shop;
  const hasThemeData = Boolean(themeId);

  const getPreviewURL = () => {
    if (!shopDomain || !themeId) {
      return null;
    }

    const previewUrl = new URL(`https://${shopDomain}`);
    previewUrl.searchParams.set('preview_theme_id', themeId);

    return previewUrl.toString();
  };

  const getEditorURL = () => {
    if (!themeId || !state?.urls?.adminBase) {
      return null;
    }

    return `https://${state.urls.adminBase}/themes/${themeId}/editor`;
  };

  const launchSuccessToast = (message) => {
    if (notificationTimeoutRef.current) {
      window.clearTimeout(notificationTimeoutRef.current);
    }

    setNotification({ variant: 'success', message });
    notificationTimeoutRef.current = window.setTimeout(() => {
      setNotification(null);
      notificationTimeoutRef.current = null;
    }, 1000);
  };

  const launchErrorToast = (message) => {
    if (notificationTimeoutRef.current) {
      window.clearTimeout(notificationTimeoutRef.current);
    }

    setNotification({ variant: 'error', message });
    notificationTimeoutRef.current = window.setTimeout(() => {
      setNotification(null);
      notificationTimeoutRef.current = null;
    }, 1500);
  };

  const copyPreviewURL = () => {
    const previewUrl = getPreviewURL();

    if (!previewUrl) {
      launchErrorToast('Preview URL unavailable');
      return;
    }

    copyToClipboard(previewUrl, 'Preview URL copied');
  };

  const copyPreviewAndEditorURL = () => {
    const previewUrl = getPreviewURL();
    const editorUrl = getEditorURL();

    if (!previewUrl || !editorUrl) {
      launchErrorToast('Preview or Editor URL unavailable');
      return;
    }

    copyToClipboard(
      `Theme name: ${theme?.name || 'Unknown'}\n\nPreview: ${previewUrl}\nEditor: ${editorUrl}`,
      'Preview & Editor URL copied'
    );
  };

  const copyThemeId = () => {
    if (!themeId) {
      launchErrorToast('Theme ID unavailable');
      return;
    }

    copyToClipboard(themeId, 'Theme ID copied');
  };

  const copyToClipboard = async (text, toastText) => {
    if (!text) {
      launchErrorToast('Nothing to copy');
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      launchSuccessToast(toastText);
    } catch (err) {
      console.error('Failed to copy:', err);
      launchErrorToast('Failed to copy to clipboard');
    }
  };

  const previewUrlAvailable = Boolean(getPreviewURL());
  const editorUrlAvailable = Boolean(getEditorURL());

  React.useEffect(() => {
    return () => {
      if (notificationTimeoutRef.current) {
        window.clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="w-[450px] bg-background p-4 text-foreground">
      {notification && (
        <div
          className={cn(
            'mb-3 flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold',
            notification.variant === 'success'
              ? 'border-primary/40 bg-primary text-primary-foreground'
              : 'border-destructive/40 bg-destructive text-destructive-foreground'
          )}
          role="status"
          aria-live="polite"
        >
          <span className="text-xs">{notification.variant === 'success' ? 'OK' : 'ERR'}</span>
          {notification.message}
        </div>
      )}
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
              <Icon
                name="theme"
                color="hsl(var(--primary))"
                size={35}
                classes=""
              />
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Theme name
              </p>
              <CardTitle className="text-lg font-bold">
                {theme?.name || 'Theme data unavailable'}
              </CardTitle>
            </div>
          </div>
          <Alert>
            <AlertDescription className="text-sm">
              {hasThemeData
                ? 'Generate Preview or Preview & Editor URL to this theme.'
                : 'Shop detected, but this page does not expose a theme ID yet. Open a product or collection page and retry.'}
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              title="Copy theme ID"
              onClick={() => copyThemeId()}
              disabled={!hasThemeData}
            >
              Theme ID
            </Button>
            <Button
              type="button"
              title="Copy preview URL"
              onClick={() => copyPreviewURL()}
              disabled={!previewUrlAvailable}
            >
              Preview URL
            </Button>
            <Button
              type="button"
              title="Copy preview & editor URLs"
              onClick={() => copyPreviewAndEditorURL()}
              disabled={!previewUrlAvailable || !editorUrlAvailable}
            >
              Preview &amp; Editor URL
            </Button>
          </div>
        </CardContent>
        <CardFooter className="justify-end pt-0">
          <a
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            href="https://github.com/ConduciveMammal/theme-explorer/issues"
            target="_blank"
            rel="noreferrer"
          >
            Report an issue
          </a>
        </CardFooter>
      </Card>
    </div>
  );
};

export default StorefrontComponent;
