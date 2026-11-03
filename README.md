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

Los componentes no cambian: la fuente se elige con `CONTENT_SOURCE` (ver `src/data/source.ts`).

## Privacidad de talleres

"Reservado" = taller **privado**; la obra se muestra igual. La ubicación exacta de un taller privado se descarta en `repository.ts` (y la consulta GROQ ni siquiera la pide), y los tipos públicos no tienen campo para ella. Por eso el dataset de Sanity debe ser privado: en uno público esa coordenada sería consultable por la API.

## Experiencias (tour guiado)

Tour guiado de 2 paradas: **Museo del Carnaval → traslado → taller de un artesano** (ejercicio práctico de tallado y empapelado) **→ recuerdo** del artesano, igual para todos. Transporte, guía local, materiales y recuerdo van incluidos.

- Rutas: `/experiencias` y `/experiencias/[slug]`. En la ficha del creador y de sus carrozas aparece "Taller del tour de experiencia" si es el taller asignado a un tour de la edición activa.
- Modelo (`Experience` en `src/data/types.ts`, tipo `experience` en Sanity): itinerario de paradas (título, descripción, minutos), **un taller asignado por tour** (referencia a creador; para sumar talleres se crean más tours), qué incluye, idiomas, duración (mín/máx + "confirmada"), precio **por persona**, mínimo/máximo de personas, hora de salida diaria, punto de encuentro y fechas de temporada.
- Valores pendientes: si falta el precio, el mínimo, la hora de salida o la duración no está confirmada, el sitio muestra **"Por confirmar"** (no se inventan cifras). Los datos de ejemplo están en `src/data/sample/index.ts` con esos campos sin valor hasta el tour piloto.
- Reserva y pago solo por WhatsApp (botón "Reservar por WhatsApp", mensaje en `whatsapp.experience` de `src/messages`). Sin pago en línea ni base de datos.
- Cancelación: reembolso total hasta 3 días antes (texto en `experiences.cancel`; mantenerlo coherente con los términos).
- Privacidad: del taller solo se muestra el barrio; la dirección exacta se comparte por WhatsApp al confirmar.

## Foto de portada

Pon tu foto en `public/images/hero.jpg` (horizontal, mín. 1600 px de ancho) y haz push. Sin ese archivo se muestra el degradado de tierra. Se le superpone un velo oscuro para que el texto se lea.

## Contenido real pendiente

- Reemplazar placeholders por fotos reales (campo `src` de cada imagen / imágenes en Sanity).
- Visor 360°: requiere al menos 8 fotos de la maqueta en `fotosMaqueta`, ordenadas por ángulo; si hay menos solo se muestra la galería. Permiso de Corpocarnaval pendiente para esas fotos.
- Modelo 3D (GLB) opcional por carroza: componente `model-3d` listo para v2.
- Dominio y número de WhatsApp reales.

## Notas de diseño

El bermellón se usa solo en el botón principal de participar y el punto del logo; los números de pasos, capitulares y pines usan arcilla.
