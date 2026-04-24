"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

interface GoogleProfile {
  name: string;
  email: string;
  picture?: string;
}

const MOCK_ACCOUNTS: GoogleProfile[] = [
  {
    name: "Alex Chen",
    email: "alex.chen@gmail.com",
    picture: "",
  },
  {
    name: "Jamie Rivera",
    email: "jamie.r@gmail.com",
    picture: "",
  },
];

interface GoogleButtonProps {
  onSuccess: (profile: GoogleProfile) => void;
}

export function GoogleButton({ onSuccess }: Readonly<GoogleButtonProps>) {
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setPickerOpen(true)}
        className="w-full gap-3 h-10  border-border bg-white text-foreground shadow-sm hover:shadow-md hover:bg-gray-50"
      >
        <svg className="size-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </Button>

      {/* Mock account picker */}
      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
        <DialogContent className="sm:max-w-xs bg-white border-border">
          <DialogHeader>
            <DialogTitle className="text-center text-foreground">
              Choose an account
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-1 py-2">
            {MOCK_ACCOUNTS.map((account) => (
              <button
                key={account.email}
                type="button"
                onClick={() => {
                  setPickerOpen(false);
                  onSuccess(account);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-card transition-colors text-left"
              >
                <div className="size-9 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm shrink-0">
                  {account.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">
                    {account.name}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {account.email}
                  </div>
                </div>
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setPickerOpen(false);
                onSuccess({
                  name: "New User",
                  email: `user${Date.now()}@gmail.com`,
                });
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-card transition-colors text-left text-sm text-muted-foreground"
            >
              <div className="size-9 rounded-full border-2 border-dashed border-border flex items-center justify-center text-muted-foreground shrink-0">
                +
              </div>
              Use another account
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
