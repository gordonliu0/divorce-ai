"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/shared/lib/supabase/client";
import { cn } from "@/shared/lib/utils";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) {
        throw error;
      }
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className={cn("flex flex-col", className)} {...props}>
        <h1
          className="font-medium text-2xl tracking-tight"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          Check your email
        </h1>
        <p
          className="mt-3 text-sm leading-relaxed"
          style={{ color: "hsl(0 0% 45%)" }}
        >
          If you registered using your email and password, you will receive a
          password reset email.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col", className)} {...props}>
      <h1
        className="font-medium text-2xl tracking-tight"
        style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
      >
        Reset your password
      </h1>
      <p className="mt-1.5 text-sm" style={{ color: "hsl(0 0% 45%)" }}>
        Enter your email and we&apos;ll send you a reset link
      </p>

      <form className="mt-8" onSubmit={handleForgotPassword}>
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
            {isLoading ? "Sending..." : "Send reset email"}
          </button>
        </div>
        <p
          className="mt-6 text-center text-sm"
          style={{ color: "hsl(0 0% 45%)" }}
        >
          Remember your password?{" "}
          <Link
            className="font-medium underline underline-offset-4"
            href="/auth/login"
            style={{ color: "hsl(0 0% 12%)" }}
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
