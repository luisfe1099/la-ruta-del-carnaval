/** Tipos que consumen los componentes: ya localizados y sin datos privados. */

import type { GeoPoint, Tone } from "./types";

export interface PublicImage {
  src?: string;
  width?: number;
  height?: number;
  alt: string;
  tone: Tone;
}

/**
 * Unión discriminada: en un taller privado el tipo ni siquiera admite
 * coordenadas exactas, de modo que no pueden llegar al cliente por error.
 */
export type PublicLocation =
  | {
      access: "open";
      neighborhood: string;
      exact: GeoPoint & { address?: string };
      visitHours?: string;
      exhibitionNote?: string;
    }
  | {
      access: "private";
      neighborhood: string;
      zone: GeoPoint & { radiusM: number };
      visitHours?: string;
      exhibitionNote?: string;
    };

export interface PublicEdition {
  year: number;
  startDate: string;
  paradeDate: string;
  active: boolean;
}

export interface FloatCardData {
  slug: string;
  number: number;
  name: string;
  image: PublicImage;
  creatorName: string;
  creatorSlug: string;
  access: "open" | "private";
  year: number;
}

export interface PublicCreatorRef {
  slug: string;
  name: string;
  type: "individual" | "workshop";
  portrait: PublicImage;
}

export interface FloatDetail extends FloatCardData {
  story: string;
  gallery: PublicImage[];
  maquetteFrames: PublicImage[];
  viewer360: boolean;
  model3D?: { glbUrl: string; posterUrl?: string };
  videoUrl?: string;
  costume?: string;
  featured: boolean;
  /** Ya combina acceptsPlayers con "edición activa". */
  canJoin: boolean;
  location: PublicLocation;
  creator: PublicCreatorRef;
  edition: PublicEdition;
  /** Obras destacadas del mismo creador en otras ediciones (máx. 2). */
  pastWorks: FloatCardData[];
  experience?: ExperienceRef;
}

export interface ExperienceRef {
  slug: string;
  name: string;
}

export interface ExperienceCardData extends ExperienceRef {
  image: PublicImage;
  creatorName: string;
  creatorSlug: string;
  neighborhood: string;
  durationHours: number;
  maxGroup: number;
  priceFrom?: number;
  languages: string[];
}

export interface ExperienceDetail extends ExperienceCardData {
  description: string;
  learns: string[];
  activity: string;
  keepsake: string;
  includes: string[];
  gallery: PublicImage[];
  seasonStart?: string;
  seasonEnd?: string;
  year: number;
  /** Solo zona aproximada (barrio); la dirección se comparte por WhatsApp. */
  creator: PublicCreatorRef;
}

export interface CreatorListItem extends PublicCreatorRef {
  members: number;
  neighborhood: string;
  floatCount: number;
}

export interface CreatorDetail extends PublicCreatorRef {
  bio: string;
  cover: PublicImage;
  members: string[];
  since?: number;
  neighborhood: string;
  social: { label: string; url: string }[];
  /** Acceso de la obra de la edición activa (si la hay). */
  access?: "open" | "private";
  floats: (FloatCardData & { canJoin: boolean })[];
  pastWorks: FloatCardData[];
  experience?: ExperienceRef;
}

export interface MapPoint {
  slug: string;
  number: number;
  name: string;
  image: PublicImage;
  neighborhood: string;
  access: "open" | "private";
  /** Coordenadas exactas (open) o centro de la zona aproximada (private). */
  lat: number;
  lng: number;
  radiusM?: number;
}
