"use client";

import Link from "next/link";
import { useSession } from "@/components/auth/session-provider";

export default function PublishPage() {
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
        <h1 className="text-2xl font-semibold">Publicar mascota</h1>
        <p className="text-sm text-neutral-600">Debes iniciar sesión para publicar.</p>
        <div className="flex gap-2">
          <Link
            href="/login"
            className="flex-1 rounded-xl bg-brand px-4 py-3 text-center text-sm font-semibold text-white"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            className="flex-1 rounded-xl border px-4 py-3 text-center text-sm font-semibold text-brand"
          >
            Crear cuenta
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-3 px-4 pb-24">
      <div className="mt-6">
        <p className="text-sm text-neutral-500">Próximamente</p>
        <h1 className="text-2xl font-semibold">Publicar mascota</h1>
        <p className="text-sm text-neutral-600">
          Aquí podrás subir fotos y datos de tu mascota para adopción. Estamos preparando el formulario.
        </p>
      </div>
      <div className="rounded-2xl border border-dashed bg-white/80 p-6 text-sm text-neutral-600">
        En la versión completa: datos básicos, ciudad, especie, tamaño, edad y foto principal (portada).
      </div>
      <Link href="/" className="text-sm font-semibold text-brand underline">
        Volver al feed
      </Link>
    </main>
  );
}

