"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.replace("/");
  };

  const handleGoogle = async () => {
    setOauthLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) {
      setError(error.message);
      setOauthLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-4 pb-24">
      <div>
        <p className="text-sm text-neutral-500">Adopti</p>
        <h1 className="text-2xl font-semibold">Iniciar sesión</h1>
        <p className="text-sm text-neutral-600">Ingresa con tu email y contraseña.</p>
      </div>

      <form onSubmit={handleLogin} className="rounded-2xl border bg-white/80 p-4 shadow-sm backdrop-blur">
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
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
            placeholder="••••••••"
          />
        </label>

        {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-500/90 active:scale-95 disabled:opacity-60"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>

      <button
        type="button"
        onClick={handleGoogle}
        disabled={oauthLoading}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-800 transition hover:border-brand hover:text-brand active:scale-95 disabled:opacity-60"
      >
        <Image src="/google.png" alt="Google" width={18} height={18} className="h-4 w-4" />
        {oauthLoading ? "Redirigiendo a Google..." : "Continuar con Google"}
      </button>

      <p className="text-center text-sm text-neutral-600">
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="font-semibold text-brand hover:underline">
          Crear cuenta
        </Link>
      </p>
    </main>
  );
}

