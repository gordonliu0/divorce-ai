export default function Page() {
  return (
    <div className="w-full max-w-sm">
      <h1
        className="text-2xl font-medium tracking-tight"
        style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
      >
        Check your email
      </h1>
      <p className="mt-3 text-sm leading-relaxed" style={{ color: "hsl(0 0% 45%)" }}>
        You&apos;ve successfully signed up. Please check your email to confirm
        your account before signing in.
      </p>
    </div>
  );
}
