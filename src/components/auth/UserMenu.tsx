"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, User, ChevronDown } from "lucide-react";

export function UserMenu() {
  const { session, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  if (!session) return null;

  const initials = session.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = () => {
    setOpen(false);
    toast.success("See you later 👋");
    logout();
    router.push("/login");
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-[#E8DDD0] transition-colors"
        aria-label="User menu"
      >
        {session.avatar ? (
          <img
            src={session.avatar}
            alt={session.name}
            className="size-7 rounded-full object-cover"
          />
        ) : (
          <div className="size-7 rounded-full bg-[#C9A96E] text-white flex items-center justify-center text-xs font-semibold">
            {initials}
          </div>
        )}
        <span className="text-sm font-medium text-[#2C2416] hidden sm:inline max-w-24 truncate">
          {session.name}
        </span>
        <ChevronDown className="size-3 text-[#7A6E5F]" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-56 rounded-xl border border-[#E0D8CC] bg-[#F5F0E8] shadow-lg z-50 overflow-hidden">
          <div className="px-3 py-3 border-b border-[#E0D8CC]">
            <div className="flex items-center gap-2">
              <User className="size-4 text-[#7A6E5F]" />
              <span className="text-xs font-medium text-[#7A6E5F]">
                My Account
              </span>
            </div>
            <p className="text-sm font-medium text-[#2C2416] mt-1.5">
              {session.name}
            </p>
            <p className="text-xs text-[#7A6E5F]">{session.email}</p>
          </div>

          <div className="p-1">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#D97B6C] hover:bg-[#D97B6C]/10 transition-colors text-left"
            >
              <LogOut className="size-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
