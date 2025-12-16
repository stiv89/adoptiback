"use client";

import { useEffect, useState, useMemo } from "react";
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
  const { user } = useSession();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedSet, setSavedSet] = useState<Set<string>>(new Set());
  const [cityFilter, setCityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "available" | "in_process">("");
  const [onlyWithPhoto, setOnlyWithPhoto] = useState(false);
  const [nearbyMode, setNearbyMode] = useState(false);
  const [nearbyLoading, setNearbyLoading] = useState(false);

  const loadPets = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("pets")
      .select(`
        id,name,city,status,published,
        vaccinated,dewormed,neutered,
        good_with_dogs,good_with_cats,good_with_kids,
        apartment_ok,special_needs,energy_level,life_stage,
        pet_photos(path,sort)
      `)
      .eq("published", true)
      .neq("status", "hidden")
      .order("created_at", { ascending: false })
      .limit(30);

    if (!error && data) setPets(data as any);
    if (error) console.error(error);
    setLoading(false);
  };

  useEffect(() => {
    if (!nearbyMode) {
      loadPets();
    }
  }, [nearbyMode]);

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

  const handleNearby = async () => {
    // Si ya está activo, desactivarlo
    if (nearbyMode) {
      setNearbyMode(false);
      loadPets();
      return;
    }

    setNearbyLoading(true);
    try {
      const { coords } = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
        });
      });

      const { data, error } = await supabase.rpc("nearby_pets", {
        user_lat: coords.latitude,
        user_lng: coords.longitude,
        radius_km: 10,
      });

      if (error) throw error;
      if (data) {
        setPets(data as any);
        setNearbyMode(true);
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "No se pudo obtener mascotas cercanas");
    } finally {
      setNearbyLoading(false);
    }
  };

  const filteredPets = useMemo(() => {
    return pets.filter((p) => {
      if (statusFilter && p.status !== statusFilter) return false;
      if (onlyWithPhoto && !(p.pet_photos || []).length) return false;
      if (cityFilter && !`${p.city ?? ""}`.toLowerCase().includes(cityFilter.toLowerCase())) return false;
      return true;
    });
  }, [pets, statusFilter, onlyWithPhoto, cityFilter]);

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Explorar</h1>
          <p className="text-sm text-gray-500 mt-1">Perros y gatos buscando hogar</p>
        </div>

        {!nearbyMode && (
          <div className="mb-6 rounded-xl border border-gray-200 bg-[#FFF3EF] p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 text-[#F47A5A] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-gray-900">Activa "Cerca de mí" para ver mascotas próximas</p>
                <p className="text-xs text-gray-600">Encuentra mascotas cerca de tu ubicación</p>
              </div>
            </div>
            <button
              onClick={handleNearby}
              disabled={nearbyLoading}
              className="rounded-lg bg-[#F47A5A] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#e96a4b] active:scale-95 disabled:opacity-60 whitespace-nowrap"
            >
              {nearbyLoading ? "Cargando..." : "Permitir ubicación"}
            </button>
          </div>
        )}

        <div className="flex justify-center mb-6">
          <div className="relative flex items-center gap-2 overflow-x-auto rounded-full bg-white border border-gray-200 p-2 text-xs font-medium shadow-sm">
          <button
            onClick={handleNearby}
            disabled={nearbyLoading}
            className="relative rounded-full px-3 py-1.5 transition disabled:opacity-60 flex items-center gap-1.5"
          >
            {nearbyMode && (
              <motion.span
                layoutId="filter-active-brand"
                className="absolute inset-0 rounded-full bg-[#F47A5A]"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className={`relative z-10 flex items-center gap-1.5 ${nearbyMode ? "!text-white font-semibold" : "text-gray-700 hover:text-brand"}`}>
              {nearbyLoading ? (
                <>
                  <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Cargando...
                </>
              ) : (
                <>
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Cerca de mí
                </>
              )}
            </span>
          </button>
          <button
            onClick={() => {
              setStatusFilter("");
              if (nearbyMode) {
                setNearbyMode(false);
                loadPets();
              }
            }}
            className="relative rounded-full px-3 py-1.5 transition"
          >
            {statusFilter === "" && !nearbyMode && (
              <motion.span
                layoutId="filter-todas"
                className="absolute inset-0 rounded-full bg-[#FFF3EF] shadow-sm"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className={`relative z-10 ${statusFilter === "" && !nearbyMode ? "text-[#F47A5A] font-semibold" : "text-gray-700 hover:text-gray-900"}`}>
              Todas
            </span>
          </button>
          <button
            onClick={() => setStatusFilter("available")}
            className="relative rounded-full px-3 py-1.5 transition"
          >
            {statusFilter === "available" && (
              <motion.span
                layoutId="filter-disponibles"
                className="absolute inset-0 rounded-full bg-[#FFF3EF] shadow-sm"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className={`relative z-10 ${statusFilter === "available" ? "text-[#F47A5A] font-semibold" : "text-gray-700 hover:text-gray-900"}`}>
              Disponibles
            </span>
          </button>
          <button
            onClick={() => setStatusFilter("in_process")}
            className="relative rounded-full px-3 py-1.5 transition"
          >
            {statusFilter === "in_process" && (
              <motion.span
                layoutId="filter-en-proceso"
                className="absolute inset-0 rounded-full bg-[#FFF3EF] shadow-sm"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className={`relative z-10 ${statusFilter === "in_process" ? "text-[#F47A5A] font-semibold" : "text-gray-700 hover:text-gray-900"}`}>
              En proceso
            </span>
          </button>
          <button
            onClick={() => setOnlyWithPhoto((v) => !v)}
            className="relative rounded-full px-3 py-1.5 transition"
          >
            {onlyWithPhoto && (
              <motion.span
                layoutId="filter-con-foto"
                className="absolute inset-0 rounded-full bg-[#FFF3EF] shadow-sm"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className={`relative z-10 ${onlyWithPhoto ? "text-[#F47A5A] font-semibold" : "text-gray-700 hover:text-gray-900"}`}>
              Con foto
            </span>
          </button>
          <input
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            placeholder="Ciudad"
            className="min-w-[120px] rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 outline-none ring-brand/30 focus:ring-2"
          />
        </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-6">
        {loading ? (
          <>
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </>
        ) : filteredPets.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed bg-white/80 p-8 text-center text-neutral-600">
            <div className="mb-2 text-3xl">🐾</div>
            <p className="text-sm font-medium">Aún no hay mascotas con estos filtros</p>
            <p className="text-xs text-neutral-500 mt-1">Prueba ajustar ciudad o estado</p>
          </div>
        ) : (
          filteredPets.map((p) => {
            // Ordenar y tomar la primera (sort menor = portada)
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
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
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
          })
        )}
        </div>
      </div>
    </main>
  );
}
