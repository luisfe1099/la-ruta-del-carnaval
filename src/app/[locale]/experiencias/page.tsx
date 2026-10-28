import { getTranslations, setRequestLocale } from "next-intl/server";
import { Media } from "@/components/media";
import { Reveal } from "@/components/motion";
import { Container, Eyebrow } from "@/components/ui";
import { getExperiences } from "@/data/repository";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata({ params }: PageProps<"/[locale]/experiencias">) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "experiences" });
  return pageMetadata({ locale, path: "/experiencias", title: t("title"), description: t("intro") });
}

export default async function ExperiencesPage({ params }: PageProps<"/[locale]/experiencias">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, items] = await Promise.all([
    getTranslations({ locale, namespace: "experiences" }),
    getExperiences(locale as Locale),
  ]);

  return (
    <Container as="section" className="py-8 md:py-14">
      <div className="max-w-2xl">
        <Eyebrow className="mb-2.5">{t("eyebrow")}</Eyebrow>
        <h1 className="font-serif text-[30px] leading-[1.1] tracking-[-0.015em] md:text-5xl">{t("title")}</h1>
        <p className="mt-4 text-[15px] leading-relaxed opacity-80 md:text-lg">{t("intro")}</p>
      </div>
      {items.length === 0 ? (
        <p className="mt-8 opacity-70">{t("empty")}</p>
      ) : (
        <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((x, i) => (
            <li key={x.slug}>
              <Reveal delay={i * 0.05}>
                <Link href={`/experiencias/${x.slug}`} className="group block overflow-hidden rounded-lg bg-carton">
                  <div className="relative h-[230px]">
                    <Media image={x.image} sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw" />
                  </div>
                  <div className="p-5">
                    <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-arcilla">
                      {t("hours", { n: x.durationHours })} · {t("group", { n: x.maxGroup })}
                    </div>
                    <h2 className="mt-1.5 font-serif text-2xl font-semibold">{x.name}</h2>
                    <p className="mt-1 text-sm opacity-75">
                      {x.creatorName} · {x.neighborhood}
                    </p>
                    {x.priceFrom != null && (
                      <p className="mt-3 text-sm font-semibold">
                        {t("from", { price: x.priceFrom.toLocaleString(locale === "es" ? "es-CO" : "en-US") })}
                      </p>
                    )}
                  </div>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
