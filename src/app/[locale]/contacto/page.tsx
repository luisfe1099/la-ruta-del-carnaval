import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container, Eyebrow, ExternalButton } from "@/components/ui";
import { pageMetadata } from "@/lib/seo";
import { whatsappLink } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[locale]/contacto">) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return pageMetadata({ locale, path: "/contacto", title: t("title"), description: t("intro") });
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contacto">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "contact" });
  const tw = await getTranslations({ locale, namespace: "whatsapp" });

  return (
    <Container as="section" className="py-8 md:py-14">
      <div className="max-w-2xl">
        <Eyebrow className="mb-2.5">{t("eyebrow")}</Eyebrow>
        <h1 className="font-serif text-[30px] leading-[1.1] tracking-[-0.015em] md:text-5xl">{t("title")}</h1>
        <p className="mt-4 text-[15px] leading-relaxed opacity-80 md:text-lg">{t("intro")}</p>
        <div className="mt-6">
          <ExternalButton href={whatsappLink(tw("general"))} size="lg">
            {t("cta")}
          </ExternalButton>
        </div>
        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.1em] opacity-65">{t("city")}</p>
      </div>
    </Container>
  );
}
