import { getTranslations, setRequestLocale } from "next-intl/server";
import { Media } from "@/components/media";
import { Reveal } from "@/components/motion";
import { Container, Eyebrow } from "@/components/ui";
import { getCreators } from "@/data/repository";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata({ params }: PageProps<"/[locale]/creadores">) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "creators" });
  return pageMetadata({ locale, path: "/creadores", title: t("title"), description: t("intro") });
}

export default async function CreatorsPage({ params }: PageProps<"/[locale]/creadores">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "creators" });
  const creators = await getCreators(locale as Locale);

  return (
    <Container as="section" className="py-8 md:py-14">
      <Eyebrow className="mb-2.5">{t("eyebrow")}</Eyebrow>
      <h1 className="font-serif text-[30px] leading-[1.1] tracking-[-0.015em] md:text-5xl">{t("title")}</h1>
      <p className="mt-3 max-w-xl text-sm leading-normal opacity-75 md:text-base">{t("intro")}</p>
      <ul className="mt-[22px] border-b border-cafe/20 md:grid md:grid-cols-2 md:gap-x-12">
        {creators.map((c, i) => (
          <Reveal as="li" key={c.slug} delay={Math.min(i, 3) * 0.05} className="border-t border-cafe/20">
            <Link href={`/creadores/${c.slug}`} className="group flex items-center gap-3.5 py-4">
              <div className="relative h-16 w-16 flex-none overflow-hidden rounded-full">
                <Media image={c.portrait} sizes="64px" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-mono text-[10px] uppercase tracking-[0.1em] opacity-60">
                  {c.type === "workshop" ? t("workshopMembers", { count: c.members }) : t("individual")}
                </div>
                <b className="font-serif text-[19px] font-semibold">{c.name}</b>
                <div className="mt-0.5 text-xs opacity-70">
                  {t("floatCount", { count: c.floatCount })} · {c.neighborhood}
                </div>
              </div>
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </Reveal>
        ))}
      </ul>
    </Container>
  );
}
