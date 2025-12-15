import Link from "next/link";
import { supabase } from "@/lib/supabase/server";
import ApplyCta from "@/components/pets/apply-cta";

export default async function PetPage({ params }: { params: { id: string } }) {
  const { data: pet } = await supabase
    .from("pets")
    .select("id,name,city,description,status,pet_photos(path,sort)")
    .eq("id", params.id)
    .single();

  if (!pet) return <div className="p-4">No existe</div>;

  const photo = (pet.pet_photos || []).sort((a: any, b: any) => a.sort - b.sort)[0];
  const url = photo
    ? supabase.storage.from("pet-photos").getPublicUrl(photo.path).data.publicUrl
    : null;

  return (
    <main className="min-h-screen p-4">
      <Link href="/" className="mb-4 inline-block text-sm text-neutral-600 underline">
        ← Volver
      </Link>

      <div className="mx-auto max-w-2xl">
        <div className="overflow-hidden rounded-2xl border">
          <div className="aspect-square bg-neutral-100">
            {url ? (
              <img src={url} alt={pet.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-neutral-500">
                Sin foto
              </div>
            )}
          </div>
          <div className="p-4">
            <h1 className="text-2xl font-semibold">{pet.name}</h1>
            <p className="text-sm text-neutral-500">{pet.city ?? ""}</p>
            <p className="mt-3 text-neutral-700">{pet.description}</p>
          </div>
        </div>

        <ApplyCta petId={pet.id} />
      </div>
    </main>
  );
}


