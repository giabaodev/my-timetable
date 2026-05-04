'use client';

import { GoogleIcon } from '@/assets/icons/google';
import { APP_CONFIG } from '@/configs';
import { Button } from '../../../components/ui/button';

export function GoogleButton() {
  const redirectToGoogle = () => {
    globalThis.location.href = APP_CONFIG.GOOGLE_LOGIN_URL;
  };

  return (
    <Button
      onClick={redirectToGoogle}
      className="w-full gap-3 h-10 border-border bg-white text-foreground shadow-sm hover:shadow-md hover:bg-gray-50"
    >
      <GoogleIcon />
      Continue with Google
    </Button>
  );
}
