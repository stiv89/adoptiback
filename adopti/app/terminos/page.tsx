import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Términos y condiciones | Adopti",
  description:
    "Condiciones de uso de Adopti, plataforma de conexión entre refugios, rescatistas y adoptantes en Paraguay.",
};

export default function TerminosPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-4 pb-24">
      <div className="mt-6 space-y-2">
        <p className="text-sm text-gray-500">Legal</p>
        <h1 className="text-3xl font-semibold text-gray-900">Términos y condiciones</h1>
        <p className="text-base text-gray-700">
          Al usar Adopti aceptas estos términos. Adopti es un producto de Digita y actúa como plataforma de conexión,
          no como intermediario legal ni garante de adopciones.
        </p>
      </div>

      <div className="space-y-3 rounded-2xl border border-gray-200 bg-white/90 p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">1. Rol de la plataforma</h2>
        <p className="text-sm text-gray-700">
          Adopti conecta refugios, rescatistas y adoptantes. No asume responsabilidad por acuerdos, adopciones ni
          transacciones entre las partes.
        </p>
      </div>

      <div className="space-y-3 rounded-2xl border border-gray-200 bg-white/90 p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">2. Información de usuarios</h2>
        <p className="text-sm text-gray-700">
          Los datos y publicaciones son provistos por terceros. Cada usuario es responsable de la veracidad y legalidad
          de lo que publica.
        </p>
      </div>

      <div className="space-y-3 rounded-2xl border border-gray-200 bg-white/90 p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">3. Cumplimiento legal</h2>
        <p className="text-sm text-gray-700">
          Las adopciones deben cumplir las leyes vigentes en Paraguay. Los usuarios son responsables de conocer y
          respetar los requisitos locales y sanitarios.
        </p>
      </div>

      <div className="space-y-3 rounded-2xl border border-gray-200 bg-white/90 p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">4. Moderación y suspensión</h2>
        <p className="text-sm text-gray-700">
          Digita puede moderar, suspender o eliminar contenido o cuentas que incumplan estos términos, políticas
          internas o la ley.
        </p>
      </div>

      <div className="space-y-3 rounded-2xl border border-gray-200 bg-white/90 p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">5. Pagos y donaciones</h2>
        <p className="text-sm text-gray-700">
          Adopti no procesa pagos. Cualquier aporte o donación es responsabilidad exclusiva de las partes involucradas.
        </p>
      </div>

      <div className="space-y-3 rounded-2xl border border-gray-200 bg-white/90 p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">6. Limitación de responsabilidad</h2>
        <p className="text-sm text-gray-700">
          Adopti y Digita no garantizan disponibilidad de mascotas, ni resultados, ni se hacen responsables por daños
          directos o indirectos derivados del uso de la plataforma.
        </p>
      </div>

      <div className="space-y-3 rounded-2xl border border-gray-200 bg-white/90 p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">7. Datos personales</h2>
        <p className="text-sm text-gray-700">
          El uso implica aceptar el tratamiento de datos conforme a la normativa aplicable. Para ejercer derechos o
          dudas de privacidad, contáctanos.
        </p>
      </div>

      <div className="space-y-3 rounded-2xl border border-gray-200 bg-white/90 p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">8. Contacto</h2>
        <p className="text-sm text-gray-700">
          Escríbenos en la sección{" "}
          <Link href="/contacto" className="font-semibold text-brand hover:underline">
            Contacto
          </Link>
          . Para reportar abusos o infringir normas, avísanos de inmediato.
        </p>
      </div>
    </main>
  );
}

