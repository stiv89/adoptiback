"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberEmail, setRememberEmail] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("adopti:rememberEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberEmail(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("No pudimos iniciar sesión. Verifica tus datos o intenta de nuevo.");
      setLoading(false);
      return;
    }

    if (rememberEmail) {
      localStorage.setItem("adopti:rememberEmail", email);
    } else {
      localStorage.removeItem("adopti:rememberEmail");
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
      <div className="space-y-2">
        <div className="flex gap-2 rounded-full bg-white/80 p-1 text-sm font-semibold shadow-sm">
          <Link
            href="/login"
            className="flex-1 rounded-full bg-gray-200 px-3 py-2 text-center text-gray-900"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            className="flex-1 rounded-full px-3 py-2 text-center text-gray-600 hover:text-gray-800"
          >
            Crear cuenta
          </Link>
        </div>
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

        <label className="mb-4 flex items-center gap-2 text-sm text-neutral-700">
          <input
            type="checkbox"
            checked={rememberEmail}
            onChange={(e) => setRememberEmail(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
          />
          <span>Recordar mi email en este dispositivo</span>
        </label>

        {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-xl border border-gray-900 bg-white px-4 py-3 text-base font-semibold text-gray-900 transition active:scale-95 disabled:opacity-60"
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

