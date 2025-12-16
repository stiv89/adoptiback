"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { useSession } from "@/components/auth/session-provider";
import { useToast } from "@/components/ui/toast";
import UserAvatar from "@/components/auth/user-avatar";
import { ApplicationContactCard } from "@/components/applications/application-contact-card";

type Application = {
  id: string;
  user_id: string;
  status: string;
  created_at: string;
  profiles: {
    id: string;
    display_name: string | null;
    avatar_url: string | null;
  } | null;
};

export default function ApplicationsPage() {
  const params = useParams();
  const router = useRouter();
  const petId = params.id as string;
  const { user } = useSession();
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [petName, setPetName] = useState("");

  useEffect(() => {
    (async () => {
      // Verificar que el usuario es el dueño
      const { data: pet } = await supabase.from("pets").select("id,name,owner_user_id").eq("id", petId).single();

      if (!pet) {
        router.push("/");
        return;
      }

      if (pet.owner_user_id !== user?.id) {
        toast({ title: "No tienes permiso para ver estas postulaciones", variant: "error" });
        router.push(`/pets/${petId}`);
        return;
      }

      setPetName(pet.name);

      // Cargar postulaciones
      const { data, error } = await supabase
        .from("applications")
        .select("id,user_id,status,created_at,profiles(id,display_name,avatar_url)")
        .eq("pet_id", petId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
      } else if (data) {
        setApplications(data as any);
      }
      setLoading(false);
    })();
  }, [petId, user, router, toast]);

  if (loading) {
    return (
      <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-4 pb-24">
        <p className="text-center text-sm text-gray-600">Cargando…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-4 px-4 pb-24">
      <div className="mt-6">
        <Link href={`/pets/${petId}`} className="mb-2 inline-block text-sm text-gray-600 underline">
          ← Volver a {petName}
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">Postulaciones</h1>
        <p className="text-sm text-gray-600">Postulaciones para {petName}</p>
      </div>

      {applications.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-white/80 p-6 text-center">
          <p className="text-sm text-gray-600">Aún no hay postulaciones</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="space-y-3">
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <Link href={`/u/${app.user_id}`}>
                    <UserAvatar
                      userId={app.user_id}
                      email={null}
                      size={48}
                      className="h-12 w-12"
                    />
                  </Link>
                  <div className="flex-1">
                    <Link href={`/u/${app.user_id}`}>
                      <h3 className="font-semibold text-gray-900">
                        {app.profiles?.display_name || "Usuario"}
                      </h3>
                    </Link>
                    <p className="text-xs text-gray-500">
                      {new Date(app.created_at).toLocaleDateString("es-PY")}
                    </p>
                    <div className="mt-2">
                      <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand">
                        {app.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <ApplicationContactCard applicationId={app.id} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

