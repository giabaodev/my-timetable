'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PRIVATE_PATHS_NAME } from '@/constants/paths-name';
import { useAuth } from '@/app/auth/_hooks/useAuth';
import { registerUser } from '@/lib/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function RegisterPage() {
  const router = useRouter();
  const { setSession } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match — double check?");
      return;
    }

    setLoading(true);
    const result = registerUser(name.trim(), email, password);
    setLoading(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setSession(result.session);
    toast.success("Account created! Let's go 🚀");
    router.push(PRIVATE_PATHS_NAME.HOME);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="bg-card rounded-2xl border border-border shadow-sm p-8">
          {/* Logo */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Schedule
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Join the vibe 🌟
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-muted-foreground text-xs">
                Full Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="bg-background border-border text-foreground placeholder:text-muted-foreground/50"
                autoComplete="name"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-muted-foreground text-xs">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="bg-background border-border text-foreground placeholder:text-muted-foreground/50"
                autoComplete="email"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className="text-muted-foreground text-xs"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="bg-background border-border text-foreground placeholder:text-muted-foreground/50"
                autoComplete="new-password"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="confirm"
                className="text-muted-foreground text-xs"
              >
                Confirm Password
              </Label>
              <Input
                id="confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Type it again"
                className="bg-background border-border text-foreground placeholder:text-muted-foreground/50"
                autoComplete="new-password"
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white hover:bg-primary-hover rounded-xl"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-primary hover:underline font-medium"
            >
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
