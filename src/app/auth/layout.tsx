export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className="light flex min-h-screen flex-col items-center justify-center px-6"
      style={
        {
          colorScheme: "light",
          backgroundColor: "hsl(0 0% 96.5%)",
          color: "hsl(0 0% 12%)",
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
