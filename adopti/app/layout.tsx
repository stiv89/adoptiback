import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import "./globals.css";
import { SessionProvider } from "@/components/auth/session-provider";
import AppNav from "@/components/navigation/app-nav";
import { ToastProvider } from "@/components/ui/toast";
import Link from "next/link";

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
            <footer className="border-t border-gray-200 bg-white/95 backdrop-blur">
              <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6 md:flex-row md:items-start md:justify-between">
                <div>
                  <Link href="/" className="flex items-center gap-2 font-semibold text-gray-800">
                    <Image
                      src="/adopti_app.jpg"
                      alt="Adopti"
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <span>Adopti</span>
                  </Link>
                  <p className="mt-2 max-w-sm text-sm text-gray-600">
                    Encuentra perros y gatos en adopción. Publica y administra tus mascotas.
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                    <span>Creado por</span>
                    <a
                      href="https://digita.com.py"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-2 py-1 hover:border-brand"
                    >
                      <Image
                        src="/digitalogo.png"
                        alt="Digita"
                        width={90}
                        height={32}
                        className="h-6 w-auto object-contain"
                      />
                    </a>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 md:grid-cols-3">
                  <div className="space-y-2">
                    <p className="font-semibold text-gray-900">Mascotas</p>
                    <div className="flex flex-col gap-1">
                      <Link href="/pets" className="hover:text-brand">Todas</Link>
                      <Link href="/pets/dogs" className="hover:text-brand">Perros</Link>
                      <Link href="/pets/cats" className="hover:text-brand">Gatos</Link>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-gray-900">Cómo adoptar</p>
                    <div className="flex flex-col gap-1">
                      <Link href="/como-adoptar" className="hover:text-brand">Pasos</Link>
                      <Link href="/publicar" className="hover:text-brand">Publicar mascota</Link>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-gray-900">Nosotros</p>
                    <div className="flex flex-col gap-1">
                      <Link href="/about" className="hover:text-brand">Sobre Adopti</Link>
                      <Link href="/contacto" className="hover:text-brand">Contacto</Link>
                    </div>
                  </div>
                </div>
              </div>
            </footer>
          </ToastProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
