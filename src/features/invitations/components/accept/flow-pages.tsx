import { AlertTriangle, CheckCircle, Home, Mail, XCircle } from "lucide-react";
import Link from "next/link";

// Invalid/Not Found Invitation
export function InvalidInvitationPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-red-100 p-3">
            <XCircle className="h-12 w-12 text-red-600" />
          </div>
        </div>

        <h1 className="mb-2 font-bold text-2xl text-gray-900">
          Invalid Invitation
        </h1>

        <p className="mb-6 text-gray-600">
          This invitation link is invalid or doesn't exist. Please check that
          you've copied the complete link from your email.
        </p>

        <div className="space-y-3">
          <div className="rounded-lg bg-gray-50 p-4 text-left">
            <h3 className="mb-2 font-medium text-gray-900 text-sm">
              Common issues:
            </h3>
            <ul className="space-y-1 text-gray-600 text-sm">
              <li>• The link may have been truncated when copied</li>
              <li>• The invitation may have been cancelled</li>
              <li>• The link may be outdated or incorrect</li>
            </ul>
          </div>

          <Link
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-white transition-colors hover:bg-gray-800"
            href="/"
          >
            <Home className="h-4 w-4" />
            Go to Homepage
          </Link>

          <p className="mt-4 text-gray-500 text-sm">
            Need help?{" "}
            <a
              className="font-medium text-blue-600 hover:text-blue-700"
              href="mailto:support@speedyghost.ai"
            >
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

// Already Used Invitation
export function InvitationAlreadyUsedPage({
  status,
}: {
  status: "accepted" | "cancelled" | "declined";
}) {
  const getStatusContent = () => {
    switch (status) {
      case "accepted":
        return {
          icon: <CheckCircle className="h-12 w-12 text-green-600" />,
          iconBg: "bg-green-100",
          title: "Invitation Already Accepted",
          description: "This invitation has already been used. You're all set!",
          action: {
            text: "Go to Organizations",
            href: "/o",
          },
        };
      case "cancelled":
        return {
          icon: <XCircle className="h-12 w-12 text-gray-600" />,
          iconBg: "bg-gray-100",
          title: "Invitation Cancelled",
          description:
            "This invitation has been cancelled by the organization administrator.",
          info: "If you believe this is a mistake, please contact the person who invited you to request a new invitation.",
        };
      case "declined":
        return {
          icon: <XCircle className="h-12 w-12 text-orange-600" />,
          iconBg: "bg-orange-100",
          title: "Invitation Declined",
          description: "This invitation was previously declined.",
          info: "If you've changed your mind, please contact the organization administrator for a new invitation.",
        };
      default:
        return {
          icon: <XCircle className="h-12 w-12 text-gray-600" />,
          iconBg: "bg-gray-100",
          title: "Unknown Status",
          description: "This invitation has an unknown status.",
        };
    }
  };

  const content = getStatusContent();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
        <div className="mb-4 flex justify-center">
          <div className={`rounded-full ${content.iconBg} p-3`}>
            {content.icon}
          </div>
        </div>

        <h1 className="mb-2 font-bold text-2xl text-gray-900">
          {content.title}
        </h1>

        <p className="mb-4 text-gray-600">{content.description}</p>

        {content.info && (
          <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="text-blue-900 text-sm">{content.info}</p>
          </div>
        )}

        <div className="space-y-3">
          {content.action && (
            <Link
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-white transition-colors hover:bg-gray-800"
              href={content.action.href}
            >
              {content.action.text}
            </Link>
          )}

          <Link
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
            href="/"
          >
            <Home className="h-4 w-4" />
            Go to Homepage
          </Link>

          <p className="mt-4 text-gray-500 text-sm">
            Need help?{" "}
            <a
              className="font-medium text-blue-600 hover:text-blue-700"
              href="mailto:support@speedyghost.ai"
            >
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

// Expired Invitation
export function InvitationExpiredPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-amber-100 p-3">
            <AlertTriangle className="h-12 w-12 text-amber-600" />
          </div>
        </div>

        <h1 className="mb-2 font-bold text-2xl text-gray-900">
          Invitation Expired
        </h1>

        <p className="mb-4 text-gray-600">
          This invitation link has expired. Team invitations are valid for 7
          days from when they're sent.
        </p>

        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
            <div className="text-left">
              <h3 className="mb-1 font-medium text-blue-900 text-sm">
                Request a new invitation
              </h3>
              <p className="text-blue-800 text-sm">
                Contact the person who invited you and ask them to resend the
                invitation. They can do this from their team management page.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-white transition-colors hover:bg-gray-800"
            href="/"
          >
            <Home className="h-4 w-4" />
            Go to Homepage
          </Link>

          <div className="border-gray-200 border-t pt-4">
            <p className="mb-3 text-gray-600 text-sm">
              Already have an account?
            </p>
            <Link
              className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
              href="/login"
            >
              Sign In
            </Link>
          </div>

          <p className="mt-4 text-gray-500 text-sm">
            Need help?{" "}
            <a
              className="font-medium text-blue-600 hover:text-blue-700"
              href="mailto:support@speedyghost.ai"
            >
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
