import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { absoluteUrl } from "./site";

/** Metadatos comunes: canonical, alternates ES/EN y Open Graph. */
export function pageMetadata({
  locale,
  path = "",
  title,
  description,
}: {
  locale: string;
  path?: string;
  title?: string;
  description: string;
}): Metadata {
  return {
    ...(title ? { title } : {}),
    description,
    alternates: {
      canonical: absoluteUrl(locale, path),
      languages: Object.fromEntries(routing.locales.map((l) => [l, absoluteUrl(l, path)])),
    },
    openGraph: {
      url: absoluteUrl(locale, path),
      ...(title ? { title } : {}),
      description,
      locale: locale === "es" ? "es_CO" : "en_US",
    },
  };
}
