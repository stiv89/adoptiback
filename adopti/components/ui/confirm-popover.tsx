"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

type ConfirmPopoverProps = {
  onConfirm: () => void;
  onCancel?: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  children: React.ReactNode;
};

export default function ConfirmPopover({
  onConfirm,
  onCancel,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  children,
}: ConfirmPopoverProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  const handleCancel = () => {
    onCancel?.();
    setOpen(false);
  };

  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!open || !buttonRef.current || !mounted) return;

    const updatePosition = () => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      // fixed es relativo al viewport, no necesitamos scrollY/scrollX
      setPosition({
        top: rect.top - 120, // Altura del popover + margen (arriba del botón)
        left: rect.left,
      });
    };

    updatePosition();
    // Escuchar scroll en todos los contenedores
    const handleScroll = () => updatePosition();
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, mounted]);

  return (
    <>
      <div ref={buttonRef} onClick={() => setOpen(!open)}>
        {children}
      </div>
      {open && mounted && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={popoverRef}
              className="fixed z-[100] w-64 rounded-xl border border-gray-200 bg-white p-4 shadow-lg"
              style={{ top: `${position.top}px`, left: `${position.left}px` }}
            >
              <p className="text-sm font-semibold text-gray-900">{title}</p>
              {description && <p className="mt-1 text-xs text-gray-600">{description}</p>}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={handleCancel}
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 active:scale-95"
                >
                  {cancelText}
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 active:scale-95"
                >
                  {confirmText}
                </button>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}

