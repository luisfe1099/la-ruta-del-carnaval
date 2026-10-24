import { getTranslations, setRequestLocale } from "next-intl/server";
import { MapLoader } from "@/components/map-loader";
import { getMapPoints } from "@/data/repository";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { pad2, whatsappLink } from "@/lib/site";

export const revalidate = 300;

export async function generateMetadata({ params }: PageProps<"/[locale]/mapa">) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "map" });
  return pageMetadata({ locale, path: "/mapa", title: t("title"), description: t("description") });
}

export default async function MapPage({ params }: PageProps<"/[locale]/mapa">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "map" });
  const tw = await getTranslations({ locale, namespace: "whatsapp" });
  const points = await getMapPoints(locale as Locale);

  const visitHrefs = Object.fromEntries(
    points
      .filter((p) => p.access === "private")
      .map((p) => [p.slug, whatsappLink(tw("visit", { name: p.name, number: pad2(p.number) }))]),
  );

  return (
    <section aria-labelledby="map-title">
      <h1 id="map-title" className="sr-only">
        {t("title")}
      </h1>
      <div className="h-[calc(100dvh-60px-var(--tabbar-h)-env(safe-area-inset-bottom))] md:h-[calc(100dvh-65px)]">
        <MapLoader points={points} visitHrefs={visitHrefs} />
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-1 bg-kraft px-[22px] py-3 font-mono text-[10px] opacity-80 md:px-8">
        <span>● {t("legendOpen")}</span>
        <span>◌ {t("legendZone")}</span>
      </div>
    </section>
  );
}
