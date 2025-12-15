"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

type Pet = {
  id: string;
  name: string;
  city: string | null;
  status: string;
  pet_photos: { path: string; sort: number }[];
};

function SkeletonCard() {
  return (
    <article className="overflow-hidden rounded-2xl border">
      <div className="aspect-square w-full animate-pulse bg-neutral-200" />
      <div className="p-3">
        <div className="mb-2 h-4 w-3/4 animate-pulse rounded bg-neutral-200" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-neutral-200" />
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
        ) : (
          pets.map((p) => {
            // Ordenar y tomar la primera (sort menor = portada)
            const photo = (p.pet_photos || []).sort((a, b) => a.sort - b.sort)[0];
            const url = photo
              ? supabase.storage.from("pet-photos").getPublicUrl(photo.path).data.publicUrl
              : null;

            return (
              <Link key={p.id} href={`/pets/${p.id}`}>
                <article className="overflow-hidden rounded-2xl border transition-transform hover:scale-[1.02] active:scale-[0.98]">
                  <div className="aspect-square w-full bg-neutral-100">
                    {url ? (
                      <img src={url} alt={p.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-neutral-500">
                        Sin foto
                      </div>
                    )}
                  </div>

                  <div className="p-3">
                    <div className="flex items-center justify-between">
                      <h2 className="font-medium">{p.name}</h2>
                      <span className="text-xs text-neutral-500">{p.city ?? ""}</span>
                    </div>
                    <p className="mt-1 text-sm text-neutral-600">
                      {p.status === "available" ? "Disponible" : "En proceso"}
                    </p>
                  </div>
                </article>
              </Link>
            );
          })
        )}
      </div>
    </main>
  );
}
