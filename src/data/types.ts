/**
 * Modelo de contenido "crudo" (tal como vive en el CMS).
 * Los componentes NUNCA lo consumen: pasan por `repository`, que devuelve
 * los tipos públicos de `./public.ts` (localizados y sin datos privados).
 */

export type Locale = "es" | "en";
export type Localized<T = string> = Record<Locale, T>;

/** Tono del placeholder visual mientras no hay foto real. */
export type Tone = 1 | 2 | 3 | 4;

export interface ImageAsset {
  /** URL de la imagen (CDN de Sanity o ruta en /public). Vacío => placeholder. */
  src?: string;
  width?: number;
  height?: number;
  alt?: Localized;
  tone?: Tone;
}

export interface Edition {
  id: string;
  year: number;
  startDate: string; // ISO yyyy-mm-dd
  paradeDate: string; // ISO yyyy-mm-dd
  active: boolean;
}

export interface Creator {
  id: string;
  type: "individual" | "workshop";
  name: string;
  slug: string;
  bio: Localized;
  portrait?: ImageAsset;
  cover?: ImageAsset;
  members: string[];
  since?: number;
  neighborhood: string;
  social?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    website?: string;
  };
}

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface WorkshopLocation {
  access: "open" | "private";
  /** Zona aproximada: segura para publicar. */
  publicZone: { neighborhood: string; lat: number; lng: number; radiusM: number };
  /** PRIVADO: solo se publica si access === "open". */
  exactLocation?: GeoPoint & { address?: string };
  visitHours?: Localized;
  exhibitionNote?: Localized;
}

export interface Float {
  id: string;
  name: string;
  slug: string;
  editionId: string;
  creatorId: string;
  number: number;
  story: Localized;
  mainImage: ImageAsset;
  gallery: ImageAsset[];
  /** Fotos de la maqueta ordenadas por ángulo (0° → 360°). */
  maquetteFrames: ImageAsset[];
  viewer360: boolean;
  model3D?: { glbUrl: string; posterUrl?: string };
  videoUrl?: string;
  costume?: Localized;
  featured: boolean;
  acceptsPlayers: boolean;
  published: boolean;
  workshop: WorkshopLocation;
}

export interface ContentSnapshot {
  editions: Edition[];
  creators: Creator[];
  floats: Float[];
}
