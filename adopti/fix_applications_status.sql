-- ============================================
-- FIX: Actualizar default de status en applications
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- Asegurar que el default de status sea 'submitted'
ALTER TABLE applications 
ALTER COLUMN status SET DEFAULT 'submitted';

-- Verificar el constraint actual (opcional, solo para debug)
-- SELECT conname, consrc FROM pg_constraint WHERE conrelid = 'applications'::regclass AND contype = 'c';
