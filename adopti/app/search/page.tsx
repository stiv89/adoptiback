"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { useSession } from "@/components/auth/session-provider";
import SaveButton from "@/components/pets/save-button";
import { PetBadges } from "@/components/pets/pet-badges";

type Pet = {
  id: string;
  name: string;
  city: string | null;
  status: string;
  species: string;
  pet_photos: { path: string; sort: number }[];
  vaccinated: boolean | null;
  dewormed: boolean | null;
  neutered: boolean | null;
  good_with_dogs: boolean | null;
  good_with_cats: boolean | null;
  good_with_kids: boolean | null;
  apartment_ok: boolean | null;
  special_needs: boolean | null;
  energy_level: string | null;
  life_stage: string | null;
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

export default function SearchPage() {
  const { user } = useSession();
  const [city, setCity] = useState("");
  const [species, setSpecies] = useState("");
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [savedSet, setSavedSet] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadSaves = async () => {
      if (!user) {
        setSavedSet(new Set());
        return;
      }

      const { data } = await supabase.from("pet_saves").select("pet_id").eq("user_id", user.id);
      if (data) {
        setSavedSet(new Set(data.map((s) => s.pet_id)));
      }
    };

    loadSaves();
  }, [user]);

  const handleSearch = async () => {
    setLoading(true);
    setSearched(true);

    let query = supabase
      .from("pets")
      .select(`
        id,name,city,status,species,published,
        vaccinated,dewormed,neutered,
        good_with_dogs,good_with_cats,good_with_kids,
        apartment_ok,special_needs,energy_level,life_stage,
        pet_photos(path,sort)
      `)
      .eq("published", true)
      .neq("status", "hidden");

    if (city.trim()) {
      query = query.ilike("city", `%${city.trim()}%`);
    }

    if (species) {
      query = query.eq("species", species);
    }

    query = query.order("created_at", { ascending: false }).limit(50);

    const { data, error } = await query;

    if (error) {
      console.error(error);
      setPets([]);
    } else {
      setPets((data as any) ?? []);
    }

    setLoading(false);
  };

  const filteredPets = useMemo(() => {
    return pets;
  }, [pets]);

  const hasFilters = city.trim() || species;

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-4 px-4 md:px-6 pb-24">
      <div className="mt-6">
        <p className="text-sm text-gray-500">Buscar</p>
        <h1 className="text-2xl font-semibold text-gray-900">Filtra mascotas</h1>
        <p className="text-sm text-gray-600 mt-1">Ciudad y especie (perro/gato) por ahora.</p>
      </div>

      <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white/80 p-4 shadow-sm md:grid-cols-2">
        <label className="text-sm font-medium text-gray-700">
          Ciudad
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && hasFilters) {
                handleSearch();
              }
            }}
            placeholder="Ej: Asunción"
            className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2 focus:border-brand transition"
          />
        </label>
        <label className="text-sm font-medium text-gray-700">
          Especie
          <select
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2 focus:border-brand transition"
          >
            <option value="">Todas</option>
            <option value="dog">Perro</option>
            <option value="cat">Gato</option>
          </select>
        </label>
      </div>

      <button
        onClick={handleSearch}
        disabled={loading || !hasFilters}
        className="w-full rounded-xl bg-[#F47A5A] py-3 text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Buscando…
          </>
        ) : (
          "Buscar"
        )}
      </button>

      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-6 mt-4">
          {[...Array(8)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : searched && filteredPets.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white/80 p-8 text-center mt-4">
          <div className="mb-3 text-4xl">🔍</div>
          <p className="text-sm font-medium text-gray-900 mb-1">No se encontraron mascotas</p>
          <p className="text-xs text-gray-500">Prueba ajustar los filtros de ciudad o especie</p>
        </div>
      ) : searched && filteredPets.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-6 mt-4">
          {filteredPets.map((p) => {
            const photo = (p.pet_photos || []).sort((a, b) => a.sort - b.sort)[0];
            const url = photo
              ? supabase.storage.from("pet-photos").getPublicUrl(photo.path).data.publicUrl
              : null;

            return (
              <motion.article
                key={p.id}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white cursor-pointer"
              >
                <Link href={`/pets/${p.id}`}>
                  {url ? (
                    <div className="aspect-square w-full overflow-hidden">
                      <motion.img
                        src={url}
                        alt={p.name}
                        className="h-full w-full object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      />
                    </div>
                  ) : (
                    <div className="aspect-[4/3] w-full bg-gradient-to-br from-gray-50 via-gray-50/50 to-gray-100 flex flex-col items-center justify-center gap-2">
                      <motion.svg
                        className="h-16 w-16 text-gray-300"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </motion.svg>
                      <span className="text-xs font-medium text-gray-400">Sin foto</span>
                    </div>
                  )}

                  <div className="px-3 pb-3 pt-2">
                    <div className="flex items-start justify-between gap-2">
                      <motion.h2
                        className="text-base font-semibold text-gray-900 leading-tight"
                        whileHover={{ x: 2 }}
                        transition={{ duration: 0.2 }}
                      >
                        {p.name}
                      </motion.h2>
                      {p.city && (
                        <div className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0">
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{p.city}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-1.5">
                      {p.status === "available" ? (
                        <motion.span
                          className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-700"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        >
                          Disponible
                        </motion.span>
                      ) : (
                        <span className="text-xs text-gray-500">En proceso</span>
                      )}
                    </div>
                    <PetBadges pet={p} />
                  </div>
                </Link>
                <motion.div
                  className="absolute right-2 top-2 z-10"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <SaveButton petId={p.id} size="md" className="bg-white/95 backdrop-blur-sm shadow-sm" />
                </motion.div>
              </motion.article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white/80 p-8 text-center mt-4">
          <div className="mb-3 text-4xl">🐾</div>
          <p className="text-sm font-medium text-gray-900 mb-1">Los resultados aparecerán aquí</p>
          <p className="text-xs text-gray-500">Usa los filtros arriba y presiona "Buscar" para encontrar mascotas</p>
        </div>
      )}
    </main>
  );
}

