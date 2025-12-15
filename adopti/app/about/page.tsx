import type { Metadata } from "next";
import Link from "next/link";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Sobre Adopti | Adopti",
  description: "Adopti conecta refugios y adoptantes en Paraguay con un flujo simple y seguro.",
};

const icons = {
  target: (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-brand" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="7" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v3M21 12h-3M12 21v-3M6 12H3" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-brand" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3 5 6v6c0 4 3.5 7 7 9 3.5-2 7-5 7-9V6l-7-3Z" />
      <path d="M9.5 12.5 11 14l3.5-3.5" />
    </svg>
  ),
  sparkles: (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-brand" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3v4m0 10v4m-6-8H2m20 0h-4m-2.5-5.5-1 3m-4 4-1 3m6 0-1-3m-4-4-1-3" />
    </svg>
  ),
  heart: (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-brand" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 20s-6.5-3.6-8.5-7.6A5 5 0 0 1 12 6a5 5 0 0 1 8.5 6.4C18.5 16.4 12 20 12 20Z" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-brand" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="6" />
      <path d="m15.5 15.5 3.5 3.5" />
    </svg>
  ),
  message: (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-brand" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M21 13a8 8 0 0 1-12.5 6.5L3 21l1.5-5.5A8 8 0 1 1 21 13Z" />
    </svg>
  ),
  handshake: (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-brand" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="m4 12 4.5-4.5a3 3 0 0 1 4.2 0L15 10l4-2" />
      <path d="m2 12 2-2m18 0-2-2" />
      <path d="m11 17-1.5 1.5a1.5 1.5 0 0 1-2.1 0L6 17m14-5-4 4-2-2-2 2-1.5-1.5" />
    </svg>
  ),
  home: (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-brand" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 11 12 4l9 7" />
      <path d="M5 12v7h5v-4h4v4h5v-7" />
    </svg>
  ),
};

const highlights = [
  { title: "Misión", detail: "Acelerar adopciones responsables y reducir el abandono en Paraguay.", icon: icons.target },
  { title: "Confianza", detail: "Verificación, comunicación clara y seguimiento de casos.", icon: icons.shield },
  { title: "Simpleza", detail: "Postular y publicar en pocos pasos, sin burocracia innecesaria.", icon: icons.sparkles },
  { title: "Cuidado", detail: "El bienestar de la mascota es prioridad en cada adopción.", icon: icons.heart },
];

const pasos = [
  { title: "Explora", detail: "Encuentra perros y gatos listos para adopción.", icon: icons.search },
  { title: "Postula", detail: "Envía tu solicitud con un mensaje breve y coordinamos.", icon: icons.message },
  { title: "Conecta", detail: "Habla con el refugio/rescatista y agenda una visita.", icon: icons.handshake },
  { title: "Adopta", detail: "Formaliza la adopción y recibe recomendaciones de cuidado.", icon: icons.home },
];

export default function AboutPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-4 pb-24">
      <div className="mt-6 space-y-2">
        <p className="text-sm text-gray-500">Nosotros</p>
        <h1 className="text-3xl font-semibold text-gray-900">Sobre Adopti</h1>
        <p className="text-base text-gray-700">
          Hacemos que adoptar sea simple, transparente y seguro. Conectamos refugios, rescatistas y adoptantes
          para que cada mascota encuentre un hogar responsable.
        </p>
      </div>

      <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white/80 p-4 md:grid-cols-2">
        {highlights.map((item) => (
          <div key={item.title} className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
            <div className="mb-1 flex items-center gap-2">
              {item.icon}
              <p className="text-sm font-semibold text-gray-900">{item.title}</p>
            </div>
            <p className="text-sm text-gray-700">{item.detail}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white/90 p-4 shadow-sm">
        <p className="text-sm font-semibold text-gray-900">Cómo funciona</p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {pasos.map((p) => (
            <div key={p.title} className="rounded-xl border border-gray-200 bg-white p-3">
              <div className="mb-1 flex items-center gap-2">
                {p.icon}
                <p className="text-sm font-semibold text-gray-900">{p.title}</p>
              </div>
              <p className="text-sm text-gray-700">{p.detail}</p>
            </div>
          ))}
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

      <div className="rounded-2xl border border-gray-200 bg-white/90 p-4 shadow-sm">
        <p className="text-sm font-semibold text-gray-900">Términos y condiciones (resumen)</p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
          <li>
            Adopti (producto de Digita) es una plataforma de conexión; no asume responsabilidad por acuerdos,
            adopciones o transacciones entre usuarios.
          </li>
          <li>
            La información publicada por refugios, rescatistas o adoptantes es provista por terceros; cada usuario
            es responsable de su veracidad.
          </li>
          <li>
            Las adopciones deben cumplir la legislación vigente en Paraguay; los usuarios son responsables de
            conocer y respetar las normas locales.
          </li>
          <li>
            Digita no garantiza resultados ni disponibilidad de mascotas y puede moderar, suspender o eliminar
            contenido que incumpla políticas o la ley.
          </li>
          <li>
            No se facilitan pagos en la plataforma; cualquier aporte o donación es responsabilidad de las partes.
          </li>
          <li>
            Al usar la app aceptas estas condiciones y el tratamiento de datos conforme a la normativa aplicable.
          </li>
        </ul>
        <p className="mt-3 text-xs text-gray-500">
          Para términos completos o consultas legales, contáctanos en{" "}
          <Link href="/contacto" className="font-semibold text-brand hover:underline">
            contacto
          </Link>
          .
        </p>
      </div>
    </main>
  );
}

