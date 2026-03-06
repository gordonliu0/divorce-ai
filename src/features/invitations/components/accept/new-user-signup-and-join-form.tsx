import { type FormEvent, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { createClient } from "@/shared/lib/supabase/client";

const LETTER_REGEX = /[A-Za-z]/;
const DIGIT_REGEX = /[0-9]/;

import { useRouter } from "next/navigation";
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

export function NewUserSignup({
  email,
  invitation,
  error,
  setError,
}: {
  email: string;
  invitation: {
    id: string;
    token: string;
    organizations: {
      name: string;
    };
  };
  error: string | null;
  setError: (error: string | null) => void;
}) {
  const [formData, setFormData] = useState({
    fullName: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSignup(e: FormEvent) {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!formData.fullName.trim()) {
      setError("Full name is required");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (
      !(
        LETTER_REGEX.test(formData.password) &&
        DIGIT_REGEX.test(formData.password)
      )
    ) {
      setError("Password must contain both letters and numbers");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);

    try {
      // Call the signup-and-accept endpoint
      const response = await fetch("/api/invitations/signup-and-accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password: formData.password,
          fullName: formData.fullName,
          invitationId: invitation.id,
          invitationToken: invitation.token,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create account");
      }

      // Success! Handle session if provided
      if (data.session) {
        // Set session in Supabase client
        console.log(data.session);
        await supabase.auth.setSession({
          access_token: data.session.properties.access_token,
          refresh_token: data.session.properties.refresh_token,
        });
        router.push(`/org/${data.organizationId}/`);
      }

      if (data.requiresSignIn) {
        // User created but needs to sign in manually
        console.log("REQUIRE SIGN IN");
        router.push(
          `/login?email=${encodeURIComponent(email)}&message=${encodeURIComponent(data.message)}`
        );
      } else {
        // Redirect to organization dashboard
        router.push(`/org/${data.organizationId}/`);
      }
    } catch (error: unknown) {
      console.error("Signup error:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <CardDescription>
            You've been invited to join{" "}
            <span className="font-semibold">
              {invitation.organizations.name}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSignup}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input disabled id="email" type="email" value={email} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  disabled={loading}
                  id="fullName"
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  placeholder="John Doe"
                  required
                  type="text"
                  value={formData.fullName}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  disabled={loading}
                  id="password"
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="At least 8 characters"
                  required
                  type="password"
                  value={formData.password}
                />
                <p className="text-gray-500 text-xs">
                  Must contain letters and numbers
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  disabled={loading}
                  id="confirmPassword"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="Re-enter your password"
                  required
                  type="password"
                  value={formData.confirmPassword}
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
                    Creating account...
                  </>
                ) : (
                  "Create account and join"
                )}
              </Button>

              <p className="mt-4 text-center text-gray-500 text-xs">
                By creating an account, you agree to our Terms of Service and
                Privacy Policy
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
