-- ============================================
-- POLÍTICAS RLS PARA ADOPTI
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- 1. POLÍTICAS PARA pets
-- ============================================

-- INSERT: Usuarios autenticados pueden crear mascotas
CREATE POLICY "Users can create pets"
ON pets
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = owner_user_id);

-- SELECT: Cualquiera puede ver mascotas publicadas
CREATE POLICY "Anyone can view published pets"
ON pets
FOR SELECT
TO public
USING (published = true AND status != 'hidden');

-- UPDATE: Usuarios pueden editar sus propias mascotas
CREATE POLICY "Users can update their own pets"
ON pets
FOR UPDATE
TO authenticated
USING (auth.uid() = owner_user_id)
WITH CHECK (auth.uid() = owner_user_id);

-- DELETE: Usuarios pueden eliminar sus propias mascotas
CREATE POLICY "Users can delete their own pets"
ON pets
FOR DELETE
TO authenticated
USING (auth.uid() = owner_user_id);

-- 2. POLÍTICAS PARA pet_photos
-- ============================================

-- INSERT: Usuarios pueden insertar fotos de sus propias mascotas
CREATE POLICY "Users can insert photos for their own pets"
ON pet_photos
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM pets
    WHERE pets.id = pet_photos.pet_id
    AND pets.owner_user_id = auth.uid()
  )
);

-- SELECT: Cualquiera puede ver fotos de mascotas publicadas
CREATE POLICY "Anyone can view photos of published pets"
ON pet_photos
FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 FROM pets
    WHERE pets.id = pet_photos.pet_id
    AND pets.published = true
  )
);

-- UPDATE: Usuarios pueden actualizar fotos de sus propias mascotas
CREATE POLICY "Users can update photos of their own pets"
ON pet_photos
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM pets
    WHERE pets.id = pet_photos.pet_id
    AND pets.owner_user_id = auth.uid()
  )
);

-- DELETE: Usuarios pueden eliminar fotos de sus propias mascotas
CREATE POLICY "Users can delete photos of their own pets"
ON pet_photos
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM pets
    WHERE pets.id = pet_photos.pet_id
    AND pets.owner_user_id = auth.uid()
  )
);

-- 3. POLÍTICAS PARA pet_saves
-- ============================================

-- INSERT: Usuarios pueden guardar mascotas
CREATE POLICY "Users can save pets"
ON pet_saves
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- SELECT: Usuarios pueden ver sus propios guardados
CREATE POLICY "Users can view their own saves"
ON pet_saves
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- DELETE: Usuarios pueden eliminar sus propios guardados
CREATE POLICY "Users can delete their own saves"
ON pet_saves
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 4. POLÍTICAS PARA applications
-- ============================================

-- Crear tabla applications si no existe
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'submitted',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(pet_id, user_id) -- Un usuario solo puede postularse una vez por mascota
);

-- Asegurar que el default de status sea 'submitted'
ALTER TABLE applications 
ALTER COLUMN status SET DEFAULT 'submitted';

-- Habilitar RLS
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Crear índices para mejorar performance
CREATE INDEX IF NOT EXISTS applications_pet_id_idx ON applications(pet_id);
CREATE INDEX IF NOT EXISTS applications_user_id_idx ON applications(user_id);
CREATE INDEX IF NOT EXISTS applications_status_idx ON applications(status);

-- INSERT: Usuarios pueden postularse a mascotas
CREATE POLICY "Users can apply to pets"
ON applications
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- SELECT: Usuarios pueden ver sus propias postulaciones
CREATE POLICY "Users can view their own applications"
ON applications
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- SELECT: Dueños pueden ver postulaciones de sus mascotas
CREATE POLICY "Owners can view applications for their pets"
ON applications
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM pets
    WHERE pets.id = applications.pet_id
    AND pets.owner_user_id = auth.uid()
  )
);

-- UPDATE: Usuarios pueden actualizar sus propias postulaciones (opcional)
CREATE POLICY "Users can update their own applications"
ON applications
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- DELETE: Usuarios pueden eliminar sus propias postulaciones
CREATE POLICY "Users can delete their own applications"
ON applications
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 5. POLÍTICAS PARA profiles
-- ============================================

-- INSERT: Se crea automáticamente con trigger, pero por si acaso:
CREATE POLICY "Users can create their own profile"
ON profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- SELECT: Usuarios pueden ver su propio perfil
CREATE POLICY "Users can view their own profile"
ON profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- UPDATE: Usuarios pueden actualizar su propio perfil
CREATE POLICY "Users can update their own profile"
ON profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

