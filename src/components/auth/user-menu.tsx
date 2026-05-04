'use client';

import { PUBLIC_PATHS_NAME } from '@/constants/paths-name';
import { userLogout } from '@/services/user-logout';
import { useAuthStore } from '@/stores';
import { ChevronDown, LogOut, User } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';

export function UserMenu() {
  const { user, clearUser } = useAuthStore();

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  if (!user) return null;

  const initials = user.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = async () => {
    setOpen(false);
    try {
      const data = await userLogout();
      if (data.success) {
        clearUser();
        toast.success('See you later 👋');
        router.push(PUBLIC_PATHS_NAME.LOGIN);
      }
    } catch {
      toast.error('Error logging out. Please try again.');
    }
  };

  return (
    <div ref={menuRef} className="flex relative">
      <Button
        variant="ghost"
        size="lg"
        onClick={() => setOpen(!open)}
        className="hover:bg-accent transition-colors"
        aria-label="User menu"
      >
        {user.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt={user.fullName}
            className="rounded-full"
            width={28}
            height={28}
            style={{
              objectFit: 'cover',
            }}
          />
        ) : (
          <div className="size-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold">
            {initials}
          </div>
        )}
        <span className="text-sm font-medium text-foreground hidden sm:inline max-w-28 truncate">
          {user.fullName}
        </span>
        <ChevronDown className="size-3 text-muted-foreground" />
      </Button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-56 rounded-xl border border-border bg-card shadow-lg z-50 overflow-hidden">
          <div className="px-3 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <User className="size-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">
                My Account
              </span>
            </div>
            <p className="text-sm font-medium text-foreground mt-1.5">
              {user.fullName}
            </p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>

          <div className="p-1">
            <Button
              variant="ghost"
              size="lg"
              onClick={handleLogout}
              className="justify-start w-full gap-2 text-destructive hover:text-destructive/80 hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="size-4" />
              Sign out
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
