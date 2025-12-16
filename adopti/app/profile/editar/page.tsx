"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useSession } from "@/components/auth/session-provider";
import { useToast } from "@/components/ui/toast";
import UserAvatar from "@/components/auth/user-avatar";

type Profile = {
  id: string;
  display_name: string | null;
  city: string | null;
  avatar_url: string | null;
  whatsapp: string | null;
  address: string | null;
  show_email_public: boolean;
  show_whatsapp_public: boolean;
  show_address_public: boolean;
};

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1">
        <span className="text-sm text-gray-800">{label}</span>
        {description && (
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`h-7 w-12 rounded-full border transition flex-shrink-0 ${
          checked ? "bg-[#F47A5A] border-transparent" : "bg-gray-100 border-gray-200"
        }`}
      >
        <span
          className={`block h-6 w-6 rounded-full bg-white shadow transition ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: sessionLoading } = useSession();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [originalProfile, setOriginalProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    (async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: userRes } = await supabase.auth.getUser();
      const authUser = userRes.user;
      if (!authUser) {
        setLoading(false);
        return;
      }

      setEmail(authUser.email ?? null);

      const { data, error } = await supabase
        .from("profiles")
        .select("id,display_name,city,avatar_url,whatsapp,address,show_email_public,show_whatsapp_public,show_address_public")
        .eq("id", authUser.id)
        .single();

      if (error) {
        console.error(error);
        // Si no existe el perfil, crear uno básico
        if (error.code === "PGRST116") {
          const { data: newProfile } = await supabase
            .from("profiles")
            .insert({
              id: authUser.id,
              display_name: null,
              city: null,
              whatsapp: null,
              address: null,
              show_email_public: false,
              show_whatsapp_public: false,
              show_address_public: false,
            })
            .select()
            .single();
          if (newProfile) setProfile(newProfile as Profile);
        }
      } else if (data) {
        const profileData = data as Profile;
        setProfile(profileData);
        setOriginalProfile(JSON.parse(JSON.stringify(profileData))); // Deep copy
      }
      setLoading(false);
    })();
  }, [user]);

  // Detectar cambios
  useEffect(() => {
    if (!profile || !originalProfile) {
      setHasChanges(false);
      return;
    }

    const changed =
      profile.display_name !== originalProfile.display_name ||
      profile.city !== originalProfile.city ||
      profile.whatsapp !== originalProfile.whatsapp ||
      profile.address !== originalProfile.address ||
      profile.show_email_public !== originalProfile.show_email_public ||
      profile.show_whatsapp_public !== originalProfile.show_whatsapp_public ||
      profile.show_address_public !== originalProfile.show_address_public;

    setHasChanges(changed);
  }, [profile, originalProfile]);

  async function save() {
    if (!profile || !user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: profile.display_name,
          city: profile.city,
          whatsapp: profile.whatsapp,
          address: profile.address,
          show_email_public: profile.show_email_public,
          show_whatsapp_public: profile.show_whatsapp_public,
          show_address_public: profile.show_address_public,
        })
        .eq("id", profile.id);

      if (error) throw error;
      
      // Actualizar originalProfile para reflejar los cambios guardados
      setOriginalProfile(JSON.parse(JSON.stringify(profile)));
      setHasChanges(false);
      
      toast({ title: "Perfil actualizado", variant: "success" });
      
      // Redirigir al perfil después de guardar
      setTimeout(() => {
        router.push("/profile");
      }, 500);
    } catch (err: any) {
      toast({ title: err.message || "Error al guardar", variant: "error" });
    } finally {
      setSaving(false);
    }
  }

  if (sessionLoading || loading) {
    return (
      <main className="mx-auto flex min-h-screen max-w-xl flex-col gap-4 px-4 pb-24">
        <div className="mt-6">
          <div className="mb-4 flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-gray-200 animate-pulse" />
            <div className="flex-1">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white/80 p-4 shadow-sm space-y-4">
          <div>
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-10 w-full bg-gray-200 rounded-xl animate-pulse" />
          </div>
          <div>
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
          </div>
          <div>
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-10 w-full bg-gray-200 rounded-xl animate-pulse" />
          </div>
          <div>
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-10 w-full bg-gray-200 rounded-xl animate-pulse" />
          </div>
          <div>
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-10 w-full bg-gray-200 rounded-xl animate-pulse" />
          </div>
          <div className="space-y-3 pt-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="h-4 w-40 bg-gray-200 rounded animate-pulse mb-1" />
                  <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="h-7 w-12 rounded-full bg-gray-200 animate-pulse" />
              </div>
            ))}
          </div>
          <div className="pt-4">
            <div className="h-12 w-full bg-gray-200 rounded-xl animate-pulse" />
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-3 px-4 pb-24">
        <h1 className="text-2xl font-semibold">Mi perfil</h1>
        <p className="text-sm text-gray-600">Inicia sesión para editar tu perfil.</p>
        <Link
          href="/login"
          className="mt-2 inline-flex items-center justify-center rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white"
        >
          Iniciar sesión
        </Link>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-4 pb-24">
        <p className="text-center text-sm text-gray-600">Error al cargar el perfil</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col gap-4 px-4 pb-24">
      <div className="mt-6">
        <Link
          href="/profile"
          className="mb-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a mi perfil
        </Link>
        
        <div className="mb-4">
          <h1 className="text-2xl font-semibold text-gray-900">Editar perfil</h1>
          <p className="text-sm text-gray-600 mt-1">Actualizá tu información pública y de contacto</p>
        </div>

        {hasChanges && (
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
            <p className="text-xs font-medium text-amber-800">Tenés cambios sin guardar</p>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white/80 p-4 shadow-sm space-y-4">
        <label className="block">
          <div className="text-sm font-medium text-gray-900 mb-1">Nombre</div>
          <input
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
            value={profile.display_name ?? ""}
            onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
            placeholder="Tu nombre público"
          />
        </label>

        <div>
          <div className="text-sm text-gray-500 mb-1">Email (solo vos)</div>
          <div className="text-sm text-gray-600">{email ?? "-"}</div>
        </div>

        <label className="block">
          <div className="text-sm text-gray-600 mb-1">Ciudad</div>
          <input
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
            value={profile.city ?? ""}
            onChange={(e) => setProfile({ ...profile, city: e.target.value })}
            placeholder="Ej: Asunción"
          />
        </label>

        <label className="block">
          <div className="text-sm text-gray-600 mb-1">WhatsApp</div>
          <input
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
            placeholder="+5959…"
            value={profile.whatsapp ?? ""}
            onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })}
          />
        </label>

        <label className="block">
          <div className="text-sm text-gray-600 mb-1">Dirección (opcional)</div>
          <input
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
            value={profile.address ?? ""}
            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
            placeholder="Dirección completa"
          />
        </label>

        <div className="space-y-3 pt-2">
          <Toggle
            label="Mostrar WhatsApp públicamente"
            description="Visible en tu perfil público"
            checked={profile.show_whatsapp_public}
            onChange={(v) => setProfile({ ...profile, show_whatsapp_public: v })}
          />
          <Toggle
            label="Mostrar dirección públicamente"
            description="Visible en tu perfil público"
            checked={profile.show_address_public}
            onChange={(v) => setProfile({ ...profile, show_address_public: v })}
          />
          <Toggle
            label="Mostrar email públicamente"
            description="Visible en tu perfil público"
            checked={profile.show_email_public}
            onChange={(v) => setProfile({ ...profile, show_email_public: v })}
          />
        </div>

        <div className="pt-4">
          <button
            onClick={save}
            disabled={saving || !hasChanges}
            className="w-full rounded-xl bg-[#F47A5A] py-3 text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Guardando…
              </>
            ) : hasChanges ? (
              "Guardar cambios"
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Guardado
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
