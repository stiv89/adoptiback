"use client";

import { useState } from "react";

export default function SearchPage() {
  const [city, setCity] = useState("");
  const [species, setSpecies] = useState("");

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-4 px-4 pb-24">
      <div className="mt-6">
        <p className="text-sm text-neutral-500">Buscar</p>
        <h1 className="text-2xl font-semibold">Filtra mascotas</h1>
        <p className="text-sm text-neutral-600">Ciudad y especie (perro/gato) por ahora.</p>
      </div>

      <div className="grid gap-3 rounded-2xl border bg-white/80 p-4 md:grid-cols-2">
        <label className="text-sm font-medium text-neutral-700">
          Ciudad
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Ej: Buenos Aires"
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
          />
        </label>
        <label className="text-sm font-medium text-neutral-700">
          Especie
          <select
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
          >
            <option value="">Todas</option>
            <option value="dog">Perro</option>
            <option value="cat">Gato</option>
          </select>
        </label>
      </div>

      <div className="rounded-2xl border border-dashed bg-white/80 p-6 text-sm text-neutral-600">
        Próximamente: resultados filtrados del feed usando estos parámetros.
      </div>
    </main>
  );
}

