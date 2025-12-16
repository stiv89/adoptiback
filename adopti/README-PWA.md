# Configuración PWA para Adopti

## Archivos creados

1. **`app/manifest.ts`** - Manifest dinámico de Next.js
2. **`public/manifest.json`** - Manifest estático
3. **`public/sw.js`** - Service Worker para funcionalidad offline
4. **`app/sw.js/route.ts`** - Ruta para servir el service worker
5. **`components/pwa/register-sw.tsx`** - Componente para registrar el service worker

## Generar iconos

Para generar los iconos desde `adopti_app.jpg`, tienes dos opciones:

### Opción 1: Usar ImageMagick (recomendado)

```bash
chmod +x scripts/generate-icons.sh
./scripts/generate-icons.sh
```

### Opción 2: Usar una herramienta online

1. Ve a https://www.pwabuilder.com/imageGenerator
2. Sube `public/adopti_app.jpg`
3. Descarga los iconos generados
4. Colócalos en la carpeta `public/` con los nombres:
   - `icon-72x72.png`
   - `icon-96x96.png`
   - `icon-128x128.png`
   - `icon-144x144.png`
   - `icon-152x152.png`
   - `icon-192x192.png`
   - `icon-384x384.png`
   - `icon-512x512.png`

### Opción 3: Usar Node.js con sharp

```bash
npm install --save-dev sharp
node scripts/generate-icons.js
```

## Verificar PWA

1. Ejecuta `npm run build && npm start`
2. Abre Chrome DevTools
3. Ve a la pestaña "Application" > "Manifest"
4. Verifica que el manifest se carga correctamente
5. Ve a "Service Workers" y verifica que está registrado

## Testing en móvil

1. Despliega la app
2. Abre en un dispositivo móvil
3. En iOS Safari: Compartir > Agregar a pantalla de inicio
4. En Android Chrome: Menú > "Agregar a pantalla de inicio"

## Características PWA

- ✅ Manifest configurado
- ✅ Service Worker para cache offline
- ✅ Iconos para diferentes dispositivos
- ✅ Theme color configurado
- ✅ Display standalone
- ✅ Orientación portrait
