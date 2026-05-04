'use client';

import { cn } from '@/lib/utils';
import { Spinner } from './spinner';
import { useLoadingStore } from '@/stores';

export const LoadingOverlay = () => {
  const { isLoading, message } = useLoadingStore();
  return (
    <div
      className={cn(
        'fixed inset-0 z-9999 flex flex-col items-center justify-center',
        'bg-background/80 backdrop-blur-sm transition-all duration-300',
        isLoading
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
      )}
    >
      <Spinner className="size-8" />
      {message && (
        <p className="text-sm text-muted-foreground animate-pulse">{message}</p>
      )}
    </div>
  );
};
