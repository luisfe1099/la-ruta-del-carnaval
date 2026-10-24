import { useTranslations } from "next-intl";
import type { FloatDetail } from "@/data/public";
import { googleMapsDirections, wazeDirections } from "@/lib/site";
import { ArrowUpRight, ExternalButton } from "./ui";

/** Bloque de información: cambia según taller abierto o privado. */
export function WorkshopInfo({ float, visitHref }: { float: FloatDetail; visitHref: string }) {
  const t = useTranslations("float");
  const tc = useTranslations("common");
  const loc = float.location;

  return (
    <dl className="bg-carton p-[18px]">
      <Row label={t("costume")}>{float.costume ?? tc("tbd")}</Row>

      {loc.access === "open" ? (
        <>
          <Row label={t("workshop")}>{t("openWorkshopIn", { zone: loc.neighborhood })}</Row>
          {loc.exact.address && <Row label={t("address")}>{loc.exact.address}</Row>}
          {loc.visitHours && <Row label={t("hours")}>{loc.visitHours}</Row>}
          {loc.exhibitionNote && <Row label={t("exhibition")}>{loc.exhibitionNote}</Row>}
        </>
      ) : (
        <>
          <Row label={t("workshop")}>{t("privateWorkshopIn", { zone: loc.neighborhood })}</Row>
          <Row label={t("access")}>{t("privateAccess")}</Row>
          {loc.exhibitionNote && <Row label={t("exhibition")}>{loc.exhibitionNote}</Row>}
        </>
      )}

      <div className="mt-4">
        {loc.access === "open" ? (
          <>
            <ExternalButton
              href={googleMapsDirections(loc.exact.lat, loc.exact.lng)}
              variant="ghost"
              className="w-full text-cafe"
            >
              {t("directions")} <ArrowUpRight />
            </ExternalButton>
            <p className="mt-2.5 font-mono text-[11px] opacity-65">
              {t("directionsNote")} ·{" "}
              <a
                href={wazeDirections(loc.exact.lat, loc.exact.lng)}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                {t("orWaze")}
              </a>
            </p>
          </>
        ) : (
          <>
            <ExternalButton href={visitHref} variant="ghost" className="w-full text-cafe">
              {t("requestVisit")}
            </ExternalButton>
            <p className="mt-2.5 font-mono text-[11px] opacity-65">{t("requestVisitNote")}</p>
          </>
        )}
      </div>
    </dl>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-3 first:mt-0">
      <dt className="font-mono text-[10px] uppercase tracking-[0.12em] opacity-60">{label}</dt>
      <dd className="mt-[3px] text-sm">{children}</dd>
    </div>
  );
}
