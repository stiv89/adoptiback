"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/components/auth/session-provider";
import Image from "next/image";

const icons = {
  home: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 12v7a1 1 0 0 0 1 1h4v-5h4v5h4a1 1 0 0 0 1-1v-7" />
    </svg>
  ),
  search: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="6" />
      <path d="m15.5 15.5 3.5 3.5" />
    </svg>
  ),
  plus: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  ),
  user: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M6 20c0-2.5 3-4 6-4s6 1.5 6 4" />
    </svg>
  ),
};

const baseNav = [
  { label: "Home", href: "/", icon: "home" as const },
  { label: "Buscar", href: "/search", icon: "search" as const },
];

const authedNav = [
  { label: "Publicar", href: "/publish", icon: "plus" as const },
  { label: "Perfil", href: "/profile", icon: "user" as const },
];

export default function AppNav() {
  const { user } = useSession();
  const pathname = usePathname();
  const items = user ? [...baseNav, ...authedNav] : baseNav;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const avatar = user
    ? user.email?.[0]?.toUpperCase() ?? "👤"
    : null;

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold text-gray-800">
            <Image
              src="/adopti_app.jpg"
              alt="Adopti"
              width={36}
              height={36}
              className="h-9 w-9 rounded-full object-cover"
              priority
            />
            <span>Adopti</span>
          </Link>

          <div className="flex items-center gap-6 text-sm text-gray-700">
            <nav className="hidden items-center gap-6 md:flex">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={isActive(item.href) ? "font-semibold text-brand" : "hover:text-brand transition-colors"}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {user ? (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-soft text-sm font-semibold text-brand">
                {avatar}
              </div>
            ) : (
              <Link
                href="/login"
                className="rounded-full border border-gray-200 px-3 py-1.5 text-sm font-semibold text-gray-800 hover:border-brand hover:text-brand"
              >
                Entrar
              </Link>
            )}
          </div>
        </div>
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white/95 shadow-[0_-4px_10px_rgba(0,0,0,0.04)] backdrop-blur md:hidden">
        <ul className="grid grid-cols-4 text-xs font-medium text-gray-500">
          {items.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex h-14 flex-col items-center justify-center gap-1 transition ${
                    active ? "text-brand font-semibold" : "text-gray-400 hover:text-brand"
                  }`}
                >
                  <span className="text-lg">{icons[item.icon]}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}

