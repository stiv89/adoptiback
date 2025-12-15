"use client";

import Link from "next/link";
import { useSession } from "@/components/auth/session-provider";

export default function ProfilePage() {
  const { user, loading } = useSession();

  if (loading) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-4 pb-24">
        <p className="text-sm text-neutral-600">Cargando sesión...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-3 px-4 pb-24">
        <h1 className="text-2xl font-semibold">Tu perfil</h1>
        <p className="text-sm text-neutral-600">Inicia sesión para ver tus datos.</p>
        <Link
          href="/login"
          className="mt-2 inline-flex items-center justify-center rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white"
        >
          Iniciar sesión
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-4 px-4 pb-24">
      <div className="mt-6">
        <p className="text-sm text-neutral-500">Mi cuenta</p>
        <h1 className="text-2xl font-semibold">Hola, {user.email}</h1>
        <p className="text-sm text-neutral-600">Pronto verás tus postulaciones y mascotas publicadas.</p>
      </div>

      <div className="space-y-3">
        <div className="rounded-2xl border bg-white/80 p-4">
          <p className="text-sm font-semibold text-neutral-800">Mis postulaciones</p>
          <p className="text-sm text-neutral-600">Pendiente de implementación.</p>
        </div>
        <div className="rounded-2xl border bg-white/80 p-4">
          <p className="text-sm font-semibold text-neutral-800">Mis mascotas publicadas</p>
          <p className="text-sm text-neutral-600">Pendiente de implementación.</p>
        </div>
      </div>
    </main>
  );
}

