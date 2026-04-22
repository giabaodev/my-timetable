"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const PUBLIC_PATHS = new Set(["/login", "/register"]);

export function AuthGuard({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { session, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isPublic = PUBLIC_PATHS.has(pathname);

  useEffect(() => {
    if (isLoading) return;

    if (!session && !isPublic) {
      router.replace("/login");
    }

    if (session && isPublic) {
      router.replace("/");
    }
  }, [session, isLoading, isPublic, router]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        <div className="text-center space-y-3">
          <h1 className="text-xl font-bold text-[#2C2416]">Schedulr</h1>
          <div className="animate-pulse flex flex-col items-center gap-2">
            <div className="h-3 w-24 bg-[#E8DDD0] rounded" />
            <div className="h-3 w-16 bg-[#E8DDD0] rounded" />
          </div>
        </div>
      </div>
    );
  }

  // Unauthenticated on protected page — don't render children (will redirect)
  if (!session && !isPublic) {
    return null;
  }

  // Authenticated on public page — don't render (will redirect)
  if (session && isPublic) {
    return null;
  }

  return <>{children}</>;
}
