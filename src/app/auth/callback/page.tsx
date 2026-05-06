'use client';

import { SuspenseWrapper } from '@/components/wrapper/suspense-wrapper';
import { PUBLIC_PATHS_NAME } from '@/constants/paths-name';
import { useAuthStore, useLoadingStore } from '@/stores';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore((s) => s.setUser);
  const { showLoading, hideLoading } = useLoadingStore();

  useEffect(() => {
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');

    if (!token || !userParam) {
      router.replace(PUBLIC_PATHS_NAME.LOGIN);
      return;
    }

    const handleCallback = async () => {
      showLoading('Logging in...');
      try {
        await fetch('/api/set-cookie', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const user = JSON.parse(decodeURIComponent(userParam));
        setUser(user);
        router.replace('/');
      } catch {
        router.replace(PUBLIC_PATHS_NAME.LOGIN);
      } finally {
        hideLoading();
      }
    };

    handleCallback();
  }, [hideLoading, router, searchParams, setUser, showLoading]);

  return null;
}

export default function AuthCallback() {
  return (
    <SuspenseWrapper>
      <AuthCallbackContent />
    </SuspenseWrapper>
  );
}
