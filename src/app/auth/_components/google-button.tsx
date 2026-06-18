'use client';

import { GoogleIcon } from '@/assets/icons/google';
import { Button } from '../../../components/ui/button';
import { APP_CONFIG } from '@/configs';

export function GoogleButton() {
  const redirectToGoogle = () => {
    return (window.location.href = APP_CONFIG.GOOGLE_LOGIN_URL);
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
