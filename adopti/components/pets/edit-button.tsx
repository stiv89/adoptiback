"use client";

import Link from "next/link";
import { useSession } from "@/components/auth/session-provider";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

const EditIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const ApplicationsIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

export default function EditButton({ petId }: { petId: string }) {
  const { user } = useSession();
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    (async () => {
      const { data } = await supabase.from("pets").select("owner_user_id").eq("id", petId).single();
      setIsOwner(data?.owner_user_id === user.id);
      setLoading(false);
    })();
  }, [petId, user]);

  if (loading || !isOwner) return null;

  return (
    <div className="mt-4 flex flex-col gap-2">
      <Link
        href={`/pets/${petId}/applications`}
        className="flex items-center justify-center gap-2 w-full rounded-xl border border-gray-900 bg-white px-4 py-3 text-center text-sm font-semibold text-gray-900 transition active:scale-95"
      >
        <ApplicationsIcon />
        Ver postulaciones
      </Link>
      <Link
        href={`/pets/${petId}/edit`}
        className="flex items-center justify-center gap-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-center text-sm font-semibold text-gray-700 transition active:scale-95"
      >
        <EditIcon />
        Editar mascota
      </Link>
    </div>
  );
}

