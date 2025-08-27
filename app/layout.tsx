import type { Metadata } from "next";
import Script from "next/script";
import { AuthProvider } from "@/contexts/auth-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "DOGGIT - Premium Video Platform",
  description: "Access premium tutorials, live streams, and exclusive content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-KM2DWZV3E2"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-KM2DWZV3E2');
          `}
        </Script>
        
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
