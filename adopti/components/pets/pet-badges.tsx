import { ENERGY_LABELS, STAGE_LABELS, type LifeStage, type EnergyLevel } from "@/lib/pets/tags";

export function PetBadges({ pet }: { pet: any }) {
  const badges: string[] = [];

  if (pet.vaccinated === true) badges.push("Vacunada");
  if (pet.neutered === true) badges.push("Castrada");
  if (pet.apartment_ok === true) badges.push("Depto ok");
  if (pet.special_needs === true) badges.push("Cuidados");

  if (pet.life_stage && pet.life_stage in STAGE_LABELS) {
    badges.push(STAGE_LABELS[pet.life_stage as LifeStage]);
  }
  if (pet.energy_level && pet.energy_level in ENERGY_LABELS) {
    badges.push(ENERGY_LABELS[pet.energy_level as EnergyLevel]);
  }

  if (badges.length === 0) return null;

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {badges.slice(0, 4).map((b) => (
        <span key={b} className="rounded-full bg-[#FFF3EF] px-2.5 py-1 text-xs font-medium text-[#F47A5A]">
          {b}
        </span>
      ))}
    </div>
  );
}

