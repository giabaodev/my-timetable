'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore, useLoadingStore } from '@/stores';
import { PRIVATE_PATHS_NAME, PUBLIC_PATHS_NAME } from '@/constants/paths-name';
import { SuspenseWrapper } from '@/components/wrapper/suspense-wrapper';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore((s) => s.setUser);
  const { showLoading, hideLoading } = useLoadingStore();

  useEffect(() => {
    showLoading();
    const userParam = searchParams.get('user');
    if (userParam) {
      const user = JSON.parse(decodeURIComponent(userParam));
      setUser(user);
      router.replace(PRIVATE_PATHS_NAME.CALENDAR);
    } else {
      hideLoading();
      router.replace(PUBLIC_PATHS_NAME.LOGIN);
    }
  }, [hideLoading, router, searchParams, setUser, showLoading]);

  return null;
}

export default function AuthCallbackPage() {
  return (
    <SuspenseWrapper>
      <AuthCallbackContent />
    </SuspenseWrapper>
  );
}
