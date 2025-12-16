"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/components/auth/session-provider";
import { supabase } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/toast";
import { motion } from "framer-motion";
import ConfirmPopover from "@/components/ui/confirm-popover";
import UserAvatar from "@/components/auth/user-avatar";

type Pet = {
  id: string;
  name: string;
  city: string | null;
  status: string;
  published: boolean;
  pet_photos: { path: string; sort: number }[];
};

type Application = {
  id: string;
  pet_id: string;
  status: string;
  created_at: string;
  pets: {
    id: string;
    name: string;
    city: string | null;
    species: string | null;
    pet_photos: { path: string; sort: number }[];
  };
};

const EditIcon = () => (
  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const PlusIcon = () => (
  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const ApplicationsIcon = () => (
  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

export default function MisCosasPage() {
  const { user, loading } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [pets, setPets] = useState<Pet[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [petsLoading, setPetsLoading] = useState(true);
  const [appsLoading, setAppsLoading] = useState(true);
  const [savedLoading, setSavedLoading] = useState(true);
  const [savedPets, setSavedPets] = useState<any[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingAppId, setDeletingAppId] = useState<string | null>(null);
  const [deletingSavedId, setDeletingSavedId] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [activeTab, setActiveTab] = useState<"applications" | "saved" | "pets">("applications");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) {
      setPetsLoading(false);
      setAppsLoading(false);
      return;
    }
    (async () => {
      const [petsRes, appsRes, savedRes] = await Promise.all([
        supabase
          .from("pets")
          .select("id,name,city,status,published,pet_photos(path,sort)")
          .eq("owner_user_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("applications")
          .select("id,pet_id,status,created_at,pets:pet_id(id,name,city,species,pet_photos(path,sort))")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("pet_saves")
          .select("created_at,pets(id,name,city,status,pet_photos(path,sort))")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
      ]);

      if (!petsRes.error && petsRes.data) setPets(petsRes.data as any);
      if (!appsRes.error && appsRes.data) setApplications(appsRes.data as any);
      if (!savedRes.error && savedRes.data) {
        setSavedPets(savedRes.data.map((s: any) => ({ ...s.pets, saved_at: s.created_at })));
      }
      setPetsLoading(false);
      setAppsLoading(false);
      setSavedLoading(false);
    })();
  }, [user]);

  if (loading) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-4 px-4 pb-24">
        <div className="mt-6">
          <div className="mb-4 flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-gray-200 animate-pulse" />
            <div className="flex-1">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {[...Array(3)].map((_, sectionIndex) => (
            <div key={sectionIndex} className="rounded-2xl border bg-white/80 p-4">
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="space-y-3">
                {[...Array(2)].map((_, cardIndex) => (
                  <div key={cardIndex} className="flex gap-3 rounded-xl border border-gray-200 bg-white p-3">
                    <div className="h-16 w-16 rounded-lg bg-gray-200 animate-pulse flex-shrink-0" />
                    <div className="flex-1">
                      <div className="h-5 w-24 bg-gray-200 rounded animate-pulse mb-2" />
                      <div className="h-3 w-20 bg-gray-200 rounded animate-pulse mb-2" />
                      <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse" />
                    </div>
                    <div className="h-8 w-8 rounded-lg bg-gray-200 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  const handleDeletePet = async (petId: string) => {
    setDeletingId(petId);
    try {
      const { error } = await supabase.from("pets").delete().eq("id", petId);
      if (error) throw error;
      setPets((prev) => prev.filter((p) => p.id !== petId));
      toast({ title: "Mascota eliminada", variant: "success" });
    } catch (err: any) {
      toast({ title: err.message || "Error al eliminar", variant: "error" });
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteApp = async (appId: string) => {
    setDeletingAppId(appId);
    try {
      const { error } = await supabase.from("applications").delete().eq("id", appId);
      if (error) throw error;
      setApplications((prev) => prev.filter((a) => a.id !== appId));
      toast({ title: "Postulación eliminada", variant: "success" });
    } catch (err: any) {
      toast({ title: err.message || "Error al eliminar", variant: "error" });
    } finally {
      setDeletingAppId(null);
    }
  };

  const handleDeleteSaved = async (petId: string) => {
    if (!user) return;
    setDeletingSavedId(petId);
    try {
      const { error } = await supabase.from("pet_saves").delete().eq("user_id", user.id).eq("pet_id", petId);
      if (error) throw error;
      setSavedPets((prev) => prev.filter((p) => p.id !== petId));
      toast({ title: "Eliminado de guardados", variant: "success" });
    } catch (err: any) {
      toast({ title: err.message || "Error al eliminar", variant: "error" });
    } finally {
      setDeletingSavedId(null);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploadingAvatar(true);
    try {
      // Debug: Verificar autenticación antes del upload
      const { data: userRes } = await supabase.auth.getUser();
      const authUser = userRes.user;
      
      console.log("user:", authUser?.id);
      if (!authUser) throw new Error("No autenticado al subir foto");

      const ext = file.name.split(".").pop();
      const filePath = `avatars/${authUser.id}/avatar.${ext}`;
      console.log("upload path:", filePath);

      // Upload a storage
      const up = await supabase.storage.from("pet-photos").upload(filePath, file, { upsert: true });
      console.log("upload result:", up);
      if (up.error) throw up.error;

      const { data } = supabase.storage.from("pet-photos").getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      const { error: dbError } = await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", authUser.id);

      if (dbError) throw dbError;

      toast({ title: "Foto de perfil actualizada", variant: "success" });
      window.location.reload();
    } catch (err: any) {
      console.error("Error en avatar upload:", err);
      toast({ title: err.message || "Error al subir foto", variant: "error" });
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (!user) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-3 px-4 pb-24">
        <h1 className="text-2xl font-semibold">Mis cosas</h1>
        <p className="text-sm text-neutral-600">Inicia sesión para ver tus datos.</p>
        <Link
          href="/login"
          className="mt-2 inline-flex items-center justify-center rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white"
        >
          Iniciar sesión
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-4 px-4 pb-24">
      <div className="mt-6">
        <div className="mb-4 flex items-center gap-4">
          <div className="relative">
            <UserAvatar userId={user.id} email={user.email ?? null} size={80} className="h-20 w-20" />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-brand text-white shadow-md transition active:scale-95 disabled:opacity-50"
            >
              {uploadingAvatar ? (
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-500">Mi perfil</p>
            <h1 className="text-2xl font-semibold text-gray-900">
              {user.email?.split("@")[0] || "Usuario"}
            </h1>
          </div>
          <Link
            href="/profile/editar"
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 active:scale-95"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar perfil
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("applications")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition relative ${
            activeTab === "applications"
              ? "text-[#F47A5A]"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Postulaciones
          {activeTab === "applications" && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F47A5A]"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab("saved")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition relative ${
            activeTab === "saved"
              ? "text-[#F47A5A]"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          Guardados
          {activeTab === "saved" && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F47A5A]"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab("pets")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition relative ${
            activeTab === "pets"
              ? "text-[#F47A5A]"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
          </svg>
          Mis mascotas
          {activeTab === "pets" && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F47A5A]"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </button>
      </div>

      {/* Contenido de tabs */}
      <div className="rounded-2xl border bg-white/80 p-4">
        {activeTab === "applications" && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-800">Mis postulaciones</p>
            </div>

          {appsLoading ? (
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex gap-3 rounded-xl border border-gray-200 bg-white p-3">
                  <div className="h-16 w-16 rounded-lg bg-gray-200 animate-pulse flex-shrink-0" />
                  <div className="flex-1">
                    <div className="h-5 w-24 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-3 w-20 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse" />
                  </div>
                  <div className="h-8 w-8 rounded-lg bg-gray-200 animate-pulse" />
                </div>
              ))}
            </div>
          ) : applications.length === 0 ? (
            <div className="rounded-xl border border-dashed bg-neutral-50 p-6 text-center">
              <p className="text-sm text-neutral-600">Aún no has postulado a ninguna mascota</p>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => {
                const pet = app.pets;
                const photo = (pet.pet_photos || []).sort((a, b) => a.sort - b.sort)[0];
                const url = photo
                  ? supabase.storage.from("pet-photos").getPublicUrl(photo.path).data.publicUrl
                  : null;

                return (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex gap-3 rounded-xl border border-gray-200 bg-white p-3"
                  >
                    <Link href={`/pets/${pet.id}`} className="flex-shrink-0">
                      <div className="h-16 w-16 overflow-hidden rounded-lg bg-brand-50">
                        {url ? (
                          <img src={url} alt={pet.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-gray-500">Sin foto</div>
                        )}
                      </div>
                    </Link>
                    <div className="flex-1">
                      <Link href={`/pets/${pet.id}`}>
                        <h3 className="font-semibold text-gray-900">{pet.name}</h3>
                      </Link>
                      <p className="text-xs text-gray-500">{pet.city ?? ""}</p>
                      <p className="mt-1 text-xs">
                        <span className="rounded-full bg-brand-50 px-2 py-0.5 font-medium text-brand">
                          {app.status}
                        </span>
                      </p>
                    </div>
                    <ConfirmPopover
                      onConfirm={() => handleDeleteApp(app.id)}
                      title="¿Eliminar postulación?"
                      description="Esta acción no se puede deshacer."
                      confirmText="Eliminar"
                    >
                      <button
                        disabled={deletingAppId === app.id}
                        className="rounded-lg border border-red-200 bg-white p-2 text-red-600 transition hover:bg-red-50 active:scale-95 disabled:opacity-60"
                      >
                        <TrashIcon />
                      </button>
                    </ConfirmPopover>
                  </motion.div>
                );
              })}
            </div>
          )}
          </>
        )}

        {activeTab === "saved" && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-800">Guardados</p>
            </div>

          {savedLoading ? (
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex gap-3 rounded-xl border border-gray-200 bg-white p-3">
                  <div className="h-16 w-16 rounded-lg bg-gray-200 animate-pulse flex-shrink-0" />
                  <div className="flex-1">
                    <div className="h-5 w-24 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-3 w-20 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse" />
                  </div>
                  <div className="h-8 w-8 rounded-lg bg-gray-200 animate-pulse" />
                </div>
              ))}
            </div>
          ) : savedPets.length === 0 ? (
            <div className="rounded-xl border border-dashed bg-neutral-50 p-6 text-center">
              <p className="text-sm text-neutral-600">Aún no has guardado ninguna mascota</p>
            </div>
          ) : (
            <div className="space-y-3">
              {savedPets.map((pet) => {
                const photo = (pet.pet_photos || []).sort((a: any, b: any) => a.sort - b.sort)[0];
                const url = photo
                  ? supabase.storage.from("pet-photos").getPublicUrl(photo.path).data.publicUrl
                  : null;

                return (
                  <motion.div
                    key={pet.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex gap-3 rounded-xl border border-gray-200 bg-white p-3"
                  >
                    <Link href={`/pets/${pet.id}`} className="flex-shrink-0">
                      <div className="h-16 w-16 overflow-hidden rounded-lg bg-brand-50">
                        {url ? (
                          <img src={url} alt={pet.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-gray-500">Sin foto</div>
                        )}
                      </div>
                    </Link>
                    <div className="flex-1">
                      <Link href={`/pets/${pet.id}`}>
                        <h3 className="font-semibold text-gray-900">{pet.name}</h3>
                      </Link>
                      <p className="text-xs text-gray-500">{pet.city ?? ""}</p>
                      <p className="mt-1 text-xs">
                        <span className="rounded-full bg-brand-50 px-2 py-0.5 font-medium text-brand">
                          {pet.status === "available" ? "Disponible" : "En proceso"}
                        </span>
                      </p>
                    </div>
                    <ConfirmPopover
                      onConfirm={() => handleDeleteSaved(pet.id)}
                      title="¿Quitar de guardados?"
                      description="Esta acción no se puede deshacer."
                      confirmText="Quitar"
                    >
                      <button
                        disabled={deletingSavedId === pet.id}
                        className="rounded-lg border border-red-200 bg-white p-2 text-red-600 transition hover:bg-red-50 active:scale-95 disabled:opacity-60"
                      >
                        <TrashIcon />
                      </button>
                    </ConfirmPopover>
                  </motion.div>
                );
              })}
            </div>
          )}
          </>
        )}

        {activeTab === "pets" && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-800">Mis mascotas publicadas</p>
              <Link
                href="/publish"
                className="flex items-center gap-1 rounded-xl border border-gray-900 bg-white px-3 py-1.5 text-xs font-semibold text-gray-900 transition active:scale-95"
              >
                <PlusIcon />
                Publicar
              </Link>
            </div>

          {petsLoading ? (
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex gap-3 rounded-xl border border-gray-200 bg-white p-3">
                  <div className="h-16 w-16 rounded-lg bg-gray-200 animate-pulse flex-shrink-0" />
                  <div className="flex-1">
                    <div className="h-5 w-24 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-3 w-20 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gray-200 animate-pulse" />
                    <div className="h-8 w-8 rounded-lg bg-gray-200 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : pets.length === 0 ? (
            <div className="rounded-xl border border-dashed bg-neutral-50 p-6 text-center">
              <p className="text-sm text-neutral-600">Aún no has publicado ninguna mascota</p>
            </div>
          ) : (
            <div className="space-y-3">
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
                    className="flex gap-3 rounded-xl border border-gray-200 bg-white p-3"
                  >
                    <Link href={`/pets/${pet.id}`} className="flex-shrink-0">
                      <div className="h-16 w-16 overflow-hidden rounded-lg bg-brand-50">
                        {url ? (
                          <img src={url} alt={pet.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-gray-500">Sin foto</div>
                        )}
                      </div>
                    </Link>
                    <div className="flex-1">
                      <Link href={`/pets/${pet.id}`}>
                        <h3 className="font-semibold text-gray-900">{pet.name}</h3>
                      </Link>
                      <p className="text-xs text-gray-500">{pet.city ?? ""}</p>
                      <p className="mt-1 text-xs">
                        <span className="rounded-full bg-brand-50 px-2 py-0.5 font-medium text-brand">
                          {pet.status === "available" ? "Disponible" : "En proceso"}
                        </span>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/pets/${pet.id}/applications`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 active:scale-95"
                        title="Ver postulaciones"
                      >
                        <ApplicationsIcon />
                      </Link>
                      <Link
                        href={`/pets/${pet.id}/edit`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 active:scale-95"
                        title="Editar"
                      >
                        <EditIcon />
                      </Link>
                      <ConfirmPopover
                        onConfirm={() => handleDeletePet(pet.id)}
                        title="¿Eliminar mascota?"
                        description="Esta acción no se puede deshacer."
                        confirmText="Eliminar"
                      >
                        <button
                          disabled={deletingId === pet.id}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-white text-red-600 transition hover:bg-red-50 active:scale-95 disabled:opacity-60"
                          title="Eliminar"
                        >
                          <TrashIcon />
                        </button>
                      </ConfirmPopover>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
          </>
        )}
      </div>
    </main>
  );
}

