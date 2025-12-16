"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { useSession } from "@/components/auth/session-provider";
import ApplyModal from "./apply-modal";

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
  const [app, setApp] = useState<Application | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    <>
      <div className="sticky bottom-4 mt-4 rounded-2xl border bg-white/95 p-4 shadow-md backdrop-blur">
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
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-3 w-full rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-500/90 active:scale-95"
          >
            Postularme
          </button>
        )}
      </div>

      <ApplyModal petId={petId} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

