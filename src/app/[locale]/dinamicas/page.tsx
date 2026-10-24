import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/motion";
import { Container, Eyebrow, InternalButton } from "@/components/ui";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/dinamicas">) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dynamics" });
  return pageMetadata({ locale, path: "/dinamicas", title: t("title"), description: t("intro") });
}

export default async function DynamicsPage({ params }: PageProps<"/[locale]/dinamicas">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "dynamics" });

  return (
    <Container as="section" className="py-8 md:py-14">
      <div className="max-w-2xl">
        <Eyebrow className="mb-2.5">{t("eyebrow")}</Eyebrow>
        <h1 className="font-serif text-[30px] leading-[1.1] tracking-[-0.015em] md:text-5xl">{t("title")}</h1>
        <p className="mt-4 text-[15px] leading-relaxed opacity-80 md:text-lg">{t("intro")}</p>
      </div>
      <Reveal className="mt-8 max-w-2xl rounded-lg bg-carton p-6 md:p-8">
        <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-arcilla">{t("teaserTag")}</div>
        <h2 className="mt-2 font-serif text-2xl font-semibold md:text-3xl">{t("teaserTitle")}</h2>
        <p className="mt-2 text-sm leading-normal opacity-75 md:text-base">{t("teaserText")}</p>
      </Reveal>
      <div className="mt-6">
        <InternalButton href="/carrozas" variant="ghost">
          {t("cta")} →
        </InternalButton>
      </div>
    </Container>
  );
}
