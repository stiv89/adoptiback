import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto | Adopti",
  description: "Habla con el equipo de Adopti: soporte para adoptantes, refugios y rescatistas.",
};

export default function ContactoPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-4 px-4 pb-24">
      <div className="mt-6">
        <p className="text-sm text-gray-500">Contacto</p>
        <h1 className="text-2xl font-semibold text-gray-900">Contáctanos</h1>
        <p className="text-sm text-gray-600">Soporte para adoptantes, refugios y rescatistas.</p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white/80 p-4 text-sm text-gray-700">
        Escríbenos a: <span className="font-semibold text-brand">hola@adopti.app</span>
        <br />
        También podemos coordinar por WhatsApp o llamada si lo prefieres.
      </div>
    </main>
  );
}

