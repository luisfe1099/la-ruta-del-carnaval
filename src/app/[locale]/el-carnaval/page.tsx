import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/motion";
import { Container, Eyebrow, InternalButton } from "@/components/ui";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/el-carnaval">) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "carnival" });
  return pageMetadata({ locale, path: "/el-carnaval", title: t("title"), description: t("intro") });
}

export default async function CarnivalPage({ params }: PageProps<"/[locale]/el-carnaval">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "carnival" });
  const tn = await getTranslations({ locale, namespace: "nav" });
  const blocks = ["days", "hands", "route"] as const;

  return (
    <Container as="section" className="py-8 md:py-14">
      <div className="max-w-2xl">
        <Eyebrow className="mb-2.5">{t("eyebrow")}</Eyebrow>
        <h1 className="font-serif text-[30px] leading-[1.1] tracking-[-0.015em] md:text-5xl">{t("title")}</h1>
        <p className="mt-4 font-serif text-[17px] leading-[1.6] md:text-xl">{t("intro")}</p>
      </div>
      <div className="mt-8 grid gap-0 md:grid-cols-3 md:gap-8">
        {blocks.map((b, i) => (
          <Reveal key={b} delay={i * 0.06} className="border-t border-cafe/20 py-[18px]">
            <h2 className="mb-1.5 font-serif text-lg font-semibold">{t(`blocks.${b}.title`)}</h2>
            <p className="text-sm leading-normal opacity-75">{t(`blocks.${b}.text`)}</p>
          </Reveal>
        ))}
      </div>
      <div className="mt-6">
        <InternalButton href="/carrozas" variant="ghost">
          {tn("floats")} →
        </InternalButton>
      </div>
    </Container>
  );
}
