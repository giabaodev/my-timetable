'use client';

import { getUserInfo } from '@/services/get-user-info';
import { useAuthStore, useLoadingStore } from '@/stores';
import { useEffect } from 'react';

export function AuthProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { setUser, clearUser } = useAuthStore();
  const { showLoading, hideLoading } = useLoadingStore();

  useEffect(() => {
    const fetchUserInfo = async () => {
      showLoading();
      try {
        const data = await getUserInfo();
        setUser(data);
      } catch {
        clearUser();
      } finally {
        hideLoading();
      }
    };

    fetchUserInfo();
  }, [clearUser, hideLoading, setUser, showLoading]);

  return <>{children}</>;
}
