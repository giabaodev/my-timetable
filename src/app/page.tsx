'use client';

import { LoadingOverlay } from '@/components/ui/loading-overlay';
import { PRIVATE_PATHS_NAME, PUBLIC_PATHS_NAME } from '@/constants/paths-name';
import { useAuthStore, useLoadingStore } from '@/stores';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

function HomeContent() {
  const { showLoading, hideLoading } = useLoadingStore();
  const setUser = useAuthStore((s) => s.setUser);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    showLoading();
    const userParam = searchParams.get('user');
    if (userParam) {
      const user = JSON.parse(decodeURIComponent(userParam));
      setUser(user);
      router.replace(PRIVATE_PATHS_NAME.CALENDAR);
    } else {
      router.replace(PUBLIC_PATHS_NAME.LOGIN);
    }
    hideLoading();
  }, [hideLoading, router, searchParams, setUser, showLoading]);

  return null;
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingOverlay />}>
      <HomeContent />
    </Suspense>
  );
}
