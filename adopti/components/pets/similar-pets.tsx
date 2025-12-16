"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import SaveButton from "./save-button";

type Pet = {
  id: string;
  name: string;
  city: string | null;
  status: string;
  pet_photos: { path: string; sort: number }[];
};

export default function SimilarPets({ currentPetId, city, species }: { currentPetId: string; city: string | null; species: string | null }) {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSimilar = async () => {
      setLoading(true);
      let query = supabase
        .from("pets")
        .select("id,name,city,status,pet_photos(path,sort)")
        .eq("published", true)
        .eq("status", "available")
        .neq("id", currentPetId)
        .limit(4);

      if (city) {
        query = query.ilike("city", `%${city}%`);
      }

      if (species) {
        query = query.eq("species", species);
      }

      query = query.order("created_at", { ascending: false });

      const { data, error } = await query;

      if (!error && data) {
        setPets((data as any) ?? []);
      }
      setLoading(false);
    };

    loadSimilar();
  }, [currentPetId, city, species]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white/80 p-4">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Mascotas similares</h2>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-3 rounded-xl border border-gray-200 bg-white p-3">
              <div className="h-16 w-16 rounded-lg bg-gray-200 animate-pulse flex-shrink-0" />
              <div className="flex-1">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (pets.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white/80 p-4 lg:sticky lg:top-6">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Mascotas similares</h2>
      <div className="overflow-x-auto lg:overflow-visible -mx-4 px-4 lg:mx-0 lg:px-0">
        <div className="flex gap-3 lg:flex-col lg:gap-3 min-w-max lg:min-w-0">
          {pets.map((pet) => {
            const photo = (pet.pet_photos || []).sort((a, b) => a.sort - b.sort)[0];
            const url = photo
              ? supabase.storage.from("pet-photos").getPublicUrl(photo.path).data.publicUrl
              : null;

            return (
              <motion.div
                key={pet.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-shrink-0 lg:flex-shrink w-48 lg:w-full"
              >
                <Link
                  href={`/pets/${pet.id}`}
                  className="group flex gap-3 rounded-xl border border-gray-200 bg-white p-3 transition hover:border-[#F47A5A] hover:shadow-sm"
                >
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    {url ? (
                      <img src={url} alt={pet.name} className="h-full w-full object-cover transition group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <svg className="h-8 w-8 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <SaveButton petId={pet.id} size="sm" className="bg-white/95 backdrop-blur-sm shadow-sm" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate group-hover:text-[#F47A5A] transition">
                      {pet.name}
                    </h3>
                    {pet.city && (
                      <p className="text-xs text-gray-500 truncate">{pet.city}</p>
                    )}
                    <span className="mt-1 inline-block rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-700">
                      Disponible
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

