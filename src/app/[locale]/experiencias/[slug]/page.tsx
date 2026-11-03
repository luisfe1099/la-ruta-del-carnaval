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
import { formatDuration, formatGroup, formatPrice } from "@/lib/experience-format";
import { whatsappLink } from "@/lib/site";
import { pad2 } from "@/lib/site";

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
    title: `${x.name} · ${x.workshopName}`,
    description: x.description.length > 155 ? `${x.description.slice(0, 152)}…` : x.description,
  });
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

  const href = whatsappLink(tw("experience", { name: x.name, workshop: x.workshopName }));
  const fmt = (iso: string) =>
    new Date(`${iso}T12:00:00`).toLocaleDateString(locale === "es" ? "es-CO" : "en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  const season =
    x.seasonStart && x.seasonEnd ? t("seasonRange", { start: fmt(x.seasonStart), end: fmt(x.seasonEnd) }) : undefined;
  const schedule = x.departureTime ? t("daily", { time: x.departureTime }) : t("dailyTbc");
  const facts = [
    { k: t("duration"), v: formatDuration(t, x) },
    { k: t("groupLabel"), v: formatGroup(t, x) },
    { k: t("departure"), v: schedule },
    { k: t("meeting"), v: x.meetingPoint ?? t("tbc") },
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
            <p className="mt-4 font-serif text-[17px] leading-[1.6]">{x.description}</p>
            <p className="mt-5">
              <b className="font-serif text-2xl">{formatPrice(t, x, locale)}</b>
              <span className="mt-1 block text-xs opacity-65">{t("priceNote")}</span>
            </p>
            <ExternalButton href={href} size="lg" className="mt-5 w-full max-md:hidden">
              {t("cta")}
            </ExternalButton>
            <p className="mt-3 text-xs opacity-65">{t("cancel")}</p>
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

        <div className="mt-9 space-y-9 lg:mt-10">
          <section>
            <Eyebrow className="mb-4">{t("itinerary")}</Eyebrow>
            <ol className="relative space-y-6 border-l border-arcilla/35 pl-7">
              {x.stops.map((st, i) => (
                <li key={i} className="relative">
                  <span
                    aria-hidden
                    className="absolute -left-[37px] top-0 flex h-[19px] w-[19px] items-center justify-center rounded-full bg-arcilla font-mono text-[10px] text-kraft"
                  >
                    {i + 1}
                  </span>
                  <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-arcilla">
                    {t("step", { n: pad2(i + 1) })}
                    {st.minutes ? ` · ${t("minutes", { n: st.minutes })}` : ""}
                  </div>
                  <h2 className="mt-1 font-serif text-xl font-semibold">{st.title}</h2>
                  {st.description && <p className="mt-1 text-[15px] leading-relaxed opacity-80">{st.description}</p>}
                  {st.kind === "workshop" && (
                    <Link
                      href={`/creadores/${x.workshop.slug}`}
                      className="mt-3 flex items-center gap-3 rounded-lg bg-carton p-3"
                    >
                      <div className="relative h-[46px] w-[46px] flex-none overflow-hidden rounded-full">
                        <Media image={x.workshop.portrait} sizes="46px" />
                      </div>
                      <div className="min-w-0">
                        <b className="block font-serif text-[17px] font-semibold">{x.workshop.name}</b>
                        <span className="block text-xs opacity-70">{t("zone", { name: x.neighborhood })}</span>
                      </div>
                      <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.1em] text-arcilla">
                        {t("workshopLink")} →
                      </span>
                    </Link>
                  )}
                </li>
              ))}
            </ol>
            <p className="mt-5 rounded-lg border border-cafe/20 p-4 text-sm leading-relaxed opacity-80">{t("privacy")}</p>
          </section>

          {x.includes.length > 0 && (
            <Reveal>
              <Eyebrow className="mb-3">{t("includes")}</Eyebrow>
              <ul className="space-y-2.5">
                {x.includes.map((k) => (
                  <li key={k} className="flex gap-3 text-[15px] leading-snug">
                    <span aria-hidden className="mt-[9px] h-1.5 w-1.5 flex-none rounded-full bg-arcilla" />
                    {t(`inc.${k}`)}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
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
