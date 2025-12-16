"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { supabase } from "@/lib/supabase/client";
import { useSession } from "@/components/auth/session-provider";
import { useToast } from "@/components/ui/toast";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  petId: string;
  isOpen: boolean;
  onClose: () => void;
};

type Application = {
  id: string;
  status: string;
  message: string | null;
};

export default function ApplyModal({ petId, isOpen, onClose }: Props) {
  const { user } = useSession();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [app, setApp] = useState<Application | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen || !user) return;

    const loadApp = async () => {
      const { data, error } = await supabase
        .from("applications")
        .select("id,status,message")
        .eq("pet_id", petId)
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        setApp(data);
        setMessage(data.message || "");
      }
    };

    loadApp();
  }, [petId, user, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (app) {
      toast({ title: "Ya postulaste", description: "Revisa el estado en tu perfil.", variant: "info" });
      return;
    }

    setSubmitting(true);

    const { data, error } = await supabase
      .from("applications")
      .insert({
        pet_id: petId,
        user_id: user.id,
        status: "enviada",
        message: message || null,
      })
      .select("id,status,message")
      .single();

    if (error) {
      toast({ title: error.message || "Error al enviar", variant: "error" });
      setSubmitting(false);
      return;
    }

    setApp(data);
    toast({ title: "Postulación enviada", description: "Te avisaremos cuando la revisen.", variant: "success" });
    setSubmitting(false);
    setTimeout(() => {
      onClose();
    }, 1500);
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
              <h2 className="text-xl font-semibold text-gray-900">Postularme</h2>
              <button
                onClick={onClose}
                className="rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {app ? (
              <div className="space-y-3">
                <div className="rounded-xl bg-brand-soft p-3">
                  <p className="text-sm font-medium text-brand">Ya enviaste tu postulación</p>
                  <p className="mt-1 text-xs text-gray-600">Estado: {app.status}</p>
                </div>
                {app.message && (
                  <div className="rounded-xl border border-gray-200 p-3">
                    <p className="text-xs text-gray-500">Tu mensaje:</p>
                    <p className="mt-1 text-sm text-gray-700">{app.message}</p>
                  </div>
                )}
                <button
                  onClick={onClose}
                  className="w-full rounded-xl border border-gray-900 bg-white px-4 py-3 text-sm font-semibold text-gray-900 transition active:scale-95"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Mensaje (opcional)
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
                    placeholder="Cuéntanos brevemente por qué quieres adoptarlo"
                  />
                </label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition active:scale-95"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-500/90 active:scale-95 disabled:opacity-60"
                  >
                    {submitting ? "Enviando..." : "Enviar"}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

