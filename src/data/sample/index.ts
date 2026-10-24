import type {
  ContentSnapshot,
  Creator,
  Edition,
  Float,
  ImageAsset,
  Localized,
  Tone,
  WorkshopLocation,
} from "../types";

/**
 * Contenido de ejemplo FICTICIO. Se reemplaza por Sanity (ver README).
 * Las imágenes usan placeholders (tono) hasta tener fotos reales.
 */

const l = (es: string, en: string): Localized => ({ es, en });
const img = (tone: Tone, es: string, en: string): ImageAsset => ({ tone, alt: l(es, en) });

const frames = (name: string, count = 12): ImageAsset[] =>
  Array.from({ length: count }, (_, i) => ({
    tone: ((i % 4) + 1) as Tone,
    alt: l(
      `Maqueta de ${name}, ángulo ${Math.round((i / count) * 360)}°`,
      `Scale model of ${name}, angle ${Math.round((i / count) * 360)}°`,
    ),
  }));

export const editions: Edition[] = [
  { id: "ed-2027", year: 2027, startDate: "2026-12-28", paradeDate: "2027-01-06", active: true },
  { id: "ed-2026", year: 2026, startDate: "2025-12-28", paradeDate: "2026-01-06", active: false },
  { id: "ed-2025", year: 2025, startDate: "2024-12-28", paradeDate: "2025-01-06", active: false },
  { id: "ed-2023", year: 2023, startDate: "2022-12-28", paradeDate: "2023-01-06", active: false },
];

export const creators: Creator[] = [
  {
    id: "cr-chachinoy",
    type: "workshop",
    name: "Taller Hermanos Chachinoy",
    slug: "hermanos-chachinoy",
    bio: l(
      "Tres hermanos que aprendieron el oficio de su familia y llevan más de veinte años dando forma al carnaval con cartón, papel y paciencia.",
      "Three brothers who learned the trade from their family and have spent over twenty years shaping the carnival with cardboard, paper and patience.",
    ),
    portrait: img(1, "Taller Hermanos Chachinoy", "Hermanos Chachinoy workshop"),
    cover: img(1, "Taller Hermanos Chachinoy", "Hermanos Chachinoy workshop"),
    members: ["Luis Chachinoy", "Marco Chachinoy", "Daniel Chachinoy"],
    since: 1998,
    neighborhood: "Lourdes",
    social: { instagram: "https://instagram.com/" },
  },
  {
    id: "cr-benavides",
    type: "individual",
    name: "Alirio Benavides",
    slug: "alirio-benavides",
    bio: l(
      "Maestro artesano que trabaja en soledad durante todo el año. Sus obras buscan la altura y el silencio de los Andes.",
      "A master artisan who works alone all year long. His pieces seek the height and silence of the Andes.",
    ),
    portrait: img(2, "Maestro Alirio Benavides", "Master Alirio Benavides"),
    members: [],
    since: 2004,
    neighborhood: "Sur de Pasto",
  },
  {
    id: "cr-casa-carton",
    type: "workshop",
    name: "Casa del Cartón",
    slug: "casa-del-carton",
    bio: l(
      "Un taller colectivo de cinco artesanos del centro de Pasto, donde cada obra se discute, se dibuja y se construye en equipo.",
      "A collective workshop of five artisans in downtown Pasto, where every piece is discussed, drawn and built as a team.",
    ),
    portrait: img(3, "Taller Casa del Cartón", "Casa del Cartón workshop"),
    cover: img(3, "Taller Casa del Cartón", "Casa del Cartón workshop"),
    members: ["Camila Erazo", "Jorge Ibarra", "Sofía Villota", "Andrés Mora", "Natalia Cuaical"],
    since: 2011,
    neighborhood: "Centro",
    social: { instagram: "https://instagram.com/", tiktok: "https://tiktok.com/" },
  },
];

const openWorkshop = (
  neighborhood: string,
  lat: number,
  lng: number,
  address: string,
  extra: Partial<WorkshopLocation> = {},
): WorkshopLocation => ({
  access: "open",
  publicZone: { neighborhood, lat, lng, radiusM: 0 },
  exactLocation: { lat, lng, address },
  ...extra,
});

