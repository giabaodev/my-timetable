'use client';

import { PRIVATE_PATHS_NAME } from '@/constants/paths-name';
import { getUserInfo } from '@/services/get-user-info';
import { useAuthStore, useLoadingStore } from '@/stores';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function AuthProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const { user, setUser, clearUser } = useAuthStore();
  const { showLoading, hideLoading } = useLoadingStore();

  const isPrivatePath = Object.values(PRIVATE_PATHS_NAME).includes(pathname);

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
    if (isPrivatePath && !user) {
      fetchUserInfo();
    }
  }, [clearUser, hideLoading, isPrivatePath, setUser, showLoading, user]);

  return <>{children}</>;
}
