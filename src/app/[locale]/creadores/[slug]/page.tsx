import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { FloatCard } from "@/components/float-card";
import { Media } from "@/components/media";
import { Reveal } from "@/components/motion";
import { Container, Eyebrow, ExternalButton } from "@/components/ui";
import { getActiveEdition, getCreator, getCreatorSlugs } from "@/data/repository";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { pad2, whatsappLink } from "@/lib/site";

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getCreatorSlugs();
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/creadores/[slug]">) {
  const { locale, slug } = await params;
  const c = await getCreator(locale as Locale, slug);
  if (!c) return {};
  return pageMetadata({
    locale,
    path: `/creadores/${slug}`,
    title: c.name,
    description: c.bio.length > 155 ? `${c.bio.slice(0, 152)}…` : c.bio,
  });
}

export default async function CreatorPage({ params }: PageProps<"/[locale]/creadores/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const c = await getCreator(locale as Locale, slug);
  if (!c) notFound();

  const [t, tf, tw, edition] = await Promise.all([
    getTranslations({ locale, namespace: "creators" }),
    getTranslations({ locale, namespace: "float" }),
    getTranslations({ locale, namespace: "whatsapp" }),
    getActiveEdition(),
  ]);

  const kind = c.since
    ? c.type === "workshop"
      ? t("workshopSince", { year: c.since })
      : t("individualSince", { year: c.since })
    : c.type === "workshop"
      ? t("workshopLabel")
      : t("individual");

  return (
    <article>
      <div className="relative h-[340px] overflow-hidden md:h-[460px]">
        <Media image={c.cover} priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-cafe/25 via-transparent via-40% to-cafe/70" />
      </div>

      <Container className="lg:grid lg:grid-cols-[1fr_1fr] lg:gap-16">
        <div>
          <header className="pt-[26px] md:pt-10">
            <div className="font-mono text-xs uppercase tracking-[0.1em] text-arcilla">{kind}</div>
            <h1 className="mt-1.5 font-serif text-[38px] font-normal leading-[1.05] tracking-[-0.02em] md:text-5xl">
              {c.name}
            </h1>
          </header>
          <section className="mt-[26px]">
            <Eyebrow className="mb-3">{t("history")}</Eyebrow>
            <p className="font-serif text-[17px] leading-[1.6] first-letter:float-left first-letter:pr-2 first-letter:pt-1 first-letter:text-[52px] first-letter:leading-[0.9] first-letter:text-arcilla">
              {c.bio}
            </p>
          </section>
        </div>

        <div>
          <dl className="mt-[26px] bg-carton p-[18px] lg:mt-10">
            {c.members.length > 0 && (
              <div className="mb-3">
                <dt className="font-mono text-[10px] uppercase tracking-[0.12em] opacity-60">{t("members")}</dt>
                <dd className="mt-[3px] text-sm">{c.members.join(", ")}</dd>
              </div>
            )}
            <div className="mb-3 last:mb-0">
              <dt className="font-mono text-[10px] uppercase tracking-[0.12em] opacity-60">{t("workshop")}</dt>
              <dd className="mt-[3px] text-sm">{c.neighborhood} · Pasto</dd>
            </div>
            {c.access && (
              <div className="mb-3 last:mb-0">
                <dt className="font-mono text-[10px] uppercase tracking-[0.12em] opacity-60">{t("access")}</dt>
                <dd className="mt-[3px] text-sm">
                  {c.access === "open" ? t("accessOpen") : t("accessPrivate")}
                </dd>
              </div>
            )}
            {c.social.length > 0 && (
              <div className="last:mb-0">
                <dt className="font-mono text-[10px] uppercase tracking-[0.12em] opacity-60">{t("social")}</dt>
                <dd className="mt-[3px] flex flex-wrap gap-x-4 text-sm">
                  {c.social.map((s) => (
                    <a
                      key={s.label}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2"
                    >
                      {s.label} ↗
                    </a>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </Container>

      {c.pastWorks.length > 0 && (
        <Container as="section" className="mt-[30px] md:mt-14">
          <Eyebrow className="mb-3.5">{t("pastWorks")}</Eyebrow>
          <ul className="grid grid-cols-2 gap-2.5 md:max-w-2xl md:gap-5">
            {c.pastWorks.map((w) => (
              <li key={w.slug}>
                <Link href={`/carrozas/${w.slug}`} className="group block">
                  <div className="relative h-[140px] overflow-hidden rounded-lg md:h-[220px]">
                    <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                      <Media image={w.image} sizes="(min-width: 768px) 320px, 50vw" />
                    </div>
                  </div>
                  <div className="mt-2 font-mono text-[10px] tracking-[0.1em] opacity-60">{w.year}</div>
                  <b className="font-serif text-[15px] font-semibold">{w.name}</b>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      )}

      <Container as="section" className="mt-[30px] pb-12 md:mt-14 md:pb-20">
        <Eyebrow className="mb-3.5">{t("works")}</Eyebrow>
        <ul className="grid gap-[22px] md:grid-cols-2 lg:grid-cols-3">
          {c.floats.map((f) => (
            <Reveal as="li" key={f.slug}>
              <FloatCard
                float={f}
                tone="carton"
                imageHeight="h-[180px]"
                footer={
                  f.canJoin ? (
                    <ExternalButton
                      href={whatsappLink(tw("float", { name: f.name, number: pad2(f.number), year: edition.year }))}
                      size="sm"
                      className="mt-1"
                    >
                      {tf("cta")}
                    </ExternalButton>
                  ) : undefined
                }
              />
            </Reveal>
          ))}
        </ul>
      </Container>
    </article>
  );
}
