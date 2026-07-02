import type { Metadata } from "next";
import type { ReactNode } from "react";
import { GoogleTagManager } from "@/components/GoogleTagManager";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { buildMetadata } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = buildMetadata();

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <GoogleTagManager />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
