import { getTranslations, setRequestLocale } from "next-intl/server";
import { FloatsCatalog } from "@/components/floats-catalog";
import { Container, Eyebrow } from "@/components/ui";
import { getActiveEdition, getFloatCards } from "@/data/repository";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata({ params }: PageProps<"/[locale]/carrozas">) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "floats" });
  const edition = await getActiveEdition();
  return pageMetadata({
    locale,
    path: "/carrozas",
    title: t("title"),
    description: t("metaDescription", { year: edition.year }),
  });
}

export default async function FloatsPage({ params }: PageProps<"/[locale]/carrozas">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "floats" });
  const [edition, floats] = await Promise.all([getActiveEdition(), getFloatCards(locale as Locale)]);

  return (
    <Container as="section" className="py-8 md:py-14">
      <Eyebrow className="mb-2.5">{t("eyebrow", { year: edition.year, count: floats.length })}</Eyebrow>
      <h1 className="font-serif text-[30px] leading-[1.1] tracking-[-0.015em] md:text-5xl">{t("title")}</h1>
      <FloatsCatalog floats={floats} />
    </Container>
  );
}
