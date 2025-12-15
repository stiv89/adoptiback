import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mascotas en adopción | Adopti",
  description: "Perros y gatos en adopción cerca tuyo. Encuentra a tu próximo compañero.",
};

export default function PetsPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-4 px-4 pb-24">
      <div className="mt-6">
        <p className="text-sm text-gray-500">Mascotas</p>
        <h1 className="text-2xl font-semibold text-gray-900">Todas las mascotas</h1>
        <p className="text-sm text-gray-600">Explora perros y gatos listos para adopción.</p>
      </div>

      <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white/80 p-4 md:grid-cols-2">
        <div className="rounded-xl border border-dashed border-gray-200 bg-brand-50 px-4 py-3 text-sm text-gray-800">
          Próximamente: filtros y paginación dedicados aquí. Hoy puedes usar el feed principal.
        </div>
        <div className="flex flex-col gap-2 text-sm text-gray-700">
          <Link href="/" className="font-semibold text-brand hover:underline">
            Ir al feed principal
          </Link>
          <Link href="/pets/dogs" className="hover:text-brand">
            Ver solo perros
          </Link>
          <Link href="/pets/cats" className="hover:text-brand">
            Ver solo gatos
          </Link>
        </div>
      </div>
    </main>
  );
}

