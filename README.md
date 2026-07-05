# Depescar.top — Tienda de pesca submarina

E-commerce con catálogo sincronizado de [depescar.top](https://depescar.top): más de 1400 productos, navegación por secciones y categorías con imágenes.

## Desarrollo local

```bash
npm install
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173).

### Sincronizar catálogo desde depescar.top

```bash
npm run sync:catalog        # productos + imágenes
npm run sync:catalog:meta   # solo metadatos (sin imágenes)
```

## Build de producción

```bash
npm run build
npm run preview
```

## Despliegue en Vercel

El proyecto está listo para Vercel (Vite + SPA).

### Opción A — Git (recomendada)

1. Entra en [vercel.com/new](https://vercel.com/new).
2. Importa el repositorio `OscarGaliano/depescar-top`.
3. Vercel detectará automáticamente:
   - **Framework:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm ci`
4. Pulsa **Deploy**.

Cada push a `main` generará un despliegue automático.

### Opción B — CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

### Dominio personalizado

En Vercel → **Project Settings → Domains**, añade `depescar.top` (o el subdominio que uses) y configura los DNS que indique Vercel.

### Notas

- Las imágenes del catálogo están en `public/catalog/` y se sirven como estáticos.
- No se requieren variables de entorno para el build.
- Node.js **20.x** (definido en `package.json` → `engines`).
