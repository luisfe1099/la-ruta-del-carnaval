import "server-only";
import { cache } from "react";
import type { ContentSnapshot } from "./types";

/**
 * Único punto donde se elige el origen del contenido.
 * CONTENT_SOURCE=sample (por defecto) | sanity
 */
export const getSnapshot = cache(async (): Promise<ContentSnapshot> => {
  if (process.env.CONTENT_SOURCE === "sanity") {
    const { fetchSanitySnapshot } = await import("./sanity/adapter");
    return fetchSanitySnapshot();
  }
  const { sampleSnapshot } = await import("./sample");
  return sampleSnapshot;
});
