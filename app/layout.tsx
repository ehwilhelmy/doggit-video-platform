import type { Metadata } from "next";
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
        {children}
      </body>
    </html>
  );
}
