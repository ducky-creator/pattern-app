import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pattern",
  description: "Track daily triggers, emotions, and actions to uncover patterns."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
