import React from 'react';

import { cn } from '../../lib/utils';

const baseAlertClasses =
  'relative w-full rounded-lg border border-border bg-card p-4 text-card-foreground';
const alertVariants = {
  default: 'bg-card text-card-foreground',
  destructive: 'border-destructive/50 text-destructive [&>svg]:text-destructive',
};

const Alert = React.forwardRef(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(baseAlertClasses, alertVariants[variant || 'default'], className)}
    {...props}
  />
));
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn('mb-1 font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
));
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };
