import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { createClient } from "@/shared/lib/supabase/client";

interface Invitation {
  email: string;
  id: string;
  organizations: {
    name: string;
  };
  token: string;
}

interface LoggedInAcceptanceProps {
  currentUser: {
    email: string | undefined;
  };
  error: string | null;
  invitation: Invitation;
  onAccept: (invitationId: string, token: string) => Promise<void>;
}

export function LoggedInAcceptance({
  invitation,
  currentUser,
  onAccept,
  error,
}: LoggedInAcceptanceProps) {
  const router = useRouter();
  const supabase = createClient();

  // Check: Does logged-in email match invitation email?
  const emailMatch =
    currentUser.email?.toLowerCase() === invitation.email.toLowerCase();

  if (!emailMatch) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Card className="mx-auto w-full max-w-md">
          <div className="space-y-4 p-6">
            <div className="flex justify-center">
              <AlertTriangle className="h-12 w-12" />
            </div>
            <h2 className="text-center font-semibold text-2xl">
              Email Mismatch
            </h2>
            <p className="text-center">
              This invitation was sent to <strong>{invitation.email}</strong>{" "}
              but you're logged in as <strong>{currentUser.email}</strong>
            </p>
            <div className="space-y-4">
              <Button
                className="w-full"
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.refresh();
                }}
              >
                Sign out and accept as {invitation.email}
              </Button>
              <Button
                className="w-full"
                onClick={() => router.push("/dashboard")}
                variant="outline"
              >
                Return to dashboard
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Email matches - show accept button
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Card className="mx-auto w-full max-w-md py-6">
        <div className="space-y-6 p-6">
          <div className="space-y-4 text-center">
            <h2 className="font-semibold text-3xl">Welcome!</h2>
            <p className="text-muted-foreground">
              You've been invited to join{" "}
              <span className="font-medium text-foreground">
                {invitation.organizations.name}
              </span>{" "}
              as{" "}
              <span className="font-medium text-foreground">
                {currentUser.email}
              </span>
              .
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg text-center">
              <p className="text-sm" />
            </div>

            <Button
              className="w-full"
              onClick={() => onAccept(invitation.id, invitation.token)}
              size="lg"
            >
              Accept & Join Organization
            </Button>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                <p className="font-medium text-red-800 text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
