"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/components/auth/session-provider";
import { supabase } from "@/lib/supabase/client";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import UserAvatar from "@/components/auth/user-avatar";

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
];

function UserMenu({ user, buttonRef, menuRef, onClose }: { user: any; buttonRef: React.RefObject<HTMLButtonElement>; menuRef: React.RefObject<HTMLDivElement>; onClose: () => void }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ top: 0, right: 0 });

  useEffect(() => {
    setMounted(true);
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 12, // Más espacio (12px en lugar de 8px)
        right: window.innerWidth - rect.right + window.scrollX,
      });
    }
  }, [buttonRef]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (mounted) {
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [mounted, onClose]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    onClose();
  };

  const handleNavigation = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[99] bg-black/5"
        />
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.98 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          className="fixed z-[100] w-48 rounded-xl border border-gray-200 bg-white shadow-lg"
          style={{
            top: `${position.top}px`,
            right: `${position.right}px`,
          }}
        >
          <div className="p-2">
            <Link
              href="/profile/editar"
              onClick={handleNavigation}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 active:scale-[0.98] transition"
            >
              <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editar perfil
            </Link>
            <Link
              href="/profile"
              onClick={handleNavigation}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 active:scale-[0.98] transition"
            >
              <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Mi perfil
            </Link>
            <div className="my-1.5 border-t border-gray-100" />
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 active:scale-[0.98] transition"
            >
              <svg className="h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Salir
            </button>
          </div>
        </motion.div>
      </>
    </AnimatePresence>,
    document.body
  );
}

export default function AppNav() {
  const { user } = useSession();
  const pathname = usePathname();
  const items = user ? [...baseNav, ...authedNav] : baseNav;
  const [menuOpen, setMenuOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      // El overlay ya maneja el click fuera, pero verificamos también aquí
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      // Pequeño delay para evitar que se cierre inmediatamente al abrir
      const timeout = setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 10);
      return () => {
        clearTimeout(timeout);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [menuOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/adopti_app.jpg"
              alt="Adopti"
              width={28}
              height={28}
              className="h-7 w-7 rounded-full object-cover"
              priority
            />
            <span className="text-base font-semibold text-gray-900">Adopti</span>
          </Link>

          <div className="flex items-center gap-4">
            <nav className="hidden items-center gap-2 md:flex">
              {items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative rounded-full px-4 py-2 text-sm font-medium transition ${
                      active
                        ? "bg-[#F47A5A] !text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  ref={buttonRef}
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center justify-center rounded-full border border-gray-200 p-1.5 transition hover:border-brand hover:bg-brand-soft/30"
                >
                  <UserAvatar userId={user.id} email={user.email ?? null} size={28} className="h-7 w-7" />
                </button>
                {mounted && menuOpen && (
                  <UserMenu
                    user={user}
                    buttonRef={buttonRef}
                    menuRef={menuRef}
                    onClose={() => setMenuOpen(false)}
                  />
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="rounded-full border border-gray-200 px-3 py-1.5 text-sm font-semibold text-gray-800 hover:border-brand hover:text-brand transition"
              >
                Entrar
              </Link>
            )}
          </div>
        </div>
      </header>

      <nav className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 md:hidden">
        <div className="mx-auto rounded-full border border-gray-200/50 bg-white/80 px-3 py-3 shadow-lg backdrop-blur-xl">
          <ul className="relative flex items-center justify-center gap-2 text-xs font-medium text-gray-500">
            {items.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="relative flex min-w-[64px] flex-col items-center justify-center gap-1 rounded-full px-4 py-2"
                  >
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-full bg-brand/15"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                        mass: 0.8,
                      }}
                    />
                    <motion.div
                      className={`relative text-2xl transition-colors duration-300 ${
                        active ? "text-brand" : "text-gray-500"
                      }`}
                      animate={{
                        scale: active ? 1.1 : 1,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                        mass: 0.5,
                      }}
                    >
                      {icons[item.icon]}
                    </motion.div>
                    <motion.span
                      className={`relative text-[11px] leading-tight transition-all duration-300 ${
                        active ? "font-semibold text-brand" : "font-medium text-gray-500"
                      }`}
                      animate={{
                        scale: active ? 1.05 : 1,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                        mass: 0.5,
                      }}
                    >
                      {item.label}
                    </motion.span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </>
  );
}

