"use client";

import Link from "next/link";
import { useSession } from "@/components/auth/session-provider";

const baseNav = [
  { label: "Home", href: "/" },
  { label: "Buscar", href: "/search" },
];

const authedNav = [
  { label: "Publicar", href: "/publish" },
  { label: "Perfil", href: "/profile" },
];

export default function AppNav() {
  const { user } = useSession();
  const items = user ? [...baseNav, ...authedNav] : baseNav;

  return (
    <>
      <header className="sticky top-0 z-20 hidden border-b bg-white/90 backdrop-blur md:block">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold text-neutral-900">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white text-lg">
              🐾
            </span>
            <span>Adopti</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm text-neutral-700">
            {items.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-brand transition-colors">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t bg-white/95 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-2 text-xs font-medium text-neutral-700">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-w-[64px] flex-col items-center gap-1 rounded-full px-3 py-1 hover:text-brand active:scale-95 transition"
            >
              <span className="text-lg">🐾</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}

