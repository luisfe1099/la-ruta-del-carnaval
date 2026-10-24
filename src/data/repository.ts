import "server-only";
import { cache } from "react";
import { getSnapshot } from "./source";
import type {
  CreatorDetail,
  CreatorListItem,
  FloatCardData,
  FloatDetail,
  MapPoint,
  PublicEdition,
  PublicImage,
  PublicLocation,
} from "./public";
import type {
  ContentSnapshot,
  Creator,
  Edition,
  Float,
  ImageAsset,
  Locale,
  Localized,
  WorkshopLocation,
} from "./types";

/* ------------------------------ helpers ------------------------------ */

const loc = (value: Localized | undefined, locale: Locale): string | undefined =>
  value ? value[locale] || value.es || undefined : undefined;

function image(asset: ImageAsset | undefined, locale: Locale, fallbackAlt: string): PublicImage {
  return {
    src: asset?.src,
    width: asset?.width,
    height: asset?.height,
    alt: loc(asset?.alt, locale) ?? fallbackAlt,
    tone: asset?.tone ?? 1,
  };
}

function edition(e: Edition): PublicEdition {
  return { year: e.year, startDate: e.startDate, paradeDate: e.paradeDate, active: e.active };
}

/**
 * Frontera de privacidad: la ubicación exacta de un taller privado se
 * descarta aquí y nunca sale de la capa de datos.
 */
function publicLocation(w: WorkshopLocation, locale: Locale): PublicLocation {
  const common = {
    neighborhood: w.publicZone.neighborhood,
    visitHours: loc(w.visitHours, locale),
    exhibitionNote: loc(w.exhibitionNote, locale),
  };
  if (w.access === "open" && w.exactLocation) {
    return {
      access: "open",
      ...common,
      exact: {
        lat: w.exactLocation.lat,
        lng: w.exactLocation.lng,
        address: w.exactLocation.address,
      },
    };
  }
  return {
    access: "private",
    ...common,
    zone: { lat: w.publicZone.lat, lng: w.publicZone.lng, radiusM: w.publicZone.radiusM },
  };
}

const byNumber = (a: Float, b: Float) => a.number - b.number;

const EMPTY_EDITION: Edition = {
  id: "empty",
  year: new Date().getFullYear() + 1,
  startDate: "",
  paradeDate: "",
  active: true,
};

function index(snapshot: ContentSnapshot) {
  const editions = new Map(snapshot.editions.map((e) => [e.id, e]));
  const creators = new Map(snapshot.creators.map((c) => [c.id, c]));
  const floats = snapshot.floats.filter((f) => f.published);
  const active =
    snapshot.editions.find((e) => e.active) ??
    [...snapshot.editions].sort((a, b) => b.year - a.year)[0] ??
    EMPTY_EDITION;
  return { editions, creators, floats, active };
}

function card(
  f: Float,
  locale: Locale,
  ctx: ReturnType<typeof index>,
): FloatCardData {
  const creator = ctx.creators.get(f.creatorId)!;
  const ed = ctx.editions.get(f.editionId)!;
  return {
    slug: f.slug,
    number: f.number,
    name: f.name,
    image: image(f.mainImage, locale, f.name),
    creatorName: creator.name,
    creatorSlug: creator.slug,
    access: f.workshop.access,
    year: ed.year,
  };
}

function creatorRef(c: Creator, locale: Locale) {
  return {
    slug: c.slug,
    name: c.name,
    type: c.type,
    portrait: image(c.portrait, locale, c.name),
  };
}

const canJoin = (f: Float, ctx: ReturnType<typeof index>) =>
  f.acceptsPlayers && ctx.editions.get(f.editionId)?.id === ctx.active?.id;

/* ----------------------------- repositorio ----------------------------- */

const ctxOf = cache(async () => index(await getSnapshot()));

export async function getActiveEdition(): Promise<PublicEdition> {
  const { active } = await ctxOf();
  return edition(active);
}

export async function getFloatCards(
  locale: Locale,
  opts: { featuredOnly?: boolean } = {},
): Promise<FloatCardData[]> {
  const ctx = await ctxOf();
  return ctx.floats
    .filter((f) => f.editionId === ctx.active.id)
    .filter((f) => (opts.featuredOnly ? f.featured : true))
    .sort(byNumber)
    .map((f) => card(f, locale, ctx));
}

export async function getFloatSlugs(): Promise<string[]> {
  return (await ctxOf()).floats.map((f) => f.slug);
}

