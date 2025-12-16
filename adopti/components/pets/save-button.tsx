"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useSession } from "@/components/auth/session-provider";
import { useToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

type Props = {
  petId: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

export default function SaveButton({ petId, size = "md", className = "" }: Props) {
  const { user } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [justToggled, setJustToggled] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsSaved(false);
      return;
    }

    const checkSaved = async () => {
      const { data } = await supabase.from("pet_saves").select("pet_id").eq("user_id", user.id).eq("pet_id", petId).maybeSingle();
      setIsSaved(!!data);
    };

    checkSaved();
  }, [petId, user]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast({ title: "Inicia sesión para guardar mascotas", variant: "info" });
      router.push("/login");
      return;
    }

    setLoading(true);
    setJustToggled(true);
    try {
      if (!isSaved) {
        const { error } = await supabase.from("pet_saves").insert({
          user_id: user.id,
          pet_id: petId,
        });
        if (error) throw error;
        setIsSaved(true);
        toast({ title: "Mascota guardada", variant: "success" });
      } else {
        const { error } = await supabase.from("pet_saves").delete().eq("user_id", user.id).eq("pet_id", petId);
        if (error) throw error;
        setIsSaved(false);
        toast({ title: "Mascota eliminada de guardados", variant: "success" });
      }
    } catch (err: any) {
      toast({ title: err.message || "Error al guardar", variant: "error" });
    } finally {
      setLoading(false);
      setTimeout(() => setJustToggled(false), 500);
    }
  };

  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  return (
    <div className="relative group">
      <motion.button
        onClick={handleToggle}
        disabled={loading}
        whileTap={{ scale: 0.85 }}
        whileHover={{ scale: 1.05 }}
        animate={justToggled && isSaved ? { scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`flex items-center justify-center rounded-full disabled:opacity-60 ${sizeClasses[size]} ${className} ${
          isSaved ? "text-red-500" : "text-gray-400 hover:text-red-400"
        }`}
        aria-label={isSaved ? "Quitar de guardados" : "Guardar mascota"}
      >
      {isSaved ? (
        <motion.svg
          key="saved"
          className="h-full w-full"
          fill="currentColor"
          viewBox="0 0 24 24"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </motion.svg>
      ) : (
        <svg className="h-full w-full" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )}
      </motion.button>
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded">
          {isSaved ? "Quitar de guardados" : "Guardar"}
        </div>
      </div>
    </div>
  );
}

