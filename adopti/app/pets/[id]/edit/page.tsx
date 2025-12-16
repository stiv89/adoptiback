"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";
import { useSession } from "@/components/auth/session-provider";
import { useToast } from "@/components/ui/toast";
import type { EnergyLevel, LifeStage } from "@/lib/pets/tags";
import { TAG_LABELS, ENERGY_LABELS, STAGE_LABELS } from "@/lib/pets/tags";

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
  const btn = (active: boolean) =>
    `px-3 py-2 rounded-xl text-sm border transition ${
      active ? "border-transparent bg-[#F47A5A] text-white" : "border-gray-200 bg-white text-gray-700"
    }`;

  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-gray-800">{label}</span>
      <div className="flex gap-2">
        <button type="button" className={btn(value === true)} onClick={() => onChange(true)}>
          Sí
        </button>
        <button type="button" className={btn(value === false)} onClick={() => onChange(false)}>
          No
        </button>
        <button type="button" className={btn(value === null)} onClick={() => onChange(null)}>
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

export default function EditPetPage() {
  const router = useRouter();
  const params = useParams();
  const petId = params.id as string;
  const { user } = useSession();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [name, setName] = useState("");
  const [species, setSpecies] = useState<"dog" | "cat" | "">("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [isOwner, setIsOwner] = useState(false);

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
  
  // Fotos
  const [existingPhotos, setExistingPhotos] = useState<Array<{ id: string; path: string; sort: number }>>([]);
  const [newPhoto, setNewPhoto] = useState<File | null>(null);
  const [newPhotoPreview, setNewPhotoPreview] = useState<string | null>(null);
  const [deletingPhotoId, setDeletingPhotoId] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: pet, error } = await supabase
        .from("pets")
        .select("*, pet_photos(id, path, sort)")
        .eq("id", petId)
        .single();
      if (error || !pet) {
        toast({ title: "Mascota no encontrada", variant: "error" });
        router.push("/");
        return;
      }
      if (pet.owner_user_id !== user?.id) {
        toast({ title: "No tienes permiso para editar", variant: "error" });
        router.push(`/pets/${petId}`);
        return;
      }
      setName(pet.name || "");
      setSpecies((pet.species as "dog" | "cat") || "");
      setCity(pet.city || "");
      setDescription(pet.description || "");
      setLat(pet.lat);
      setLng(pet.lng);
      setVaccinated(pet.vaccinated ?? null);
      setDewormed(pet.dewormed ?? null);
      setNeutered(pet.neutered ?? null);
      setGoodWithDogs(pet.good_with_dogs ?? null);
      setGoodWithCats(pet.good_with_cats ?? null);
      setGoodWithKids(pet.good_with_kids ?? null);
      setApartmentOk(pet.apartment_ok ?? null);
      setSpecialNeeds(pet.special_needs ?? null);
      setEnergyLevel(pet.energy_level ?? null);
      setLifeStage(pet.life_stage ?? null);
      
      // Cargar fotos existentes
      if (pet.pet_photos && Array.isArray(pet.pet_photos)) {
        setExistingPhotos(pet.pet_photos.sort((a: any, b: any) => a.sort - b.sort));
      }
      
      setIsOwner(true);
      setLoading(false);
    })();
  }, [petId, user, router, toast]);

  const handleUseLocation = async () => {
    setGeoLoading(true);
    try {
      const { lat: userLat, lng: userLng } = await getMyLocation();
      setLat(userLat);
      setLng(userLng);
      toast({ title: "Ubicación actualizada", variant: "success" });
    } catch (err: any) {
      toast({ title: err.message || "No se pudo obtener la ubicación", variant: "error" });
    } finally {
      setGeoLoading(false);
    }
  };

  const handleDeletePhoto = async (photoId: string, photoPath: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta foto?")) return;
    
    setDeletingPhotoId(photoId);
    try {
      // Eliminar de storage
      const { error: storageError } = await supabase.storage.from("pet-photos").remove([photoPath]);
      if (storageError) throw storageError;

      // Eliminar de la base de datos
      const { error: dbError } = await supabase.from("pet_photos").delete().eq("id", photoId);
      if (dbError) throw dbError;

      // Actualizar estado local
      setExistingPhotos(existingPhotos.filter(p => p.id !== photoId));
      toast({ title: "Foto eliminada", variant: "success" });
    } catch (err: any) {
      toast({ title: err.message || "Error al eliminar foto", variant: "error" });
    } finally {
      setDeletingPhotoId(null);
    }
  };

  const handleNewPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveNewPhoto = () => {
    setNewPhoto(null);
    setNewPhotoPreview(null);
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleUploadNewPhoto = async () => {
    if (!newPhoto || !user) return;

    setUploadingPhoto(true);
    try {
      // Verificar autenticación
      const { data: userRes } = await supabase.auth.getUser();
      const authUser = userRes.user;
      if (!authUser) throw new Error("No autenticado");

      const filePath = `pets/${authUser.id}/${petId}/${crypto.randomUUID()}.jpg`;
      
      // Upload a storage
      const { error: uploadError } = await supabase.storage.from("pet-photos").upload(filePath, newPhoto);
      if (uploadError) throw uploadError;

      // Insert en pet_photos
      const maxSort = existingPhotos.length > 0 ? Math.max(...existingPhotos.map(p => p.sort)) : -1;
      const { data: newPhotoData, error: insertError } = await supabase
        .from("pet_photos")
        .insert({
          pet_id: petId,
          path: filePath,
          sort: maxSort + 1,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Actualizar estado local
      setExistingPhotos([...existingPhotos, newPhotoData]);
      setNewPhoto(null);
      setNewPhotoPreview(null);
      toast({ title: "Foto agregada", variant: "success" });
    } catch (err: any) {
      toast({ title: err.message || "Error al subir foto", variant: "error" });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !species || !city || !description || !lat || !lng) {
      toast({ title: "Completa todos los campos", variant: "error" });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("pets")
        .update({
          name,
          species,
          city,
          description,
          lat,
          lng,
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
        })
        .eq("id", petId);

      if (error) throw error;
      toast({ title: "Mascota actualizada", variant: "success" });
      router.push(`/pets/${petId}`);
    } catch (err: any) {
      toast({ title: err.message || "Error al actualizar", variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-4 px-4 pb-24">
        <p className="text-center text-sm text-gray-600">Cargando...</p>
      </main>
    );
  }

  if (!isOwner) {
    return null;
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-4 px-4 pb-24">
      <div className="mt-6">
        <Link href={`/pets/${petId}`} className="mb-2 inline-block text-sm text-gray-600 underline">
          ← Volver
        </Link>
        <p className="text-sm text-gray-500">Editar</p>
        <h1 className="text-2xl font-semibold text-gray-900">Editar mascota</h1>
      </div>

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
            />
          </label>

          <label className="mb-3 block text-sm font-medium text-gray-700">
            Especie *
            <select
              value={species}
              onChange={(e) => setSpecies(e.target.value as "dog" | "cat")}
              required
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
            >
              <option value="">Selecciona</option>
              <option value="dog">Perro</option>
              <option value="cat">Gato</option>
            </select>
          </label>

          <label className="mb-3 block text-sm font-medium text-gray-700">
            Ciudad *
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
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
            />
          </label>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white/80 p-4 shadow-sm">
          <p className="mb-2 text-sm font-medium text-gray-700">Ubicación *</p>
          <button
            type="button"
            onClick={handleUseLocation}
            disabled={geoLoading}
            className="mb-3 w-full rounded-xl border border-gray-900 bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition active:scale-95 disabled:opacity-60"
          >
            {geoLoading ? "Obteniendo ubicación..." : "📍 Actualizar ubicación"}
          </button>
          {lat && lng && (
            <p className="text-xs text-gray-600">
              ✅ Ubicación: {lat.toFixed(4)}, {lng.toFixed(4)}
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white/80 p-4 shadow-sm">
          <p className="mb-3 text-sm font-semibold text-gray-800">Fotos</p>
          
          {/* Fotos existentes */}
          {existingPhotos.length > 0 && (
            <div className="mb-4 space-y-3">
              <p className="text-xs text-gray-600 mb-2">Fotos actuales:</p>
              <div className="grid grid-cols-2 gap-3">
                {existingPhotos.map((photo) => {
                  const photoUrl = supabase.storage.from("pet-photos").getPublicUrl(photo.path).data.publicUrl;
                  return (
                    <div key={photo.id} className="relative aspect-square overflow-hidden rounded-xl border">
                      <Image
                        src={photoUrl}
                        alt={`Foto ${photo.sort + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeletePhoto(photo.id, photo.path)}
                        disabled={deletingPhotoId === photo.id}
                        className="absolute top-2 right-2 rounded-full bg-red-500 p-1.5 text-white shadow-lg hover:bg-red-600 transition disabled:opacity-50"
                        title="Eliminar foto"
                      >
                        {deletingPhotoId === photo.id ? (
                          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Agregar nueva foto */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Agregar nueva foto
              <input
                type="file"
                accept="image/*"
                onChange={handleNewPhotoChange}
                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
              />
            </label>
            {newPhotoPreview && (
              <div className="mt-3 space-y-2">
                <div className="relative inline-block">
                  <div className="aspect-square w-32 overflow-hidden rounded-xl border">
                    <Image src={newPhotoPreview} alt="Nueva foto" width={128} height={128} className="h-full w-full object-cover" />
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveNewPhoto}
                    className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1.5 text-white shadow-lg hover:bg-red-600 transition"
                    title="Eliminar"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleUploadNewPhoto}
                  disabled={uploadingPhoto}
                  className="w-full rounded-xl border border-gray-900 bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition active:scale-95 disabled:opacity-60"
                >
                  {uploadingPhoto ? "Subiendo..." : "Subir foto"}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white/80 p-4 shadow-sm">
          <p className="mb-3 text-sm font-semibold text-gray-800">Información adicional</p>
          <div className="space-y-3">
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
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-xl border border-gray-900 bg-white px-4 py-3 text-base font-semibold text-gray-900 transition active:scale-95 disabled:opacity-60"
        >
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </main>
  );
}

