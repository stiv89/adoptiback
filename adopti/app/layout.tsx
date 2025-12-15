import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/auth/session-provider";
import AppNav from "@/components/navigation/app-nav";
import { ToastProvider } from "@/components/ui/toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Adopti",
  description: "Encuentra tu próxima mascota en adopción",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-50 text-neutral-900`}>
        <SessionProvider>
          <ToastProvider>
            <AppNav />
            <div className="min-h-screen pb-20 md:pb-0">{children}</div>
          </ToastProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
