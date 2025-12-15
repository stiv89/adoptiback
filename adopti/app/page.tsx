"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { motion } from "framer-motion";

type Pet = {
  id: string;
  name: string;
  city: string | null;
  status: string;
  pet_photos: { path: string; sort: number }[];
};

function SkeletonCard() {
  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="aspect-square w-full animate-pulse bg-gray-200" />
      <div className="p-3">
        <div className="mb-2 h-4 w-3/4 animate-pulse rounded bg-gray-200" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200" />
      </div>
    </article>
  );
}

export default function Home() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("pets")
        .select("id,name,city,status,pet_photos(path,sort)")
        .eq("published", true)
        .neq("status", "hidden")
        .order("created_at", { ascending: false })
        .limit(30);

      if (!error && data) setPets(data as any);
      if (error) console.error(error);
      setLoading(false);
    })();
  }, []);

  return (
    <main className="min-h-screen p-4">
      <h1 className="text-xl font-semibold">Adopti</h1>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading ? (
          <>
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </>
        ) : pets.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed bg-white/80 p-6 text-center text-neutral-600">
            <div className="mb-2 text-3xl">🐾</div>
            <p className="text-sm font-medium">Aún no hay mascotas publicadas</p>
            <p className="text-xs text-neutral-500">Vuelve pronto o publícala primero</p>
          </div>
        ) : (
          pets.map((p) => {
            // Ordenar y tomar la primera (sort menor = portada)
            const photo = (p.pet_photos || []).sort((a, b) => a.sort - b.sort)[0];
            const url = photo
              ? supabase.storage.from("pet-photos").getPublicUrl(photo.path).data.publicUrl
              : null;

            return (
              <Link key={p.id} href={`/pets/${p.id}`}>
                <motion.article
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                >
                  <div className="aspect-square w-full bg-brand-50">
                    {url ? (
                      <img src={url} alt={p.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-gray-500">
                        Sin foto
                      </div>
                    )}
                  </div>

                  <div className="p-3">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-900">{p.name}</h2>
                      <span className="text-xs text-gray-500">{p.city ?? ""}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      {p.status === "available" ? (
                        <span className="rounded-full bg-brand-50 px-2 py-1 font-medium text-brand">
                          Disponible
                        </span>
                      ) : (
                        "En proceso"
                      )}
                    </p>
                  </div>
                </motion.article>
              </Link>
            );
          })
        )}
      </div>
    </main>
  );
}
