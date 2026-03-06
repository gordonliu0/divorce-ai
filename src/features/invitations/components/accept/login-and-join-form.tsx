import Link from "next/link";
import { type FormEvent, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Spinner } from "@/shared/components/ui/spinner";
import { createClient } from "@/shared/lib/supabase/client";

interface ExistingUserLoginProps {
  email: string;
  error: string | null;
  invitation: {
    id: string;
    token: string;
    organizations: {
      name: string;
    };
  };
  onSuccess: (invitationId: string, token: string) => Promise<void>;
  setError: (error: string | null) => void;
}

export function ExistingUserLogin({
  email,
  invitation,
  onSuccess,
  error,
  setError,
}: ExistingUserLoginProps) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Step 1: Sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      // Step 2: Accept invitation
      await onSuccess(invitation.id, invitation.token);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Welcome back!</CardTitle>
          <CardDescription>
            Sign in to join {invitation.organizations.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input disabled id="email" type="email" value={email} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  disabled={loading}
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  type="password"
                  value={password}
                />
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                  <p className="font-medium text-red-800 text-sm">{error}</p>
                </div>
              )}

              <Button className="w-full" disabled={loading} type="submit">
                {loading ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Signing in...
                  </>
                ) : (
                  "Sign in and join organization"
                )}
              </Button>

              <div className="text-center">
                <Link
                  className="text-sm underline-offset-4 hover:underline"
                  href="/forgot-password"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
