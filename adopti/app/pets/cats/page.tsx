import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gatos en adopción | Adopti",
  description: "Encuentra gatos en adopción cerca tuyo y publica nuevas mascotas.",
};

export default function CatsPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-4 px-4 pb-24">
      <div className="mt-6">
        <p className="text-sm text-gray-500">Gatos</p>
        <h1 className="text-2xl font-semibold text-gray-900">Gatos en adopción</h1>
        <p className="text-sm text-gray-600">Pronto verás el listado filtrado de gatos aquí.</p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white/80 p-4 text-sm text-gray-700">
        Mientras, usa el feed general o filtra por especie en Buscar.
      </div>

      <Link href="/pets" className="text-sm font-semibold text-brand hover:underline">
        Volver a todas las mascotas
      </Link>
    </main>
  );
}

