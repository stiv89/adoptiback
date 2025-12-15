import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cómo adoptar | Adopti",
  description: "Pasos simples para adoptar una mascota: requisitos, contacto y seguimiento.",
};

const steps = [
  { title: "Elige una mascota", detail: "Revisa el feed o las categorías de perros y gatos." },
  { title: "Envía tu postulación", detail: "Usa el botón “Postularme” y deja un mensaje breve." },
  { title: "Coordinación", detail: "El refugio revisa tu solicitud y agenda una visita." },
  { title: "Adopta con compromiso", detail: "Firma, recibe recomendaciones y da un hogar seguro." },
];

export default function ComoAdoptarPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-4 pb-24">
      <div className="mt-6">
        <p className="text-sm text-gray-500">Guía</p>
        <h1 className="text-2xl font-semibold text-gray-900">Cómo adoptar en Adopti</h1>
        <p className="text-sm text-gray-600">
          Proceso corto y transparente. Aquí tienes los pasos esenciales.
        </p>
      </div>

      <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white/80 p-4 md:grid-cols-2">
        {steps.map((s) => (
          <div key={s.title} className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
            <p className="text-sm font-semibold text-gray-900">{s.title}</p>
            <p className="text-sm text-gray-700">{s.detail}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-brand-50 p-4 text-sm text-gray-800">
        Tips rápidos:
        <ul className="mt-2 list-disc space-y-1 pl-4">
          <li>Completa tu perfil y usa un email activo.</li>
          <li>Deja un mensaje claro al postular.</li>
          <li>Respeta los tiempos y coordina con el refugio.</li>
        </ul>
      </div>
    </main>
  );
}

