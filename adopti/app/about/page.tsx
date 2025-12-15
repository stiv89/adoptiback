import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sobre Adopti | Adopti",
  description: "Adopti conecta refugios y adoptantes en Paraguay con un flujo simple y seguro.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-4 px-4 pb-24">
      <div className="mt-6">
        <p className="text-sm text-gray-500">Nosotros</p>
        <h1 className="text-2xl font-semibold text-gray-900">Sobre Adopti</h1>
        <p className="text-sm text-gray-600">
          Nacimos para que adoptar sea simple, transparente y seguro. Conectamos refugios y adoptantes,
          priorizando el bienestar de cada mascota.
        </p>
      </div>

      <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white/80 p-4 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
          <p className="text-sm font-semibold text-gray-900">Misión</p>
          <p className="text-sm text-gray-700">Acelerar adopciones responsables y reducir el abandono.</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
          <p className="text-sm font-semibold text-gray-900">Confianza</p>
          <p className="text-sm text-gray-700">Verificación, comunicación clara y seguimiento de casos.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-brand-50 p-4 text-sm text-gray-800">
        ¿Eres refugio o rescatista?
        <div className="mt-1 text-gray-700">
          Escríbenos para publicar más rápido y acompañar las adopciones.
        </div>
        <div className="mt-3 text-sm text-gray-700">
          Adopti es un producto de{" "}
          <Link href="https://digita.com.py" target="_blank" rel="noreferrer" className="font-semibold text-brand hover:underline">
            Digita
          </Link>
          , creado para agilizar adopciones responsables.
        </div>
      </div>
    </main>
  );
}

