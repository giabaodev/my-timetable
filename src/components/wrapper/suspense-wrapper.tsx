import { Suspense } from 'react';
import { LoadingOverlay } from '../ui/loading-overlay';

export function SuspenseWrapper({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <Suspense fallback={<LoadingOverlay />}>{children}</Suspense>;
}
