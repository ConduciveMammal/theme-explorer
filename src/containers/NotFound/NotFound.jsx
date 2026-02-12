import React from 'react';
import Icon from '../Icon/Icon';

import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';

const NotFound = ({
  title = 'Shopify store not found',
  message = 'Open a Shopify admin or storefront tab, then try again.',
  onRetry,
  retryLabel = 'Retry',
}) => {
  return (
    <div className="w-[450px] bg-background p-4 text-foreground">
      <Card>
        <CardHeader className="pb-2" />
        <CardContent className="space-y-4">
          <Alert className="border-border">
            <div className="flex items-start gap-3">
              <span className="mt-0.5">
                <Icon name="error" color="hsl(var(--primary))" size={16} classes="" />
              </span>
              <div className="space-y-2">
                <AlertTitle className="text-lg">{title}</AlertTitle>
                <AlertDescription className="text-sm">{message}</AlertDescription>
              </div>
            </div>
          </Alert>
          {onRetry && (
            <Button type="button" onClick={onRetry}>
              {retryLabel}
            </Button>
          )}
        </CardContent>
        <Separator />
        <CardFooter className="justify-end py-4">
          <a
            href="https://github.com/ConduciveMammal/theme-explorer/issues"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Report an issue
          </a>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NotFound;
