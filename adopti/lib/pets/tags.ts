export type EnergyLevel = "low" | "medium" | "high";
export type LifeStage = "puppy" | "young" | "adult" | "senior";

export type PetTags = {
  vaccinated: boolean | null;
  dewormed: boolean | null;
  neutered: boolean | null;
  good_with_dogs: boolean | null;
  good_with_cats: boolean | null;
  good_with_kids: boolean | null;
  apartment_ok: boolean | null;
  special_needs: boolean | null;
  energy_level: EnergyLevel | null;
  life_stage: LifeStage | null;
};

export const TAG_LABELS: Record<keyof Omit<PetTags, "energy_level" | "life_stage">, string> = {
  vaccinated: "Vacunada",
  dewormed: "Desparasitada",
  neutered: "Castrada",
  good_with_dogs: "Se lleva con perros",
  good_with_cats: "Se lleva con gatos",
  good_with_kids: "Apta para niños",
  apartment_ok: "Apta departamento",
  special_needs: "Cuidados especiales",
};

export const ENERGY_LABELS: Record<EnergyLevel, string> = {
  low: "Energía baja",
  medium: "Energía media",
  high: "Energía alta",
};

export const STAGE_LABELS: Record<LifeStage, string> = {
  puppy: "Cachorro",
  young: "Joven",
  adult: "Adulto",
  senior: "Senior",
};

