import "server-only";
import { createClient } from "next-sanity";
import type { ContentSnapshot } from "../types";

const photo = `{ "src": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height, alt }`;

/**
 * La ubicación exacta solo se proyecta cuando el taller es abierto:
 * los talleres privados nunca la traen, ni siquiera al servidor.
 */
const QUERY = /* groq */ `{
  "editions": *[_type == "edition"]{ "id": _id, year, startDate, paradeDate, active },
  "creators": *[_type == "creator"]{
    "id": _id, type, name, "slug": slug.current, bio, members, since, neighborhood, social,
    "portrait": portrait${photo},
    "cover": cover${photo}
  },
  "floats": *[_type == "float" && published == true]{
    "id": _id, name, "slug": slug.current, number, story, videoUrl, costume,
    viewer360, featured, acceptsPlayers, published,
    "editionId": edition._ref,
    "creatorId": creator._ref,
    "mainImage": mainImage${photo},
    "gallery": gallery[]${photo},
    "maquetteFrames": maquetteFrames[]${photo},
    "model3D": select(defined(model3D.glb.asset) => { "glbUrl": model3D.glb.asset->url, "posterUrl": model3D.poster.asset->url }),
    "workshop": workshop{
      access, publicZone, visitHours, exhibitionNote,
      "exactLocation": select(access == "open" => exactLocation)
    }
  }
}`;

export async function fetchSanitySnapshot(): Promise<ContentSnapshot> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  if (!projectId) {
    throw new Error("CONTENT_SOURCE=sanity requiere NEXT_PUBLIC_SANITY_PROJECT_ID");
  }

  const token = process.env.SANITY_API_READ_TOKEN;
  const client = createClient({
    projectId,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
    apiVersion: "2025-01-01",
    useCdn: !token,
    token,
  });

  const data = await client.fetch<ContentSnapshot>(QUERY, {}, { next: { revalidate: 300 } });
  return {
    editions: data.editions ?? [],
    creators: (data.creators ?? []).map((c) => ({ ...c, members: c.members ?? [] })),
    floats: (data.floats ?? []).map((f) => ({
      ...f,
      gallery: f.gallery ?? [],
      maquetteFrames: f.maquetteFrames ?? [],
    })),
  };
}
