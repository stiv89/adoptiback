import Link from "next/link";
import { supabase } from "@/lib/supabase/server";
import ApplyCta from "@/components/pets/apply-cta";
import EditButton from "@/components/pets/edit-button";
import SaveButton from "@/components/pets/save-button";
import SimilarPets from "@/components/pets/similar-pets";
import { PetBadges } from "@/components/pets/pet-badges";

export default async function PetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: pet } = await supabase
    .from("pets")
    .select(`
      id,name,city,description,status,species,
      vaccinated,dewormed,neutered,
      good_with_dogs,good_with_cats,good_with_kids,
      apartment_ok,special_needs,energy_level,life_stage,
      pet_photos(path,sort)
    `)
    .eq("id", id)
    .single();

  if (!pet) return <div className="p-4">No existe</div>;

  const photo = (pet.pet_photos || []).sort((a: any, b: any) => a.sort - b.sort)[0];
  const url = photo
    ? supabase.storage.from("pet-photos").getPublicUrl(photo.path).data.publicUrl
    : null;

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 pb-24">
        <Link href="/" className="mb-4 mt-4 inline-block text-sm text-gray-600 hover:text-gray-900 transition">
          ← Volver
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contenido principal */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <div className="absolute right-4 top-4 z-10">
                <SaveButton petId={pet.id} size="lg" className="bg-white/95 backdrop-blur-sm shadow-md" />
              </div>
              <div className="aspect-square bg-gradient-to-br from-gray-50 via-gray-50/50 to-gray-100">
                {url ? (
                  <img src={url} alt={pet.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center flex-col gap-2">
                    <svg className="h-20 w-20 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-400">Sin foto</span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h1 className="text-3xl font-semibold text-gray-900">{pet.name}</h1>
                  {pet.status === "available" && (
                    <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                      Disponible
                    </span>
                  )}
                </div>
                {pet.city && (
                  <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{pet.city}</span>
                  </div>
                )}
                <PetBadges pet={pet} />
                {pet.description && (
                  <div className="mt-4">
                    <p className="text-base text-gray-700 leading-relaxed whitespace-pre-line">{pet.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* CTA Principal */}
            <ApplyCta petId={pet.id} />

            {/* Acciones secundarias */}
            <EditButton petId={pet.id} />
          </div>

          {/* Sidebar - Mascotas similares (desktop) */}
          <div className="hidden lg:block lg:col-span-1">
            <SimilarPets currentPetId={pet.id} city={pet.city} species={pet.species} />
          </div>
        </div>

        {/* Mascotas similares (mobile - debajo) */}
        <div className="lg:hidden mt-6">
          <SimilarPets currentPetId={pet.id} city={pet.city} species={pet.species} />
        </div>
      </div>
    </main>
  );
}


