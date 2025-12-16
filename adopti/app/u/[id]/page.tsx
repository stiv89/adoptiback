"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type PublicProfile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  city: string | null;
  whatsapp: string | null;
  address: string | null;
  email: string | null;
};

export default function PublicProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  const [p, setP] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("public_profiles")
        .select("id,display_name,avatar_url,city,whatsapp,address,email")
        .eq("id", userId)
        .single();

      if (error) console.error(error);
      setP((data as PublicProfile) ?? null);
      setLoading(false);
    })();
  }, [userId]);

  if (loading) return <div className="p-4">Cargando…</div>;
  if (!p) return <div className="p-4">Perfil no disponible</div>;

  return (
    <main className="p-4 max-w-xl mx-auto">
      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 overflow-hidden rounded-full bg-gray-100">
            {p.avatar_url ? (
              <img src={p.avatar_url} alt={p.display_name ?? "Perfil"} className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full w-full place-items-center text-gray-400">👤</div>
            )}
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">{p.display_name ?? "Usuario"}</div>
            <div className="text-sm text-gray-600">{p.city ?? ""}</div>
          </div>
        </div>

        <div className="mt-4 space-y-2 text-sm">
          {p.whatsapp && (
            <a
              className="block rounded-xl bg-[#FFF3EF] px-3 py-2 text-[#F47A5A]"
              href={`https://wa.me/${p.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp: {p.whatsapp}
            </a>
          )}
          {p.email && <div className="rounded-xl border border-gray-200 px-3 py-2">Email: {p.email}</div>}
          {p.address && <div className="rounded-xl border border-gray-200 px-3 py-2">Dirección: {p.address}</div>}

          {!p.whatsapp && !p.email && !p.address && (
            <div className="text-gray-500">Este usuario no tiene datos de contacto públicos.</div>
          )}
        </div>
      </div>
    </main>
  );
}

