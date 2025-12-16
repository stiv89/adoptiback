"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { useSession } from "@/components/auth/session-provider";
import { useToast } from "@/components/ui/toast";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  petId: string;
  petName?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

type Application = {
  id: string;
  status: string;
};

export default function ApplyModal({ petId, petName, isOpen, onClose, onSuccess }: Props) {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setMessage("");
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verificar autenticación
    const { data: userRes } = await supabase.auth.getUser();
    const user = userRes.user;
    if (!user) {
      toast({ title: "No autenticado", variant: "error" });
      return;
    }

    setSubmitting(true);

    try {
      const payload: any = {
        pet_id: petId,
        user_id: user.id,
        // No enviamos status, dejamos que la DB use el default
      };

      const res = await supabase
        .from("applications")
        .insert(payload)
        .select("id,status,created_at")
        .single();

      if (res.error) {
        // Manejar error de duplicado
        if (res.error.code === "23505" || res.error.message.includes("duplicate") || res.error.message.includes("unique")) {
          toast({ title: "Ya te postulaste", variant: "info" });
          onClose();
          if (onSuccess) onSuccess();
          return;
        }
        throw res.error;
      }

      toast({ title: "Postulación enviada ✓", variant: "success" });
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast({ title: err.message || "Error al enviar", variant: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed left-1/2 top-1/2 z-[101] w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-gray-200 bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {petName ? `Postulación para ${petName}` : "Postulación"}
              </h2>
              <button
                onClick={onClose}
                className="rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <div className="mb-2 text-sm font-medium text-gray-700">Mensaje (opcional)</div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2 focus:border-brand transition"
                  placeholder="Contá por qué querés adoptarlo, tu experiencia o situación"
                />
              </label>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 active:scale-95"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-xl bg-[#F47A5A] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#e96a4b] active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Enviando…
                    </>
                  ) : (
                    "Enviar postulación"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

