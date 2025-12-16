# Políticas RLS necesarias para Adopti

## Problema: Error "new row violates row-level security policy"

Si recibes este error, necesitas crear políticas RLS en Supabase para las siguientes tablas:
- `pets` - Crear mascotas
- `pet_photos` - Subir fotos
- `pet_saves` - Guardar mascotas
- `applications` - Postularse a mascotas
- `profiles` - Perfiles de usuario

## Solución: Crear política RLS para `pet_photos`

### 1. Ve a Supabase Dashboard
- Abre tu proyecto en [Supabase Dashboard](https://app.supabase.com)
- Ve a **Authentication** → **Policies** o **Table Editor** → `pet_photos` → **RLS**

### 2. Crea la política para INSERT

**Nombre:** `Users can insert photos for their own pets`

**Comando:** `INSERT`

**Definición usando:** `true` (para simplificar) o la siguiente expresión:

```sql
EXISTS (
  SELECT 1 FROM pets
  WHERE pets.id = pet_photos.pet_id
  AND pets.owner_user_id = auth.uid()
)
```

**Política más estricta (recomendada):**

```sql
-- Permite insertar fotos solo si el usuario es dueño de la mascota
EXISTS (
  SELECT 1 FROM pets
  WHERE pets.id = pet_photos.pet_id
  AND pets.owner_user_id = auth.uid()
)
```

### 3. Crea la política para SELECT

**Nombre:** `Anyone can view photos of published pets`

**Comando:** `SELECT`

**Definición:**

```sql
EXISTS (
  SELECT 1 FROM pets
  WHERE pets.id = pet_photos.pet_id
  AND pets.published = true
)
```

### 4. Crea la política para UPDATE (opcional)

**Nombre:** `Users can update photos of their own pets`

**Comando:** `UPDATE`

**Definición:**

```sql
EXISTS (
  SELECT 1 FROM pets
  WHERE pets.id = pet_photos.pet_id
  AND pets.owner_user_id = auth.uid()
)
```

### 5. Crea la política para DELETE (opcional)

**Nombre:** `Users can delete photos of their own pets`

**Comando:** `DELETE`

**Definición:**

```sql
EXISTS (
  SELECT 1 FROM pets
  WHERE pets.id = pet_photos.pet_id
  AND pets.owner_user_id = auth.uid()
)
```

## Script SQL completo (ejecutar en Supabase SQL Editor)

Copia y pega este script completo en el **SQL Editor** de Supabase para crear todas las políticas necesarias:

```sql
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

-- SELECT: Cualquiera puede ver perfiles públicos (usar view public_profiles)
-- Los perfiles privados solo los ve el dueño
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
```

## Verificación

Después de ejecutar el script:

1. Ve a **Table Editor** en Supabase
2. Verifica que cada tabla tenga las políticas creadas
3. Intenta crear una mascota con foto
4. El error debería desaparecer

## Nota sobre Storage

Asegúrate también de que el bucket `pet-photos` tenga las políticas correctas en **Storage** → **Policies**:

- **INSERT:** `auth.role() = 'authenticated'`
- **SELECT:** `true` (público para lectura)
- **UPDATE:** `auth.role() = 'authenticated'`
- **DELETE:** `auth.role() = 'authenticated'`

## Si ya tienes políticas existentes

Si ya tienes algunas políticas y quieres recrearlas, primero elimínalas:

```sql
-- Eliminar políticas existentes (opcional, solo si necesitas empezar de cero)
DROP POLICY IF EXISTS "Users can create pets" ON pets;
DROP POLICY IF EXISTS "Anyone can view published pets" ON pets;
DROP POLICY IF EXISTS "Users can update their own pets" ON pets;
DROP POLICY IF EXISTS "Users can delete their own pets" ON pets;
-- ... (repetir para cada política)
```

