export const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatExpiry = (expiresAt: string) => {
  const date = new Date(expiresAt);
  const now = new Date();
  const diffInHours = Math.floor(
    (date.getTime() - now.getTime()) / (1000 * 60 * 60)
  );

  if (diffInHours < 0) {
    return "Expired";
  }
  if (diffInHours < 24) {
    return `${diffInHours}h left`;
  }
  const days = Math.floor(diffInHours / 24);
  return `${days}d left`;
};

export const formatRole = (role: string) => {
  return role.charAt(0).toUpperCase() + role.slice(1);
};

const VALIDATE_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateEmail = (email: string): boolean => {
  return VALIDATE_EMAIL_REGEX.test(email);
};
