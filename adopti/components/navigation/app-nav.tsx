"use client";

import Link from "next/link";
import { useSession } from "@/components/auth/session-provider";
import { usePathname } from "next/navigation";

const baseNav = [
  { label: "Home", href: "/", icon: "🏠" },
  { label: "Buscar", href: "/search", icon: "🔍" },
];

const authedNav = [
  { label: "Publicar", href: "/publish", icon: "➕" },
  { label: "Perfil", href: "/profile", icon: "👤" },
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
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white text-lg">
              🐾
            </span>
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
                  <span className="text-lg">{item.icon ?? "🐾"}</span>
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

