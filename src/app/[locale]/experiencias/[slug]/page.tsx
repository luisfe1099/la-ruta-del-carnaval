import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Media } from "@/components/media";
import { Reveal } from "@/components/motion";
import { StickyCta } from "@/components/sticky-cta";
import { Container, Eyebrow, ExternalButton } from "@/components/ui";
import { getExperience, getExperienceSlugs } from "@/data/repository";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { whatsappLink } from "@/lib/site";

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getExperienceSlugs();
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/experiencias/[slug]">) {
  const { locale, slug } = await params;
  const x = await getExperience(locale as Locale, slug);
  if (!x) return {};
  return pageMetadata({
    locale,
    path: `/experiencias/${slug}`,
    title: `${x.name} · ${x.creatorName}`,
    description: x.description.length > 155 ? `${x.description.slice(0, 152)}…` : x.description,
  });
}

function List({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <section>
      <Eyebrow className="mb-3">{title}</Eyebrow>
      <ul className="space-y-2.5">
        {items.map((v) => (
          <li key={v} className="flex gap-3 text-[15px] leading-snug">
            <span aria-hidden className="mt-[9px] h-1.5 w-1.5 flex-none rounded-full bg-arcilla" />
            {v}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function ExperiencePage({ params }: PageProps<"/[locale]/experiencias/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const x = await getExperience(locale as Locale, slug);
  if (!x) notFound();
  const [t, tw] = await Promise.all([
    getTranslations({ locale, namespace: "experiences" }),
    getTranslations({ locale, namespace: "whatsapp" }),
  ]);

  const href = whatsappLink(tw("experience", { name: x.name, workshop: x.creatorName }));
  const fmt = (iso: string) =>
    new Date(`${iso}T12:00:00`).toLocaleDateString(locale === "es" ? "es-CO" : "en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  const season = x.seasonStart && x.seasonEnd ? t("seasonRange", { start: fmt(x.seasonStart), end: fmt(x.seasonEnd) }) : undefined;
  const facts = [
    { k: t("duration"), v: t("hours", { n: x.durationHours }) },
    { k: t("groupLabel"), v: t("group", { n: x.maxGroup }) },
    { k: t("languages"), v: x.languages.map((l) => (l === "en" ? t("en") : t("es"))).join(" · ") },
    ...(season ? [{ k: t("season"), v: season }] : []),
  ];

  return (
    <article className="pb-40 md:pb-20">
      <div className="relative h-[340px] overflow-hidden md:h-[460px]">
        <Media image={x.image} priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-cafe/25 via-transparent via-40% to-cafe/70" />
      </div>

      <Container className="lg:grid lg:grid-cols-[1fr_1fr] lg:gap-16">
        <div>
          <header className="pt-[26px] md:pt-10">
            <Eyebrow>
              {t("eyebrow")} · {x.year}
            </Eyebrow>
            <h1 className="mt-1.5 font-serif text-[38px] font-normal leading-[1.05] tracking-[-0.02em] md:text-5xl">
              {x.name}
            </h1>
            <Link
              href={`/creadores/${x.creator.slug}`}
              className="mt-4 flex items-center gap-3 border-y border-cafe/20 py-3.5"
            >
              <div className="relative h-[46px] w-[46px] flex-none overflow-hidden rounded-full">
                <Media image={x.creator.portrait} sizes="46px" />
              </div>
              <div>
                <small className="block font-mono text-[10px] uppercase tracking-[0.1em] opacity-60">{t("host")}</small>
                <b className="font-serif text-[17px] font-semibold">{x.creatorName}</b>
                <span className="block text-xs opacity-70">{t("zone", { name: x.neighborhood })}</span>
              </div>
            </Link>
            <p className="mt-5 font-serif text-[17px] leading-[1.6]">{x.description}</p>
            {x.priceFrom != null && (
              <p className="mt-5">
                <b className="font-serif text-2xl">
                  {t("from", { price: x.priceFrom.toLocaleString(locale === "es" ? "es-CO" : "en-US") })}
                </b>
                <span className="mt-1 block text-xs opacity-65">{t("priceNote")}</span>
              </p>
            )}
            <ExternalButton href={href} size="lg" className="mt-5 w-full max-md:hidden">
              {t("cta")}
            </ExternalButton>
          </header>
          <dl className="mt-7 grid grid-cols-2 gap-4 rounded-lg bg-carton p-5">
            {facts.map((f) => (
              <div key={f.k}>
                <dt className="font-mono text-[10px] uppercase tracking-[0.12em] opacity-60">{f.k}</dt>
                <dd className="mt-[3px] text-sm">{f.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-8 space-y-8 lg:mt-10">
          <Reveal>
            <List title={t("learns")} items={x.learns} />
          </Reveal>
          {x.activity && (
            <section>
              <Eyebrow className="mb-3">{t("activity")}</Eyebrow>
              <p className="text-[15px] leading-relaxed">{x.activity}</p>
            </section>
          )}
          {x.keepsake && (
            <section>
              <Eyebrow className="mb-3">{t("keepsake")}</Eyebrow>
              <p className="text-[15px] leading-relaxed">{x.keepsake}</p>
            </section>
          )}
          <List title={t("includes")} items={x.includes} />
          <p className="rounded-lg border border-cafe/20 p-4 text-sm leading-relaxed opacity-80">{t("privacy")}</p>
        </div>
      </Container>

      {x.gallery.length > 0 && (
        <Container className="mt-10">
          <Eyebrow className="mb-3.5">{t("gallery")}</Eyebrow>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {x.gallery.map((g, i) => (
              <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-lg">
                <Media image={g} sizes="(min-width:768px) 33vw, 50vw" />
              </div>
            ))}
          </div>
        </Container>
      )}

      <StickyCta href={href} label={t("cta")} />
    </article>
  );
}
