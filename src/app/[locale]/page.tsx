import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FloatCard } from "@/components/float-card";
import { HeroItem, Reveal } from "@/components/motion";
import { Container, Eyebrow, InternalButton } from "@/components/ui";
import { getActiveEdition, getFloatCards } from "@/data/repository";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

const HERO_FILE = "hero.jpg";
const hasHeroPhoto = () => existsSync(path.join(process.cwd(), "public", "images", HERO_FILE));

export async function generateMetadata({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({ locale, description: t("description") });
}

function MapTeaser({ open, zone }: { open: string; zone: string }) {
  return (
    <div
      role="img"
      aria-label={`${open} · ${zone}`}
      className="relative h-[220px] overflow-hidden bg-carton md:h-[300px]"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg,transparent 0 31px,rgba(43,29,20,.08) 31px 32px),repeating-linear-gradient(90deg,transparent 0 31px,rgba(43,29,20,.08) 31px 32px)",
      }}
    >
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 346 220" preserveAspectRatio="none" aria-hidden>
        <path d="M10 190 C80 140 110 190 170 120 S280 90 336 30" stroke="#A8553A" strokeWidth="2" fill="none" strokeDasharray="5 5" />
      </svg>
      {[
        ["15%", "68%"],
        ["48%", "53%"],
        ["75%", "38%"],
      ].map(([l, t], i) => (
        <span key={i} className="ruta-pin absolute" style={{ left: l, top: t }} />
      ))}
      {[
        ["62%", "58%"],
        ["26%", "27%"],
      ].map(([l, t], i) => (
        <span
          key={i}
          className="absolute h-14 w-14 rounded-full border-[1.5px] border-dashed border-cafe bg-cafe/10"
          style={{ left: l, top: t }}
        />
      ))}
    </div>
  );
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "home" });
  const tc = await getTranslations({ locale, namespace: "common" });
  const [edition, featured] = await Promise.all([
    getActiveEdition(),
    getFloatCards(locale as Locale, { featuredOnly: true }),
  ]);

  const heroPhoto = hasHeroPhoto();
  const steps = ["discover", "write", "play"] as const;

  return (
    <>
      <section
        className="relative flex min-h-[560px] flex-col justify-end overflow-hidden text-kraft md:min-h-[640px]"
        style={
          heroPhoto
            ? { backgroundColor: "#2B1D14" }
            : {
                background:
                  "linear-gradient(180deg,rgba(43,29,20,.35) 0%,rgba(43,29,20,.1) 35%,rgba(43,29,20,.88) 100%),radial-gradient(circle at 70% 30%,#C98B2B 0,transparent 40%),radial-gradient(circle at 25% 60%,#A8553A 0,transparent 45%),#5a3a26",
              }
        }
      >
        {heroPhoto && (
          <>
            <Image src={`/images/${HERO_FILE}`} alt="" fill priority sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(43,29,20,.45)_0%,rgba(43,29,20,.15)_35%,rgba(43,29,20,.88)_100%)]" />
          </>
        )}
        <Container className="relative pb-7 pt-28 md:pb-16">
          <HeroItem>
            <p className="mb-3.5 font-mono text-[11px] uppercase tracking-[0.14em] opacity-85">{t("tag")}</p>
          </HeroItem>
          <HeroItem delay={0.08}>
            <h1 className="font-serif text-[44px] font-normal leading-[1.02] tracking-[-0.02em] md:text-7xl">
              {t("title1")}
              <br />
              {t("title2") && `${t("title2")} `}
              <em className="text-carton">{t("titleEm")}</em>
            </h1>
          </HeroItem>
          <HeroItem delay={0.16}>
            <p className="mt-3.5 max-w-[300px] text-[15px] leading-normal opacity-90 md:max-w-md md:text-lg">
              {t("support")}
            </p>
          </HeroItem>
          <HeroItem delay={0.24} className="mt-[22px] flex flex-wrap gap-2.5">
            <InternalButton href="/carrozas" variant="ghost" className="!border-kraft !bg-kraft text-cafe hover:!bg-carton">
              {t("ctaFloats")}
            </InternalButton>
            <InternalButton href="/mapa" variant="ghost" className="!border-kraft/60 text-kraft hover:!bg-kraft/10">
              {t("ctaMap")}
            </InternalButton>
          </HeroItem>
        </Container>
      </section>

      <section className="py-11 md:py-20">
        <Container className="md:grid md:grid-cols-[1fr_1.4fr] md:gap-16">
          <Reveal>
            <Eyebrow className="mb-2.5">{t("howEyebrow")}</Eyebrow>
            <h2 className="whitespace-pre-line font-serif text-[30px] leading-[1.1] tracking-[-0.015em] md:text-5xl">
              {t("howTitle")}
            </h2>
          </Reveal>
          <ol className="mt-6 md:mt-0">
            {steps.map((s, i) => (
              <Reveal as="li" key={s} delay={i * 0.06} className="flex gap-4 border-t border-cafe/20 py-[18px]">
                <b className="pt-[3px] font-mono text-[13px] font-medium text-arcilla">0{i + 1}</b>
                <div>
                  <h3 className="mb-1 font-serif text-lg font-semibold">{t(`steps.${s}.title`)}</h3>
                  <p className="text-sm leading-normal opacity-75">{t(`steps.${s}.text`)}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      <section className="bg-carton py-11 md:py-20">
        <Container>
          <Reveal>
            <Eyebrow className="mb-2.5">{t("featuredEyebrow", { year: edition.year })}</Eyebrow>
            <h2 className="font-serif text-[30px] leading-[1.1] tracking-[-0.015em] md:text-5xl">
              {t("featuredTitle")}
            </h2>
          </Reveal>
          <ul className="mt-6 grid gap-[22px] md:grid-cols-2 lg:grid-cols-3">
            {featured.map((f, i) => (
              <Reveal as="li" key={f.slug} delay={i * 0.06}>
                <FloatCard float={f} />
              </Reveal>
            ))}
          </ul>
          <div className="mt-8">
            <InternalButton href="/carrozas" variant="ghost">
              {tc("viewAll")} →
            </InternalButton>
          </div>
        </Container>
      </section>

      <section className="py-11 md:py-20">
        <Container className="md:grid md:grid-cols-2 md:items-center md:gap-16">
          <Reveal>
            <Eyebrow className="mb-2.5">{t("mapEyebrow")}</Eyebrow>
            <h2 className="whitespace-pre-line font-serif text-[30px] leading-[1.1] tracking-[-0.015em] md:text-5xl">
              {t("mapTitle")}
            </h2>
          </Reveal>
          <Reveal delay={0.08} className="mt-[22px] md:mt-0">
            <Link href="/mapa" className="block" aria-label={t("ctaMap")}>
              <MapTeaser open={t("legendOpen")} zone={t("legendZone")} />
            </Link>
            <div className="mt-2.5 flex gap-4 font-mono text-[10px] opacity-70">
              <span>● {t("legendOpen")}</span>
              <span>◌ {t("legendZone")}</span>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
