import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner } from "@/shared/components/ui/spinner";
import { ExistingUserLogin } from "./login-and-join-form";
import { NewUserSignup } from "./new-user-signup-and-join-form";

interface Invitation {
  email: string;
  id: string;
  organizations: {
    name: string;
  };
  token: string;
}

interface AuthRequiredAcceptanceProps {
  error: string | null;
  invitation: Invitation;
  onComplete: (invitationId: string, token: string) => Promise<void>;
}

export function AuthRequiredAcceptance({
  invitation,
  onComplete,
  error,
}: AuthRequiredAcceptanceProps) {
  const [mode, setMode] = useState<"check" | "login" | "signup">("check");
  const params = useParams<{ token: string }>();
  const token = params.token;

  useEffect(() => {
    // Check if user exists (without auth)
    async function checkUserExists() {
      try {
        const response = await fetch("/api/invitations/check-user-exists", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: invitation.email,
            invitationToken: token,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setMode(data.exists ? "login" : "signup");
        } else {
          throw new Error(data.error || "Failed to check user existence");
        }
      } catch (error) {
        console.error("Error checking user existence:", error);
        // Default to signup flow on error
        setMode("signup");
      }
    }

    checkUserExists();
  }, [invitation.email, token]);

  if (mode === "check") {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (mode === "login") {
    return (
      <ExistingUserLogin
        email={invitation.email}
        error={error}
        invitation={invitation}
        onSuccess={onComplete}
        setError={() => {
          /* error display handled by parent */
        }}
      />
    );
  }

  return (
    <NewUserSignup
      email={invitation.email}
      error={error}
      invitation={invitation}
      setError={() => {
        /* error display handled by parent */
      }}
    />
  );
}
