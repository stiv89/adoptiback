"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { useSession } from "@/components/auth/session-provider";
import { useToast } from "@/components/ui/toast";

type Props = {
  petId: string;
};

type Application = {
  id: string;
  status: string;
  message: string | null;
};

export default function ApplyCta({ petId }: Props) {
  const { user, loading } = useSession();
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [app, setApp] = useState<Application | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      setApp(null);
      return;
    }

    const loadApp = async () => {
      const { data, error } = await supabase
        .from("applications")
        .select("id,status,message")
        .eq("pet_id", petId)
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle();

      if (!error && data) setApp(data);
    };

    loadApp();
  }, [petId, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (app) {
      toast({ title: "Ya postulaste", description: "Revisa el estado arriba.", variant: "info" });
      return;
    }

    setSubmitting(true);
    setError(null);
    setInfo(null);

    const { data, error } = await supabase
      .from("applications")
      .insert({
        pet_id: petId,
        user_id: user.id,
        status: "enviada",
        message: message || null,
      })
      .select("id,status,message")
      .single();

    if (error) {
      setError(error.message);
      setSubmitting(false);
      return;
    }

    setApp(data);
    setInfo("Postulación enviada");
    toast({ title: "Postulación enviada", description: "Te avisaremos cuando la revisen.", variant: "success" });
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="sticky bottom-4 mt-4 rounded-2xl border bg-white/90 p-4 text-center text-sm text-neutral-600 backdrop-blur">
        Cargando sesión...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="sticky bottom-4 mt-4 rounded-2xl border bg-white/90 p-4 text-center backdrop-blur">
        <p className="text-sm text-neutral-700">Inicia sesión para postular.</p>
        <div className="mt-3 flex gap-2">
          <Link
            href="/login"
            className="flex-1 rounded-xl border px-4 py-2 text-sm font-semibold text-brand hover:bg-brand-soft"
          >
            Ingresar
          </Link>
          <Link
            href="/register"
            className="flex-1 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500/90"
          >
            Crear cuenta
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="sticky bottom-4 mt-4 rounded-2xl border bg-white/95 p-4 shadow-md backdrop-blur"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-neutral-800">Postularme</span>
        {app ? (
          <span className="rounded-full bg-brand-soft px-2 py-1 text-[11px] font-semibold text-brand">
            {app.status}
          </span>
        ) : null}
      </div>

      {app ? (
        <p className="mt-2 text-sm text-neutral-600">
          Ya enviaste tu postulación. Estado: <strong>{app.status}</strong>
        </p>
      ) : (
        <>
          <label className="mt-3 block text-sm text-neutral-700">
            Mensaje (opcional)
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="mt-2 w-full rounded-xl border px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
              placeholder="Cuéntanos brevemente por qué quieres adoptarlo"
            />
          </label>

          {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
          {info ? <p className="mt-2 text-sm text-green-700">{info}</p> : null}

          <button
            type="submit"
            disabled={submitting}
            className="mt-3 w-full rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-500/90 active:scale-95 disabled:opacity-60"
          >
            {submitting ? "Enviando..." : "Enviar postulación"}
          </button>
        </>
      )}
    </form>
  );
}

