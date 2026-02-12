import React from 'react';
import Icon from '../Icon/Icon';
import { toast } from 'sonner';

import { Alert, AlertDescription } from '../../components/ui/alert';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Toaster } from '../../components/ui/sonner';

const StorefrontComponent = ({ state }) => {
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
    toast.success(message, { duration: 1000 });
  };

  const launchErrorToast = (message) => {
    toast.error(message, { duration: 1500 });
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

  return (
    <div className="w-[450px] bg-background p-4 text-foreground">
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
      <Toaster />
    </div>
  );
};

export default StorefrontComponent;
