import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/motion";
import { Container, Eyebrow, ExternalButton, InternalButton } from "@/components/ui";
import { pageMetadata } from "@/lib/seo";
import { whatsappLink } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[locale]/como-participar">) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "howTo" });
  return pageMetadata({ locale, path: "/como-participar", title: t("title"), description: t("intro") });
}

export default async function HowToPage({ params }: PageProps<"/[locale]/como-participar">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "howTo" });
  const th = await getTranslations({ locale, namespace: "home" });
  const tw = await getTranslations({ locale, namespace: "whatsapp" });
  const tn = await getTranslations({ locale, namespace: "nav" });
  const steps = ["discover", "write", "play"] as const;

  return (
    <Container as="section" className="py-8 md:py-14">
      <div className="max-w-2xl">
        <Eyebrow className="mb-2.5">{t("eyebrow")}</Eyebrow>
        <h1 className="font-serif text-[30px] leading-[1.1] tracking-[-0.015em] md:text-5xl">{t("title")}</h1>
        <p className="mt-4 text-[15px] leading-relaxed opacity-80 md:text-lg">{t("intro")}</p>
        <ol className="mt-8">
          {steps.map((s, i) => (
            <Reveal as="li" key={s} delay={i * 0.05} className="flex gap-4 border-t border-cafe/20 py-[18px]">
              <b className="pt-[3px] font-mono text-[13px] font-medium text-arcilla">0{i + 1}</b>
              <div>
                <h2 className="mb-1 font-serif text-lg font-semibold">{th(`steps.${s}.title`)}</h2>
                <p className="text-sm leading-normal opacity-75">{th(`steps.${s}.text`)}</p>
              </div>
            </Reveal>
          ))}
        </ol>
        <div className="mt-6 flex flex-wrap gap-3">
          <ExternalButton href={whatsappLink(tw("general"))} size="lg">
            {t("cta")}
          </ExternalButton>
          <InternalButton href="/carrozas" variant="ghost" size="lg">
            {tn("floats")}
          </InternalButton>
        </div>
        <p className="mt-3 font-mono text-[11px] opacity-65">{t("ctaNote")}</p>
      </div>
    </Container>
  );
}
