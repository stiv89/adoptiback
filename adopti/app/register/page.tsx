"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError("No pudimos crear la cuenta. " + (error.message ?? ""));
      setLoading(false);
      return;
    }

    setInfo("Revisa tu email para confirmar tu cuenta.");
    setLoading(false);
    // Opcional: redirigir tras confirmación; lo dejamos manual por ahora.
    router.replace("/");
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-4 pb-24">
      <div className="space-y-2">
        <div className="flex gap-2 rounded-full bg-white/80 p-1 text-sm font-semibold shadow-sm">
          <Link
            href="/login"
            className="flex-1 rounded-full px-3 py-2 text-center text-gray-600 hover:text-gray-800"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            className="flex-1 rounded-full bg-gray-200 px-3 py-2 text-center text-gray-900"
          >
            Crear cuenta
          </Link>
        </div>
        <p className="text-sm text-neutral-500">Adopti</p>
        <h1 className="text-2xl font-semibold">Crear cuenta</h1>
        <p className="text-sm text-neutral-600">Regístrate para postular o publicar.</p>
      </div>

      <form onSubmit={handleRegister} className="rounded-2xl border bg-white/80 p-4 shadow-sm backdrop-blur">
        <label className="mb-3 block text-sm font-medium text-neutral-700">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
            placeholder="tu@email.com"
          />
        </label>

        <label className="mb-4 block text-sm font-medium text-neutral-700">
          Contraseña
          <div className="relative mt-1">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border px-3 py-2 pr-24 text-sm outline-none ring-brand/30 focus:ring-2"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-3 py-1 text-xs font-semibold text-gray-600 hover:text-brand"
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </button>
          </div>
        </label>

        <div className="mb-4 rounded-xl border border-gray-200 bg-white/70 p-3 text-xs text-gray-700">
          Al registrarte como adoptante/rescatista confirmas:
          <ul className="mt-2 list-disc space-y-1 pl-4">
            <li>Dar información veraz y cumplir la normativa vigente en Paraguay.</li>
            <li>Responsabilidad en el cuidado y bienestar de la mascota adoptada.</li>
            <li>No usar la plataforma para fines comerciales no permitidos.</li>
          </ul>
        </div>

        <label className="mb-3 flex items-start gap-2 text-sm text-neutral-700">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
          />
          <span>
            Acepto los{" "}
            <Link href="/terminos" className="font-semibold text-brand hover:underline">
              Términos y condiciones
            </Link>
            {" "}de Adopti (Digita).
          </span>
        </label>

        {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}
        {info ? <p className="mb-3 text-sm text-green-700">{info}</p> : null}

        <button
          type="submit"
          disabled={loading || !agree}
          className="flex w-full items-center justify-center rounded-xl border border-gray-900 bg-white px-4 py-3 text-base font-semibold text-gray-900 shadow-sm transition active:scale-95 disabled:opacity-60"
        >
          {loading ? "Creando..." : "Crear cuenta"}
        </button>
      </form>

      <p className="text-center text-sm text-neutral-600">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-semibold text-brand hover:underline">
          Iniciar sesión
        </Link>
      </p>
    </main>
  );
}

