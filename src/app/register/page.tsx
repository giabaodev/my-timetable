"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { registerUser } from "@/lib/auth";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterPage() {
  const router = useRouter();
  const { setSession } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
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
    router.push("/");
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
            <p className="text-sm text-[#7A6E5F] mt-1">Join the vibe 🌟</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-[#7A6E5F] text-xs">
                Full Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="bg-[#FAF7F2] border-[#E0D8CC] text-[#2C2416] placeholder:text-[#7A6E5F]/50"
                autoComplete="name"
              />
            </div>

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
                placeholder="Min. 6 characters"
                className="bg-[#FAF7F2] border-[#E0D8CC] text-[#2C2416] placeholder:text-[#7A6E5F]/50"
                autoComplete="new-password"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirm" className="text-[#7A6E5F] text-xs">
                Confirm Password
              </Label>
              <Input
                id="confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Type it again"
                className="bg-[#FAF7F2] border-[#E0D8CC] text-[#2C2416] placeholder:text-[#7A6E5F]/50"
                autoComplete="new-password"
              />
            </div>

            {error && <p className="text-sm text-[#D97B6C]">{error}</p>}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C9A96E] text-white hover:bg-[#B89A5F] rounded-xl"
            >
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <p className="text-center text-sm text-[#7A6E5F] mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#C9A96E] hover:underline font-medium"
            >
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
