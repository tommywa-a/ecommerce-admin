import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from "react-hot-toast";

import { ModalProvider } from "@/providers/modal-provider";

import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem >
          <Toaster />
          <ModalProvider />
          {children}
        </ThemeProvider>
        </body>
    </html>
    </ClerkProvider>
  );
}
