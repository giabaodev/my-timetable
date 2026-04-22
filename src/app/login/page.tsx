"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { loginUser, googleLogin } from "@/lib/auth";
import { useAuth } from "@/hooks/useAuth";
import { GoogleButton } from "@/components/auth/GoogleButton";

export default function LoginPage() {
  const router = useRouter();
  const { setSession } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    const result = loginUser(email, password);
    setLoading(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setSession(result.session);
    router.push("/");
  };

  const handleGoogle = (profile: {
    name: string;
    email: string;
    picture?: string;
  }) => {
    const result = googleLogin(profile);
    if (result.ok) {
      setSession(result.session);
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2] px-4">
      <div className="w-full max-w-sm">
        <div className="bg-[#F5F0E8] rounded-2xl border border-[#E0D8CC] shadow-sm p-8">
          {/* Logo */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-[#2C2416] tracking-tight">
              Schedulr
            </h1>
            <p className="text-sm text-[#7A6E5F] mt-1">Welcome back ✌️</p>
          </div>

          {/* Google */}
          <GoogleButton onSuccess={handleGoogle} />

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E0D8CC]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#F5F0E8] px-3 text-[#7A6E5F]">or</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[#7A6E5F] text-xs">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="bg-[#FAF7F2] border-[#E0D8CC] text-[#2C2416] placeholder:text-[#7A6E5F]/50"
                autoComplete="email"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-[#7A6E5F] text-xs">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-[#FAF7F2] border-[#E0D8CC] text-[#2C2416] placeholder:text-[#7A6E5F]/50"
                autoComplete="current-password"
              />
            </div>

            {error && <p className="text-sm text-[#D97B6C]">{error}</p>}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C9A96E] text-white hover:bg-[#B89A5F] rounded-xl"
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="text-center text-sm text-[#7A6E5F] mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-[#C9A96E] hover:underline font-medium"
            >
              Sign up →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