export const floats: Float[] = [
  /* ---------------------------- Edición 2027 ---------------------------- */
  {
    id: "fl-raices",
    name: "Raíces del Galeras",
    slug: "raices-del-galeras",
    editionId: "ed-2027",
    creatorId: "cr-chachinoy",
    number: 7,
    story: l(
      "Una carroza que nace del volcán y de la gente que lo habita. Cada capa de cartón y papel recuerda el vínculo entre la tierra, la lluvia y las manos que la trabajan durante meses antes del día magno.",
      "A float born from the volcano and the people who live beside it. Each layer of cardboard and paper recalls the bond between earth, rain and the hands that shape it for months before the grand day.",
    ),
    mainImage: img(1, "Carroza Raíces del Galeras", "Raíces del Galeras float"),
    gallery: [
      img(1, "Detalle del volcán", "Volcano detail"),
      img(2, "Figuras en proceso", "Figures in progress"),
      img(3, "Pintura del taller", "Workshop paintwork"),
    ],
    maquetteFrames: frames("Raíces del Galeras"),
    viewer360: true,
    videoUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    costume: undefined,
    featured: true,
    acceptsPlayers: true,
    published: true,
    workshop: openWorkshop("Lourdes", 1.2058, -77.2748, "Calle 18 # 30-25, barrio Lourdes", {
      visitHours: l("Todos los días, 9:00 a 17:00", "Every day, 9:00 am to 5:00 pm"),
      exhibitionNote: l(
        "La obra sale a la calle desde el 28 de diciembre",
        "The piece goes out onto the street from December 28",
      ),
    }),
  },
  {
    id: "fl-condor",
    name: "El Sueño del Cóndor",
    slug: "el-sueno-del-condor",
    editionId: "ed-2027",
    creatorId: "cr-benavides",
    number: 12,
    story: l(
      "Una obra sobre la libertad, la altura y la memoria andina. El cóndor, guardián de los Andes, vuela sobre una carroza que su creador ha trabajado durante todo el año.",
      "A piece about freedom, altitude and Andean memory. The condor, guardian of the Andes, soars over a float its maker has worked on all year long.",
    ),
    mainImage: img(2, "Carroza El Sueño del Cóndor", "El Sueño del Cóndor float"),
    gallery: [
      img(2, "Alas del cóndor", "Condor wings"),
      img(1, "Estructura en cartón", "Cardboard structure"),
      img(3, "Plumaje en detalle", "Feather detail"),
    ],
    maquetteFrames: [],
    viewer360: true,
    featured: true,
    acceptsPlayers: true,
    published: true,
    workshop: {
      access: "private",
      publicZone: { neighborhood: "Sur de Pasto", lat: 1.1962, lng: -77.2835, radiusM: 450 },
      exactLocation: { lat: 1.19584, lng: -77.28291, address: "Dirección privada de ejemplo" },
      exhibitionNote: l("Solo con visita coordinada", "By arranged visit only"),
    },
  },
  {
    id: "fl-voces",
    name: "Voces de la Montaña",
    slug: "voces-de-la-montana",
    editionId: "ed-2027",
    creatorId: "cr-casa-carton",
    number: 15,
    story: l(
      "Las voces del páramo, del agua y de los abuelos tejidas en una sola obra. Un homenaje a quienes cuidan la montaña y le cantan.",
      "The voices of the páramo, the water and the elders woven into one piece. A tribute to those who look after the mountain and sing to it.",
    ),
    mainImage: img(3, "Carroza Voces de la Montaña", "Voces de la Montaña float"),
    gallery: [
      img(3, "Rostros del páramo", "Faces of the páramo"),
      img(4, "Boceto inicial", "Initial sketch"),
      img(1, "Montaje en el taller", "Workshop assembly"),
    ],
    maquetteFrames: [],
    viewer360: true,
    featured: false,
    acceptsPlayers: true,
    published: true,
    workshop: openWorkshop("Centro", 1.2142, -77.2797, "Carrera 24 # 17-40, Centro", {
      visitHours: l("Lunes a sábado, 10:00 a 18:00", "Monday to Saturday, 10:00 am to 6:00 pm"),
      exhibitionNote: l(
        "Se exhibe en el taller desde el 20 de diciembre",
        "On view at the workshop from December 20",
      ),
    }),
  },
  {
    id: "fl-hilo",
    name: "El Hilo de la Tierra",
    slug: "el-hilo-de-la-tierra",
    editionId: "ed-2027",
    creatorId: "cr-casa-carton",
    number: 21,
    story: l(
      "Un hilo que une las manos tejedoras con los surcos del campo. La obra recorre el oficio, la siembra y la cosecha.",
      "A thread that binds weaving hands to the furrows of the field. The piece traces craft, sowing and harvest.",
    ),
    mainImage: img(4, "Carroza El Hilo de la Tierra", "El Hilo de la Tierra float"),
    gallery: [
      img(4, "Telar monumental", "Monumental loom"),
      img(2, "Colores de la cosecha", "Harvest colours"),
      img(3, "Manos en el taller", "Hands at work"),
    ],
    maquetteFrames: [],
    viewer360: true,
    featured: false,
    acceptsPlayers: true,
    published: true,
    workshop: openWorkshop("Centro", 1.2165, -77.2832, "Calle 20 # 28-12, Centro"),
  },
  /* ---------------------------- Obras anteriores ---------------------------- */
  {
    id: "fl-guardian",
    name: "El Guardián del Agua",
    slug: "el-guardian-del-agua",
    editionId: "ed-2025",
    creatorId: "cr-chachinoy",
    number: 4,
    story: l(
      "Un guardián de cartón que vigila las fuentes de agua del Galeras.",
      "A cardboard guardian watching over the waters of Galeras.",
    ),
    mainImage: img(2, "El Guardián del Agua", "El Guardián del Agua"),
    gallery: [img(2, "El Guardián del Agua", "El Guardián del Agua")],
    maquetteFrames: [],
    viewer360: false,
    featured: true,
    acceptsPlayers: false,
    published: true,
    workshop: openWorkshop("Lourdes", 1.2058, -77.2748, "Calle 18 # 30-25, barrio Lourdes"),
  },
  {
    id: "fl-volcanes",
    name: "Tierra de Volcanes",
    slug: "tierra-de-volcanes",
    editionId: "ed-2023",
    creatorId: "cr-chachinoy",
    number: 9,
    story: l(
      "Un paisaje de volcanes y neblina recreado en papel y color.",
      "A landscape of volcanoes and mist recreated in paper and colour.",
    ),
    mainImage: img(3, "Tierra de Volcanes", "Tierra de Volcanes"),
    gallery: [img(3, "Tierra de Volcanes", "Tierra de Volcanes")],
    maquetteFrames: [],
    viewer360: false,
    featured: true,
    acceptsPlayers: false,
    published: true,
    workshop: openWorkshop("Lourdes", 1.2058, -77.2748, "Calle 18 # 30-25, barrio Lourdes"),
  },
  {
    id: "fl-quinde",
    name: "El Vuelo del Quinde",
    slug: "el-vuelo-del-quinde",
    editionId: "ed-2025",
    creatorId: "cr-benavides",
    number: 18,
    story: l(
      "El colibrí andino en pleno vuelo, hecho de miles de pequeñas piezas de papel.",
      "The Andean hummingbird in full flight, made from thousands of small paper pieces.",
    ),
    mainImage: img(4, "El Vuelo del Quinde", "El Vuelo del Quinde"),
    gallery: [img(4, "El Vuelo del Quinde", "El Vuelo del Quinde")],
    maquetteFrames: [],
    viewer360: false,
    featured: true,
    acceptsPlayers: false,
    published: true,
    workshop: {
      access: "private",
      publicZone: { neighborhood: "Sur de Pasto", lat: 1.1962, lng: -77.2835, radiusM: 450 },
    },
  },
  {
    id: "fl-memoria",
    name: "Memoria de Barro",
    slug: "memoria-de-barro",
    editionId: "ed-2026",
    creatorId: "cr-casa-carton",
    number: 11,
    story: l(
      "Una obra de texturas de barro y cartón sobre la memoria del oficio.",
      "A piece of clay and cardboard textures about the memory of the craft.",
    ),
    mainImage: img(1, "Memoria de Barro", "Memoria de Barro"),
    gallery: [img(1, "Memoria de Barro", "Memoria de Barro")],
    maquetteFrames: [],
    viewer360: false,
    featured: true,
    acceptsPlayers: false,
    published: true,
    workshop: openWorkshop("Centro", 1.2142, -77.2797, "Carrera 24 # 17-40, Centro"),
  },
];

export const sampleSnapshot: ContentSnapshot = { editions, creators, floats };
