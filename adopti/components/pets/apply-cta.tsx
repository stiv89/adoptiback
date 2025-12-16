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
  created_at: string;
};

export default function ApplyCta({ petId }: Props) {
  const { user, loading } = useSession();
  const [app, setApp] = useState<Application | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [petName, setPetName] = useState<string | null>(null);

  useEffect(() => {
    // Cargar nombre de la mascota
    const loadPetName = async () => {
      const { data } = await supabase.from("pets").select("name").eq("id", petId).single();
      if (data) setPetName(data.name);
    };
    loadPetName();

    // Query: "¿ya me postulé a esta mascota?"
    const checkApplication = async () => {
      const { data: userRes } = await supabase.auth.getUser();
      const user = userRes.user;
      if (!user) {
        setApp(null);
        return;
      }

      const { data: existing } = await supabase
        .from("applications")
        .select("id,status,created_at")
        .eq("pet_id", petId)
        .eq("user_id", user.id)
        .maybeSingle();

      setApp(existing ?? null);
    };

    checkApplication();
  }, [petId]);

  const handleModalSuccess = () => {
    // Recargar aplicación después de enviar
    const checkApplication = async () => {
      const { data: userRes } = await supabase.auth.getUser();
      const user = userRes.user;
      if (!user) return;

      const { data: existing } = await supabase
        .from("applications")
        .select("id,status,created_at")
        .eq("pet_id", petId)
        .eq("user_id", user.id)
        .maybeSingle();

      setApp(existing ?? null);
    };
    checkApplication();
  };

  if (loading) {
    return (
      <div className="sticky bottom-4 mt-4 rounded-2xl border bg-white/90 p-4 text-center text-sm text-neutral-600 backdrop-blur">
        Cargando sesión...
      </div>
    );
  }

  // Estado A: no logueado
  if (!user) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center">
        <Link
          href="/login"
          className="block w-full rounded-xl bg-[#F47A5A] px-6 py-4 text-base font-semibold text-white transition hover:bg-[#e96a4b] active:scale-95 shadow-lg"
        >
          Iniciá sesión para postular
        </Link>
      </div>
    );
  }

  // Estado C: logueado y YA postuló
  if (app) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <button
          disabled
          className="w-full rounded-xl bg-gray-100 px-6 py-4 text-base font-semibold text-gray-500 cursor-not-allowed"
        >
          Ya te postulaste
        </button>
        <Link
          href="/profile"
          className="mt-3 block w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50 active:scale-95"
        >
          Ver mi postulación
        </Link>
      </div>
    );
  }

  // Estado B: logueado y NO postuló
  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full rounded-xl bg-[#F47A5A] px-6 py-4 text-base font-semibold text-white transition hover:bg-[#e96a4b] active:scale-95 shadow-lg"
        >
          Quiero adoptar
        </button>
        <p className="mt-2 text-center text-xs text-gray-500">
          Te pondremos en contacto con el responsable
        </p>
      </div>

      <ApplyModal 
        petId={petId} 
        petName={petName ?? undefined}
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </>
  );
}

