"use client";

import { MarketingNav } from "@/features/marketing/components/NavBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className="relative min-h-screen"
      style={
        {
          colorScheme: "light",
          // Warm earthy palette — scoped to marketing only
          "--background": "hsl(0 0% 96.5%)",
          "--foreground": "hsl(0 0% 12%)",
          "--card": "hsl(0 0% 94%)",
          "--card-foreground": "hsl(0 0% 12%)",
          "--popover": "hsl(0 0% 94%)",
          "--popover-foreground": "hsl(0 0% 12%)",
          "--primary": "hsl(0 0% 12%)",
          "--primary-foreground": "hsl(0 0% 96.5%)",
          "--secondary": "hsl(0 0% 91%)",
          "--secondary-foreground": "hsl(0 0% 12%)",
          "--muted": "hsl(0 0% 91%)",
          "--muted-foreground": "hsl(0 0% 45%)",
          "--accent": "hsl(0 0% 89%)",
          "--accent-foreground": "hsl(0 0% 12%)",
          "--border": "hsl(0 0% 85%)",
          "--input": "hsl(0 0% 85%)",
          "--ring": "hsl(0 0% 25%)",
          backgroundColor: "hsl(0 0% 96.5%)",
          color: "hsl(0 0% 12%)",
        } as React.CSSProperties
      }
    >
      <MarketingNav />
      {children}
    </div>
  );
}
