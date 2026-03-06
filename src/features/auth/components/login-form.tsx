"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/shared/lib/supabase/client";
import { cn } from "@/shared/lib/utils";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        throw error;
      }
      router.push("/o");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col", className)} {...props}>
      <h1
        className="font-medium text-2xl tracking-tight"
        style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
      >
        Welcome back to DivorceAI
      </h1>
      <p className="mt-1.5 text-sm" style={{ color: "hsl(0 0% 45%)" }}>
        Sign in to your account
      </p>

      <form className="mt-8" onSubmit={handleLogin}>
        <div className="flex flex-col gap-5">
          <div className="grid gap-1.5">
            <label
              className="font-medium text-sm"
              htmlFor="email"
              style={{ color: "hsl(0 0% 25%)" }}
            >
              Email
            </label>
            <input
              className="h-10 w-full rounded-lg border px-3 text-sm outline-none transition-colors focus:ring-2"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={{
                borderColor: "hsl(0 0% 82%)",
                backgroundColor: "hsl(0 0% 100%)",
                color: "hsl(0 0% 12%)",
              }}
              type="email"
              value={email}
            />
          </div>
          <div className="grid gap-1.5">
            <div className="flex items-center justify-between">
              <label
                className="font-medium text-sm"
                htmlFor="password"
                style={{ color: "hsl(0 0% 25%)" }}
              >
                Password
              </label>
              <Link
                className="text-sm underline-offset-4 hover:underline"
                href="/auth/forgot-password"
                style={{ color: "hsl(0 0% 45%)" }}
              >
                Forgot password?
              </Link>
            </div>
            <input
              className="h-10 w-full rounded-lg border px-3 text-sm outline-none transition-colors focus:ring-2"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                borderColor: "hsl(0 0% 82%)",
                backgroundColor: "hsl(0 0% 100%)",
                color: "hsl(0 0% 12%)",
              }}
              type="password"
              value={password}
            />
          </div>
          {error && (
            <p className="text-sm" style={{ color: "hsl(0 65% 48%)" }}>
              {error}
            </p>
          )}
          <button
            className="mt-1 h-10 w-full rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
            disabled={isLoading}
            style={{
              backgroundColor: "hsl(0 0% 12%)",
              color: "hsl(0 0% 96.5%)",
            }}
            type="submit"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </div>
        <p
          className="mt-6 text-center text-sm"
          style={{ color: "hsl(0 0% 45%)" }}
        >
          Don&apos;t have an account?{" "}
          <Link
            className="font-medium underline underline-offset-4"
            href="/auth/signup"
            style={{ color: "hsl(0 0% 12%)" }}
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
