# La Ruta del Carnaval

Web móvil primero para conocer cada carroza del Carnaval de Negros y Blancos de Pasto (6 de enero) y solicitar un puesto en la obra por WhatsApp.

Stack: Next.js (App Router) · TypeScript · Tailwind v4 · next-intl (`/es`, `/en`) · Sanity (headless) · Framer Motion · Leaflet + OpenStreetMap · PWA ligera.

## Cómo correr

```bash
npm install
cp .env.example .env.local   # y ajusta los valores
npm run dev                  # http://localhost:3000
npm run build && npm start   # producción
```

Por defecto usa datos de ejemplo (ficticios) y placeholders visuales en lugar de fotos.

## Cambiar el número de WhatsApp

En `.env.local`: `NEXT_PUBLIC_WHATSAPP_NUMBER=57XXXXXXXXXX` (solo dígitos, con indicativo, sin `+`). Los mensajes prellenados están en `src/messages/{es,en}.json` (namespace `whatsapp`). También define `NEXT_PUBLIC_SITE_URL` con el dominio real (SEO, Open Graph, sitemap).

## Estructura

```
src/app/[locale]/…     Páginas (inicio, carrozas, mapa, creadores, como-participar, el-carnaval, contacto)
src/components/        UI (site-chrome = cabecera y barra inferior, visor 360°, mapa, tarjetas…)
src/data/types.ts      Modelo de datos crudo (Edición, Creador, Carroza, Ubicación del taller)
src/data/public.ts     Tipos públicos ya localizados y saneados
src/data/repository.ts Única capa de acceso a datos que usan las páginas
src/data/sample/       Contenido de ejemplo
src/data/sanity/       Adaptador GROQ de Sanity
src/messages/          Textos ES/EN
sanity/                Esquemas del CMS
design/maqueta.html    Maqueta visual aprobada
```

## Conectar Sanity

1. Crea un proyecto en sanity.io y un dataset **privado** (importante, ver Privacidad).
2. En `.env.local`: `CONTENT_SOURCE=sanity`, `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_READ_TOKEN` (token de solo lectura).
3. `npm run studio` abre el Studio con los esquemas de `sanity/schemaTypes`.
4. Para refrescar al publicar: webhook de Sanity → `POST /api/revalidate?secret=<SANITY_REVALIDATE_SECRET>`. Sin webhook, las páginas se regeneran cada 5 min (ISR).

Los componentes no cambian: solo se cambia la fuente en `src/data/source.ts`.

## Privacidad de talleres

"Reservado" = taller **privado**; la obra se muestra igual. La ubicación exacta de un taller privado se descarta en `repository.ts` (y la consulta GROQ ni siquiera la pide), y los tipos públicos no tienen campo para ella. Por eso el dataset de Sanity debe ser privado: en uno público esa coordenada sería consultable por la API.

## Contenido real pendiente

- Reemplazar placeholders por fotos reales (campo `src` de cada imagen / imágenes en Sanity).
- Visor 360°: requiere al menos 8 fotos de la maqueta en `fotosMaqueta`, ordenadas por ángulo; si hay menos solo se muestra la galería. Permiso de Corpocarnaval pendiente para esas fotos.
- Modelo 3D (GLB) opcional por carroza: componente `model-3d` listo para v2.
- Dominio y número de WhatsApp reales.

## Notas de diseño

El bermellón se usa solo en el botón principal de participar y el punto del logo; los números de pasos, capitulares y pines usan arcilla.
