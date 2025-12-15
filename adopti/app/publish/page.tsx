import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Publicar una mascota en adopción | Adopti",
  description: "Sube fotos y datos de tu mascota para encontrarle un hogar seguro.",
};

export default function PublishPage() {
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
      <div className="flex gap-2">
        <Link href="/" className="text-sm font-semibold text-brand underline">
          Volver al feed
        </Link>
        <Link href="/login" className="text-sm font-semibold text-brand underline">
          Iniciar sesión
        </Link>
      </div>
    </main>
  );
}

