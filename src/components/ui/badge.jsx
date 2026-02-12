import React from 'react';

import { cn } from '../../lib/utils';

const baseBadgeClasses =
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring';
const badgeVariants = {
  default: 'border-transparent bg-primary text-primary-foreground',
  secondary: 'border-transparent bg-secondary text-secondary-foreground',
  outline: 'border-border text-foreground',
};

function Badge({ className, variant, ...props }) {
  const resolvedVariant = variant || 'default';
  return <div className={cn(baseBadgeClasses, badgeVariants[resolvedVariant], className)} {...props} />;
}

export { Badge };
