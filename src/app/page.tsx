'use client';

import { PRIVATE_PATHS_NAME, PUBLIC_PATHS_NAME } from '@/constants/paths-name';
import { useAuthStore, useLoadingStore } from '@/stores';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { showLoading, hideLoading } = useLoadingStore();
  const setUser = useAuthStore((s) => s.setUser);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    showLoading();
    const userParam = searchParams.get('user');
    if (userParam) {
      console.log('User data found in query params, logging in user');
      const user = JSON.parse(decodeURIComponent(userParam));
      setUser(user);
      router.replace(PRIVATE_PATHS_NAME.CALENDAR);
    } else {
      console.log('No user data found in query params, redirecting to login');
      router.replace(PUBLIC_PATHS_NAME.LOGIN);
    }
    hideLoading();
  }, [hideLoading, router, searchParams, setUser, showLoading]);
}
