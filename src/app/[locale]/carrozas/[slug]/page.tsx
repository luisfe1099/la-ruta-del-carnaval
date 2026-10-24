import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { FloatCard } from "@/components/float-card";
import { Media } from "@/components/media";
import { Reveal } from "@/components/motion";
import { Model3D } from "@/components/model-3d";
import { GalleryCarousel } from "@/components/gallery-carousel";
import { StickyCta } from "@/components/sticky-cta";
import { Container, Eyebrow, ExternalButton } from "@/components/ui";
import { MIN_360_FRAMES, Viewer360 } from "@/components/viewer-360";
import { VideoModal } from "@/components/video-modal";
import { WorkshopInfo } from "@/components/workshop-info";
import { getFloat, getFloatSlugs, getOtherFloats } from "@/data/repository";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { pad2, whatsappLink } from "@/lib/site";

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getFloatSlugs();
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/carrozas/[slug]">) {
  const { locale, slug } = await params;
  const float = await getFloat(locale as Locale, slug);
  if (!float) return {};
  const t = await getTranslations({ locale, namespace: "common" });
  return pageMetadata({
    locale,
    path: `/carrozas/${slug}`,
    title: `${float.name} · ${t("number", { n: pad2(float.number) })}`,
    description: float.story.length > 155 ? `${float.story.slice(0, 152)}…` : float.story,
  });
}

export default async function FloatPage({ params }: PageProps<"/[locale]/carrozas/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const float = await getFloat(locale as Locale, slug);
  if (!float) notFound();

  const [t, tc, tw] = await Promise.all([
    getTranslations({ locale, namespace: "float" }),
    getTranslations({ locale, namespace: "common" }),
    getTranslations({ locale, namespace: "whatsapp" }),
  ]);
  const others = await getOtherFloats(locale as Locale, slug, 3);

  const n = pad2(float.number);
  const joinHref = whatsappLink(tw("float", { name: float.name, number: n, year: float.edition.year }));
  const visitHref = whatsappLink(tw("visit", { name: float.name, number: n }));
  const hasViewer = float.viewer360 && float.maquetteFrames.length >= MIN_360_FRAMES;

  return (
    <article>
      <div className="mx-auto flex max-w-6xl flex-col lg:grid lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-start lg:gap-x-14 lg:px-8 lg:pt-10">
        {/* Columna izquierda en escritorio: media */}
        <div className="contents lg:flex lg:flex-col lg:gap-10">
          <div className="relative order-1 h-[380px] overflow-hidden md:h-[480px] lg:h-[560px]">
            <Media image={float.image} priority sizes="(min-width: 1024px) 700px, 100vw" />
            <div className="absolute inset-0 bg-gradient-to-b from-cafe/25 via-transparent via-40% to-cafe/60" />
            {float.videoUrl && <VideoModal url={float.videoUrl} className="absolute bottom-[18px] right-[18px] z-[2]" />}
          </div>

          {float.gallery.length > 0 && (
            <Reveal className="order-4 mt-7 px-[22px] lg:mt-0 lg:px-0">
              <h2 className="sr-only">{t("gallery")}</h2>
              <GalleryCarousel images={float.gallery} />
            </Reveal>
          )}

          {hasViewer && (
            <section className="order-5 mt-[30px] px-[22px] lg:mt-0 lg:px-0">
              <Eyebrow className="mb-3">{t("rotate")}</Eyebrow>
              <Viewer360 frames={float.maquetteFrames} />
            </section>
          )}

          {float.model3D && (
            <section className="order-5 mt-[30px] px-[22px] lg:mt-0 lg:px-0">
              <Eyebrow className="mb-3">{t("model3d")}</Eyebrow>
              <Model3D glbUrl={float.model3D.glbUrl} posterUrl={float.model3D.posterUrl} alt={float.name} />
            </section>
          )}

          {float.pastWorks.length > 0 && (
            <section className="order-7 mt-[30px] px-[22px] lg:mt-0 lg:px-0">
              <Eyebrow className="mb-3">{t("previousWorks")}</Eyebrow>
              <ul className="grid grid-cols-2 gap-2.5">
                {float.pastWorks.map((w) => (
                  <li key={w.slug}>
                    <Link href={`/carrozas/${w.slug}`} className="group block">
                      <div className="relative h-[110px] overflow-hidden md:h-[160px]">
                        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                          <Media image={w.image} sizes="(min-width: 1024px) 300px, 50vw" />
                        </div>
                      </div>
                      <div className="mt-1.5 font-mono text-[10px] opacity-70">
                        {w.year} · {w.name}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Columna derecha en escritorio: texto */}
        <div className="contents lg:flex lg:flex-col lg:gap-8">
          <header className="order-2 px-[22px] pt-[26px] lg:px-0 lg:pt-0">
            <div className="font-mono text-xs tracking-[0.1em] text-arcilla">
              {t("edition", { n, year: float.edition.year }).toUpperCase()}
            </div>
            <h1 className="mb-4 mt-1.5 font-serif text-[38px] font-normal leading-[1.05] tracking-[-0.02em] md:text-5xl">
              {float.name}
            </h1>
            <Link
              href={`/creadores/${float.creator.slug}`}
              className="flex items-center gap-3 border-y border-cafe/20 py-3.5"
            >
              <div className="relative h-[46px] w-[46px] flex-none overflow-hidden rounded-full">
                <Media image={float.creator.portrait} sizes="46px" />
              </div>
              <div>
                <small className="block font-mono text-[10px] uppercase tracking-[0.1em] opacity-60">
                  {tc("madeBy")}
                </small>
                <b className="font-serif text-[17px] font-semibold">{float.creator.name}</b>
              </div>
            </Link>
            {float.canJoin && (
              <ExternalButton href={joinHref} size="lg" className="mt-5 w-full max-md:hidden">
                {t("cta")}
              </ExternalButton>
            )}
          </header>

          <section className="order-3 mt-[26px] px-[22px] lg:mt-0 lg:px-0">
            <Eyebrow className="mb-3">{t("story")}</Eyebrow>
            <p className="font-serif text-[17px] leading-[1.6] first-letter:float-left first-letter:pr-2 first-letter:pt-1 first-letter:text-[52px] first-letter:leading-[0.9] first-letter:text-arcilla">
              {float.story}
            </p>
          </section>

          <div className="order-6 mt-[26px] px-[22px] lg:mt-0 lg:px-0">
            <WorkshopInfo float={float} visitHref={visitHref} />
          </div>
        </div>
      </div>

      {others.length > 0 && (
        <section className={`mt-[30px] py-11 md:mt-16 md:bg-carton md:py-16 ${float.canJoin ? "pb-40 md:pb-16" : ""}`}>
          <Container>
            <Eyebrow className="mb-2">{t("otherEyebrow")}</Eyebrow>
            <h2 className="font-serif text-2xl md:text-4xl">{t("otherTitle")}</h2>
            <ul className="mt-6 grid gap-[22px] md:grid-cols-2 lg:grid-cols-3">
              {others.map((o) => (
                <li key={o.slug}>
                  <FloatCard float={o} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {float.canJoin && <StickyCta href={joinHref} label={t("cta")} />}
    </article>
  );
}
