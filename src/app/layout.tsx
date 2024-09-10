import type { Metadata } from "next";
import { Karla as FontSans } from "next/font/google";
import "../styles/globals.css";
import Sidebar from "@/components/Sidebar";

import { cn } from "@/lib/utils";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased flex",
          fontSans.variable
        )}
      >
        {/* Sidebar */}
        <Sidebar />

        {/* Main content area */}
        <div className="flex-1 p-4 px-8">{children}</div>
      </body>
    </html>
  );
}
