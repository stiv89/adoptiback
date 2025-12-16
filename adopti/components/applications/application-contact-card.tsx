"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type ContactRow = {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  email: string | null;
  whatsapp: string | null;
  address: string | null;
};

export function ApplicationContactCard({ applicationId }: { applicationId: string }) {
  const [c, setC] = useState<ContactRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase.rpc("get_contact_for_application", {
        app_id: applicationId,
      });

      if (error) console.error(error);
      // RPC devuelve array (table). Tomamos el primero.
      const row = Array.isArray(data) ? (data[0] as ContactRow) : null;
      setC(row ?? null);
      setLoading(false);
    })();
  }, [applicationId]);

  if (loading) return <div className="rounded-2xl border border-gray-200 p-4">Cargando contacto…</div>;

  if (!c) {
    return (
      <div className="rounded-2xl border border-gray-200 p-4 text-sm text-gray-600">
        Contacto no disponible (todavía) o no tenés permisos para verlo.
      </div>
    );
  }

  const wa = c.whatsapp?.replace(/\D/g, "");

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-100">
          {c.avatar_url ? (
            <img src={c.avatar_url} alt={c.display_name ?? "Contacto"} className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center text-gray-400">👤</div>
          )}
        </div>
        <div className="font-medium text-gray-900">{c.display_name ?? "Contacto"}</div>
      </div>

      <div className="mt-3 space-y-2 text-sm">
        {c.whatsapp && (
          <a
            className="block rounded-xl bg-[#FFF3EF] px-3 py-2 text-[#F47A5A]"
            href={`https://wa.me/${wa}`}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp: {c.whatsapp}
          </a>
        )}
        {c.email && <div className="rounded-xl border border-gray-200 px-3 py-2">Email: {c.email}</div>}
        {c.address && <div className="rounded-xl border border-gray-200 px-3 py-2">Dirección: {c.address}</div>}

        {!c.whatsapp && !c.email && !c.address && (
          <div className="text-gray-500">Sin datos de contacto cargados.</div>
        )}
      </div>
    </div>
  );
}

