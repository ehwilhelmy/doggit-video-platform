import type { Metadata } from "next";
import Script from "next/script";
import { AuthProvider } from "@/contexts/auth-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "DOGGIT - Expert Dog Training",
  description: "Learn expert dog training techniques from renowned trainers Jayme Nolan and Jo Simpson. Master puppy basics, leash training, and more with proven methods rooted in dog psychology.",
  openGraph: {
    title: "DOGGIT - Expert Dog Training",
    description: "Learn expert dog training techniques from renowned trainers Jayme Nolan and Jo Simpson. Master puppy basics, leash training, and more with proven methods rooted in dog psychology.",
    url: "https://training.doggit.app",
    siteName: "DOGGIT",
    images: [
      {
        url: "https://vbtucyswugifonwodopp.supabase.co/storage/v1/object/public/images/1%20Puppy%20Basics.png",
        width: 1200,
        height: 630,
        alt: "DOGGIT Expert Dog Training - Puppy Basics",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DOGGIT - Expert Dog Training",
    description: "Learn expert dog training techniques from renowned trainers Jayme Nolan and Jo Simpson. Master puppy basics, leash training, and more with proven methods rooted in dog psychology.",
    images: ["https://vbtucyswugifonwodopp.supabase.co/storage/v1/object/public/images/1%20Puppy%20Basics.png"],
  },
  metadataBase: new URL("https://training.doggit.app"),
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
