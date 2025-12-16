"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";
import { useSession } from "@/components/auth/session-provider";
import { useToast } from "@/components/ui/toast";
import type { EnergyLevel, LifeStage } from "@/lib/pets/tags";
import { TAG_LABELS, ENERGY_LABELS, STAGE_LABELS } from "@/lib/pets/tags";
import { motion, AnimatePresence } from "framer-motion";

function getMyLocation(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}

function TriToggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean | null;
  onChange: (v: boolean | null) => void;
}) {
  const getButtonClass = (buttonValue: boolean | null) => {
    const base = "px-3 py-2 rounded-xl text-sm border transition font-medium";
    if (value === buttonValue) {
      if (buttonValue === true) {
        return `${base} border-transparent bg-green-100 text-green-700`;
      } else if (buttonValue === false) {
        return `${base} border-transparent bg-gray-100 text-gray-600`;
      } else {
        return `${base} border-transparent bg-gray-50 text-gray-500`;
      }
    }
    return `${base} border-gray-200 bg-white text-gray-600 hover:bg-gray-50`;
  };

  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-gray-800">{label}</span>
      <div className="flex gap-2">
        <button type="button" className={getButtonClass(true)} onClick={() => onChange(true)}>
          Sí
        </button>
        <button type="button" className={getButtonClass(false)} onClick={() => onChange(false)}>
          No
        </button>
        <button type="button" className={getButtonClass(null)} onClick={() => onChange(null)}>
          No sé
        </button>
      </div>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string | null;
  onChange: (v: string | null) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <div className="mb-1 text-sm text-gray-700">{label}</div>
      <select
        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
      >
        <option value="">No informado</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function PublishPage() {
  const router = useRouter();
  const { user } = useSession();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoStatus, setGeoStatus] = useState<"idle" | "success" | "error">("idle");
  const [name, setName] = useState("");
  const [species, setSpecies] = useState<"dog" | "cat" | "other" | "">("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [additionalInfoOpen, setAdditionalInfoOpen] = useState(true);

  // Tags
  const [vaccinated, setVaccinated] = useState<boolean | null>(null);
  const [dewormed, setDewormed] = useState<boolean | null>(null);
  const [neutered, setNeutered] = useState<boolean | null>(null);
  const [good_with_dogs, setGoodWithDogs] = useState<boolean | null>(null);
  const [good_with_cats, setGoodWithCats] = useState<boolean | null>(null);
  const [good_with_kids, setGoodWithKids] = useState<boolean | null>(null);
  const [apartment_ok, setApartmentOk] = useState<boolean | null>(null);
  const [special_needs, setSpecialNeeds] = useState<boolean | null>(null);
  const [energy_level, setEnergyLevel] = useState<EnergyLevel | null>(null);
  const [life_stage, setLifeStage] = useState<LifeStage | null>(null);

  // Autosave to localStorage
  useEffect(() => {
    const saved = localStorage.getItem("publish_draft");
    if (saved) {
      try {
        const draft = JSON.parse(saved);
        if (draft.name) setName(draft.name);
        if (draft.species) setSpecies(draft.species);
        if (draft.category) setCategory(draft.category);
        if (draft.city) setCity(draft.city);
        if (draft.description) setDescription(draft.description);
        if (draft.lat) setLat(draft.lat);
        if (draft.lng) setLng(draft.lng);
      } catch (e) {
        console.error("Error loading draft:", e);
      }
    }
  }, []);

  useEffect(() => {
    const draft = {
      name,
      species,
      category,
      city,
      description,
      lat,
      lng,
    };
    localStorage.setItem("publish_draft", JSON.stringify(draft));
  }, [name, species, category, city, description, lat, lng]);

  if (!user) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-4 px-4 pb-24">
        <p className="text-center text-sm text-gray-600">Debes iniciar sesión para publicar</p>
        <Link href="/login" className="text-center text-sm font-semibold text-brand underline">
          Iniciar sesión
        </Link>
      </main>
    );
  }

  const handleUseLocation = async () => {
    setGeoLoading(true);
    setGeoStatus("idle");
    try {
      const { lat: userLat, lng: userLng } = await getMyLocation();
      setLat(userLat);
      setLng(userLng);
      setGeoStatus("success");
      toast({ title: "Ubicación obtenida", variant: "success" });
    } catch (err: any) {
      setGeoStatus("error");
      toast({ title: err.message || "No se pudo obtener la ubicación", variant: "error" });
    } finally {
      setGeoLoading(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
    // Limpiar el input file
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar usuario antes de continuar
    if (!user) {
      toast({ title: "Debes iniciar sesión para publicar", variant: "error" });
      router.push("/login");
      return;
    }

    if (!name || !species || !city || !description) {
      toast({ title: "Completa todos los campos", variant: "error" });
      return;
    }
    if (!lat || !lng) {
      toast({ title: "Usa tu ubicación o ingresa coordenadas", variant: "error" });
      return;
    }

    setLoading(true);
    try {
      // 1. Obtener usuario autenticado directamente de Supabase
      const {
        data: { user: authUser },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !authUser) {
        throw new Error("Usuario no autenticado. Por favor, inicia sesión nuevamente.");
      }

      // 2. Crear mascota con owner_user_id = auth.uid()
      const insertData: any = {
        owner_user_id: authUser.id,
        name,
        species,
        city,
        description,
        lat,
        lng,
        published: true,
        status: "available",
        vaccinated,
        dewormed,
        neutered,
        good_with_dogs,
        good_with_cats,
        good_with_kids,
        apartment_ok,
        special_needs,
        energy_level,
        life_stage,
      };

      // Agregar category solo si species es "other" y category tiene valor
      if (species === "other" && category.trim()) {
        insertData.category = category.trim();
      }

      const { data: pet, error: petError } = await supabase
        .from("pets")
        .insert(insertData)
        .select("id")
        .single();

      if (petError) {
        console.error("Error RLS:", petError);
        // Mensaje más claro para errores de RLS
        if (petError.code === "42501" || petError.message.includes("row-level security")) {
          throw new Error("No tienes permiso para crear mascotas. Verifica tu sesión.");
        }
        throw new Error(petError.message || "Error al crear la mascota");
      }
      if (!pet) throw new Error("No se creó la mascota");

      // 2. Subir foto si hay
      if (photo) {
        // Debug: Verificar autenticación antes del upload
        const { data: userRes } = await supabase.auth.getUser();
        const user = userRes.user;
        
        console.log("user:", user?.id);
        if (!user) throw new Error("No autenticado al subir foto");

        const filePath = `pets/${user.id}/${pet.id}/${crypto.randomUUID()}.jpg`;
        console.log("upload path:", filePath);

        // Upload a storage
        const up = await supabase.storage.from("pet-photos").upload(filePath, photo, { upsert: false });
        console.log("upload result:", up);
        if (up.error) {
          console.error("Error uploading photo:", up.error);
          throw new Error(up.error.message || "Error al subir la foto");
        }

        // Insert en pet_photos
        const ins = await supabase.from("pet_photos").insert({
          pet_id: pet.id,
          path: filePath,
          sort: 0,
        }).select().single();
        console.log("insert pet_photos:", ins);
        if (ins.error) {
          console.error("Error inserting photo record:", ins.error);
          // Si falla la inserción, intentamos eliminar el archivo subido
          await supabase.storage.from("pet-photos").remove([filePath]);
          
          // Mensaje más específico para errores de RLS
          if (ins.error.code === "42501" || ins.error.message.includes("row-level security")) {
            throw new Error("Error de permisos al guardar la foto. Verifica que tengas permisos para esta mascota.");
          }
          throw new Error(ins.error.message || "Error al guardar la información de la foto");
        }
      }

      // Limpiar draft al publicar
      localStorage.removeItem("publish_draft");
      toast({ title: "Mascota publicada", variant: "success" });
      router.push(`/pets/${pet.id}`);
    } catch (err: any) {
      toast({ title: err.message || "Error al publicar", variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 md:px-6 pb-24">
      <div className="mt-6 mb-6">
        <p className="text-sm text-gray-500">Publicar</p>
        <h1 className="text-2xl font-semibold text-gray-900">Nueva mascota</h1>
        <p className="text-sm text-gray-600">Completa los datos para encontrarle un hogar</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white/80 p-4 shadow-sm">
          <label className="mb-3 block text-sm font-medium text-gray-700">
            Nombre *
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
              placeholder="Ej: Max"
            />
          </label>

          <label className="mb-3 block text-sm font-medium text-gray-700">
            Especie *
            <select
              value={species}
              onChange={(e) => setSpecies(e.target.value as "dog" | "cat" | "other")}
              required
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
            >
              <option value="">Selecciona</option>
              <option value="dog">Perro</option>
              <option value="cat">Gato</option>
              <option value="other">Otro</option>
            </select>
          </label>

          {species === "other" && (
            <label className="mb-3 block text-sm font-medium text-gray-700">
              Categoría
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
                placeholder="Ej: Conejo, Hámster, etc."
              />
            </label>
          )}

          <label className="mb-3 block text-sm font-medium text-gray-700">
            Ciudad *
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
              placeholder="Ej: Asunción"
            />
          </label>

          <label className="mb-3 block text-sm font-medium text-gray-700">
            Descripción *
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
              placeholder="Cuéntanos sobre la mascota..."
            />
          </label>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white/80 p-4 shadow-sm">
          <p className="mb-2 text-sm font-medium text-gray-700">Ubicación *</p>
          <button
            type="button"
            onClick={handleUseLocation}
            disabled={geoLoading}
            className="mb-3 w-full rounded-xl border border-gray-900 bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {geoLoading ? (
              <>
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Obteniendo ubicación...
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Usar mi ubicación
              </>
            )}
          </button>
          {geoStatus === "success" && lat && lng && (
            <p className="text-xs text-green-600 font-medium">
              ✓ Ubicación detectada
            </p>
          )}
          {geoStatus === "error" && (
            <p className="text-xs text-red-600">
              No pudimos obtener tu ubicación. Intenta nuevamente o ingresa coordenadas manualmente.
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white/80 p-4 shadow-sm">
          <button
            type="button"
            onClick={() => setAdditionalInfoOpen(!additionalInfoOpen)}
            className="flex w-full items-center justify-between text-left"
          >
            <p className="text-sm font-semibold text-gray-800">Información adicional (opcional)</p>
            <svg
              className={`h-5 w-5 text-gray-500 transition-transform ${additionalInfoOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <AnimatePresence>
            {additionalInfoOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-3 space-y-3">
                  <TriToggle label={TAG_LABELS.vaccinated} value={vaccinated} onChange={setVaccinated} />
                  <TriToggle label={TAG_LABELS.dewormed} value={dewormed} onChange={setDewormed} />
                  <TriToggle label={TAG_LABELS.neutered} value={neutered} onChange={setNeutered} />
                  <TriToggle label={TAG_LABELS.good_with_dogs} value={good_with_dogs} onChange={setGoodWithDogs} />
                  <TriToggle label={TAG_LABELS.good_with_cats} value={good_with_cats} onChange={setGoodWithCats} />
                  <TriToggle label={TAG_LABELS.good_with_kids} value={good_with_kids} onChange={setGoodWithKids} />
                  <TriToggle label={TAG_LABELS.apartment_ok} value={apartment_ok} onChange={setApartmentOk} />
                  <TriToggle label={TAG_LABELS.special_needs} value={special_needs} onChange={setSpecialNeeds} />
                </div>
                <div className="mt-4 space-y-3">
                  <Select
                    label="Etapa de vida"
                    value={life_stage}
                    onChange={(v) => setLifeStage(v as LifeStage | null)}
                    options={Object.entries(STAGE_LABELS).map(([value, label]) => ({ value, label }))}
                  />
                  <Select
                    label="Nivel de energía"
                    value={energy_level}
                    onChange={(v) => setEnergyLevel(v as EnergyLevel | null)}
                    options={Object.entries(ENERGY_LABELS).map(([value, label]) => ({ value, label }))}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white/80 p-4 shadow-sm">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Foto principal (opcional)
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
            />
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Las mascotas con foto reciben muchas más postulaciones
          </p>
          {photoPreview && (
            <div className="mt-2 relative inline-block">
              <div className="aspect-square w-32 overflow-hidden rounded-xl border">
                <Image src={photoPreview} alt="Preview" width={128} height={128} className="h-full w-full object-cover" />
              </div>
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1.5 text-white shadow-lg hover:bg-red-600 transition"
                title="Eliminar foto"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[#F47A5A] px-4 py-3 text-base font-semibold text-white transition active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Publicando…
            </>
          ) : (
            "Publicar mascota"
          )}
        </button>
      </form>

        {/* Preview - siempre visible en desktop, condicional en mobile */}
        <div className={`lg:sticky lg:top-6 lg:self-start ${(name || city || description || photoPreview) ? "" : "hidden lg:block"}`}>
          <div className="rounded-2xl border border-gray-200 bg-white/80 p-4 shadow-sm">
            <p className="mb-3 text-sm font-semibold text-gray-800">Vista previa</p>
            <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
              {photoPreview ? (
                <div className="aspect-square w-full overflow-hidden">
                  <Image src={photoPreview} alt={name || "Preview"} width={400} height={400} className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="aspect-square w-full bg-gradient-to-br from-gray-50 via-gray-50/50 to-gray-100 flex flex-col items-center justify-center gap-2">
                  <svg className="h-16 w-16 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                  <span className="text-xs font-medium text-gray-400">Sin foto</span>
                </div>
              )}
              <div className="px-3 pb-3 pt-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-semibold text-gray-900">
                    {name || "Nombre de la mascota"}
                  </h3>
                  {city && (
                    <div className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0">
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{city}</span>
                    </div>
                  )}
                </div>
                {description ? (
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">{description}</p>
                ) : (
                  <p className="mt-2 text-sm text-gray-400 italic">La descripción aparecerá aquí</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
