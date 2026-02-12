import React from 'react';

import { Card, CardContent } from '../../components/ui/card';
import { Skeleton } from '../../components/ui/skeleton';

const LoadingComponent = () => {
  return (
    <div className="w-[450px] bg-background p-4 text-foreground">
      <div className="min-h-[240px]">
        <Card>
          <CardContent className="flex min-h-[220px] flex-col items-center justify-center gap-4 p-6">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <Skeleton className="h-4 w-24" />
            <p className="text-sm font-semibold text-muted-foreground">Loading&hellip;</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoadingComponent;
