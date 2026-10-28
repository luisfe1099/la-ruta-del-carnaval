import type { MetadataRoute } from "next";
import { getCreatorSlugs, getExperienceSlugs, getFloatSlugs } from "@/data/repository";
import { routing } from "@/i18n/routing";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [floats, creators, experiences] = await Promise.all([getFloatSlugs(), getCreatorSlugs(), getExperienceSlugs()]);
  const paths = [
    "",
    "/carrozas",
    "/mapa",
    "/creadores",
    "/el-carnaval",
    "/como-participar",
    "/experiencias",
    "/dinamicas",
    "/contacto",
    ...floats.map((s) => `/carrozas/${s}`),
    ...creators.map((s) => `/creadores/${s}`),
    ...experiences.map((s) => `/experiencias/${s}`),
  ];

  return paths.map((path) => ({
    url: absoluteUrl(routing.defaultLocale, path),
    lastModified: new Date(),
    alternates: {
      languages: Object.fromEntries(routing.locales.map((l) => [l, absoluteUrl(l, path)])),
    },
  }));
}
