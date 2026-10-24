import { defineField, defineType } from "sanity";

export const localizedString = defineType({
  name: "localizedString",
  title: "Texto (ES/EN)",
  type: "object",
  fields: [
    defineField({ name: "es", title: "Español", type: "string", validation: (r) => r.required() }),
    defineField({ name: "en", title: "English", type: "string" }),
  ],
});

export const localizedText = defineType({
  name: "localizedText",
  title: "Texto largo (ES/EN)",
  type: "object",
  fields: [
    defineField({ name: "es", title: "Español", type: "text", rows: 5, validation: (r) => r.required() }),
    defineField({ name: "en", title: "English", type: "text", rows: 5 }),
  ],
});

export const photo = defineType({
  name: "photo",
  title: "Foto",
  type: "image",
  options: { hotspot: true },
  fields: [defineField({ name: "alt", title: "Texto alternativo", type: "localizedString" })],
});

export const edition = defineType({
  name: "edition",
  title: "Edición",
  type: "document",
  fields: [
    defineField({ name: "year", title: "Año", type: "number", validation: (r) => r.required().integer() }),
    defineField({ name: "startDate", title: "Fecha de inicio", type: "date", validation: (r) => r.required() }),
    defineField({ name: "paradeDate", title: "Fecha del desfile", type: "date", validation: (r) => r.required() }),
    defineField({
      name: "active",
      title: "Edición activa",
      description: "Solo una edición debe estar activa: es la que se muestra en el catálogo y el mapa.",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: { select: { title: "year", subtitle: "paradeDate" } },
});

export const creator = defineType({
  name: "creator",
  title: "Creador",
  type: "document",
  fields: [
    defineField({
      name: "type",
      title: "Tipo",
      type: "string",
      options: { list: [{ title: "Maestro individual", value: "individual" }, { title: "Taller", value: "workshop" }], layout: "radio" },
      initialValue: "workshop",
      validation: (r) => r.required(),
    }),
    defineField({ name: "name", title: "Nombre", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" }, validation: (r) => r.required() }),
    defineField({ name: "bio", title: "Biografía", type: "localizedText" }),
    defineField({ name: "portrait", title: "Retrato / logo", type: "photo" }),
    defineField({ name: "cover", title: "Portada (opcional)", type: "photo" }),
    defineField({ name: "members", title: "Integrantes", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "since", title: "Desde (año)", type: "number" }),
    defineField({ name: "neighborhood", title: "Barrio", type: "string" }),
    defineField({
      name: "social",
      title: "Redes",
      type: "object",
      fields: [
        { name: "instagram", title: "Instagram", type: "url" },
        { name: "facebook", title: "Facebook", type: "url" },
        { name: "tiktok", title: "TikTok", type: "url" },
        { name: "website", title: "Sitio web", type: "url" },
      ],
    }),
  ],
  preview: { select: { title: "name", subtitle: "neighborhood", media: "portrait" } },
});

export const workshopLocation = defineType({
  name: "workshopLocation",
  title: "Ubicación del taller",
  type: "object",
  fields: [
    defineField({
      name: "access",
      title: "Acceso al taller",
      description: "Abierto: se publica la ubicación exacta. Privado: solo la zona aproximada.",
      type: "string",
      options: { list: [{ title: "Abierto", value: "open" }, { title: "Privado", value: "private" }], layout: "radio" },
      initialValue: "private",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "publicZone",
      title: "Zona pública (aproximada)",
      type: "object",
      fields: [
        defineField({ name: "neighborhood", title: "Barrio / zona", type: "string", validation: (r) => r.required() }),
        { name: "lat", title: "Latitud aproximada", type: "number" },
        { name: "lng", title: "Longitud aproximada", type: "number" },
        { name: "radiusM", title: "Radio (m)", type: "number", initialValue: 400 },
      ],
    }),
    defineField({
      name: "exactLocation",
      title: "Ubicación exacta",
      description: "Se publica SOLO si el taller es abierto. En talleres privados nunca sale del servidor.",
      type: "object",
      fields: [
        { name: "lat", title: "Latitud", type: "number" },
        { name: "lng", title: "Longitud", type: "number" },
        { name: "address", title: "Dirección", type: "string" },
      ],
    }),
    defineField({ name: "visitHours", title: "Horario de visita", type: "localizedString" }),
    defineField({ name: "exhibitionNote", title: "Nota de exhibición", type: "localizedString" }),
  ],
});

export const float = defineType({
  name: "float",
  title: "Carroza",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Nombre", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" }, validation: (r) => r.required() }),
    defineField({ name: "edition", title: "Edición", type: "reference", to: [{ type: "edition" }], validation: (r) => r.required() }),
    defineField({ name: "creator", title: "Creador", type: "reference", to: [{ type: "creator" }], validation: (r) => r.required() }),
    defineField({ name: "number", title: "Número", type: "number", validation: (r) => r.required().integer().positive() }),
    defineField({ name: "story", title: "Historia", type: "localizedText" }),
    defineField({ name: "mainImage", title: "Imagen principal", type: "photo" }),
    defineField({ name: "gallery", title: "Galería", type: "array", of: [{ type: "photo" }] }),
    defineField({
      name: "maquetteFrames",
      title: "Fotos de la maqueta (por ángulo)",
      description: "Ordénalas por ángulo, de 0° a 360°. Con 8 o más se activa el visor 360°.",
      type: "array",
      of: [{ type: "photo" }],
    }),
    defineField({ name: "viewer360", title: "Mostrar visor 360°", type: "boolean", initialValue: true }),
    defineField({
      name: "model3D",
      title: "Modelo 3D (opcional, v2)",
      type: "object",
      fields: [
        { name: "glb", title: "Archivo GLB", type: "file", options: { accept: ".glb" } },
        { name: "poster", title: "Imagen de carga", type: "image" },
      ],
    }),
    defineField({ name: "videoUrl", title: "Video (URL)", type: "url" }),
    defineField({ name: "costume", title: "Disfraz (vacío = Por confirmar)", type: "localizedString" }),
    defineField({ name: "featured", title: "Destacada", type: "boolean", initialValue: false }),
    defineField({ name: "acceptsPlayers", title: "Acepta jugadores", type: "boolean", initialValue: true }),
    defineField({ name: "published", title: "Publicada", type: "boolean", initialValue: false }),
    defineField({ name: "workshop", title: "Ubicación del taller", type: "workshopLocation" }),
  ],
  orderings: [{ title: "Número", name: "number", by: [{ field: "number", direction: "asc" }] }],
  preview: { select: { title: "name", subtitle: "number", media: "mainImage" } },
});

export const schemaTypes = [localizedString, localizedText, photo, workshopLocation, edition, creator, float];