export async function getFloat(locale: Locale, slug: string): Promise<FloatDetail | null> {
  const ctx = await ctxOf();
  const f = ctx.floats.find((x) => x.slug === slug);
  if (!f) return null;
  const creator = ctx.creators.get(f.creatorId)!;
  const ed = ctx.editions.get(f.editionId)!;
  const pastWorks = ctx.floats
    .filter((x) => x.creatorId === f.creatorId && x.editionId !== f.editionId && x.featured)
    .sort((a, b) => (ctx.editions.get(b.editionId)!.year - ctx.editions.get(a.editionId)!.year))
    .slice(0, 2)
    .map((x) => card(x, locale, ctx));

  return {
    ...card(f, locale, ctx),
    story: loc(f.story, locale) ?? "",
    gallery: f.gallery.map((g) => image(g, locale, f.name)),
    maquetteFrames: f.maquetteFrames.map((g) => image(g, locale, f.name)),
    viewer360: f.viewer360,
    model3D: f.model3D,
    videoUrl: f.videoUrl,
    costume: loc(f.costume, locale),
    featured: f.featured,
    canJoin: canJoin(f, ctx),
    location: publicLocation(f.workshop, locale),
    creator: creatorRef(creator, locale),
    edition: edition(ed),
    pastWorks,
  };
}

/** Otras obras de la edición activa (excluye `slug`). */
export async function getOtherFloats(locale: Locale, slug: string, limit = 3) {
  const ctx = await ctxOf();
  return ctx.floats
    .filter((f) => f.editionId === ctx.active.id && f.slug !== slug)
    .sort(byNumber)
    .slice(0, limit)
    .map((f) => card(f, locale, ctx));
}

export async function getMapPoints(locale: Locale): Promise<MapPoint[]> {
  const ctx = await ctxOf();
  return ctx.floats
    .filter((f) => f.editionId === ctx.active.id)
    .sort(byNumber)
    .map((f) => {
      const l = publicLocation(f.workshop, locale);
      const base = {
        slug: f.slug,
        number: f.number,
        name: f.name,
        image: image(f.mainImage, locale, f.name),
        neighborhood: l.neighborhood,
        access: l.access,
      };
      return l.access === "open"
        ? { ...base, lat: l.exact.lat, lng: l.exact.lng }
        : { ...base, lat: l.zone.lat, lng: l.zone.lng, radiusM: l.zone.radiusM };
    });
}

export async function getCreators(locale: Locale): Promise<CreatorListItem[]> {
  const ctx = await ctxOf();
  return ctx.creators.size === 0
    ? []
    : [...ctx.creators.values()]
        .map((c) => ({
          ...creatorRef(c, locale),
          members: c.members.length,
          neighborhood: c.neighborhood,
          floatCount: ctx.floats.filter((f) => f.creatorId === c.id && f.editionId === ctx.active.id).length,
        }))
        .filter((c) => c.floatCount > 0)
        .sort((a, b) => a.name.localeCompare(b.name, locale));
}

export async function getCreatorSlugs(): Promise<string[]> {
  return (await getCreators("es")).map((c) => c.slug);
}

export async function getCreator(locale: Locale, slug: string): Promise<CreatorDetail | null> {
  const ctx = await ctxOf();
  const c = [...ctx.creators.values()].find((x) => x.slug === slug);
  if (!c) return null;
  const mine = ctx.floats.filter((f) => f.creatorId === c.id);
  const current = mine.filter((f) => f.editionId === ctx.active.id).sort(byNumber);
  const past = mine
    .filter((f) => f.editionId !== ctx.active.id && f.featured)
    .sort((a, b) => ctx.editions.get(b.editionId)!.year - ctx.editions.get(a.editionId)!.year)
    .slice(0, 2);

  const socialLabels: Record<string, string> = {
    instagram: "Instagram",
    facebook: "Facebook",
    tiktok: "TikTok",
    website: "Web",
  };

  return {
    ...creatorRef(c, locale),
    bio: loc(c.bio, locale) ?? "",
    cover: image(c.cover ?? c.portrait, locale, c.name),
    members: c.members,
    since: c.since,
    neighborhood: c.neighborhood,
    social: Object.entries(c.social ?? {})
      .filter(([, url]) => Boolean(url))
      .map(([key, url]) => ({ label: socialLabels[key] ?? key, url: url as string })),
    access: current.some((f) => f.workshop.access === "open")
      ? "open"
      : current.length
        ? "private"
        : undefined,
    floats: current.map((f) => ({ ...card(f, locale, ctx), canJoin: canJoin(f, ctx) })),
    pastWorks: past.map((f) => card(f, locale, ctx)),
  };
}
