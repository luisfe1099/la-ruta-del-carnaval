"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Fragment, useEffect, useMemo, useState } from "react";
import { Circle, MapContainer, Marker, TileLayer, ZoomControl, useMap } from "react-leaflet";
import { useTranslations } from "next-intl";
import type { MapPoint } from "@/data/public";
import { Link } from "@/i18n/navigation";
import { googleMapsDirections, pad2 } from "@/lib/site";
import { Media } from "./media";
import { ArrowUpRight, ExternalButton } from "./ui";

const PASTO: [number, number] = [1.2136, -77.2811];

function pinIcon(kind: "open" | "zone", active: boolean) {
  const inner =
    kind === "open"
      ? `<span class="ruta-pin" data-active="${active}"></span>`
      : `<span class="ruta-pin-zone" data-active="${active}"></span>`;
  return L.divIcon({
    className: "ruta-hit",
    html: inner,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
}

function FitBounds({ points }: { points: MapPoint[] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15 });
  }, [map, points]);
  return null;
}

export default function MapView({
  points,
  visitHrefs,
}: {
  points: MapPoint[];
  visitHrefs: Record<string, string>;
}) {
  const t = useTranslations();
  const [selected, setSelected] = useState<string | null>(null);
  const current = useMemo(() => points.find((p) => p.slug === selected), [points, selected]);

  return (
    <div className="relative h-full w-full" role="region" aria-label={t("map.label")}>
      <MapContainer
        center={PASTO}
        zoom={14}
        zoomControl={false}
        className="h-full w-full"
        scrollWheelZoom
        attributionControl
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="topright" />
        <FitBounds points={points} />
        {points.map((p) => {
          const active = p.slug === selected;
          const select = () => setSelected(p.slug);
          return p.access === "open" ? (
            <Marker
              key={p.slug}
              position={[p.lat, p.lng]}
              icon={pinIcon("open", active)}
              title={p.name}
              alt={p.name}
              eventHandlers={{ click: select }}
            />
          ) : (
            <Fragment key={p.slug}>
              <Circle
                center={[p.lat, p.lng]}
                radius={p.radiusM ?? 400}
                pathOptions={{
                  color: "#2B1D14",
                  weight: 1.5,
                  dashArray: "5 6",
                  fillColor: "#2B1D14",
                  fillOpacity: active ? 0.16 : 0.08,
                }}
                eventHandlers={{ click: select }}
              />
              <Marker
                position={[p.lat, p.lng]}
                icon={pinIcon("zone", active)}
                title={`${p.name} · ${t("map.approx")}`}
                alt={p.name}
                eventHandlers={{ click: select }}
              />
            </Fragment>
          );
        })}
      </MapContainer>

      {current && (
        <div className="absolute inset-x-3.5 bottom-3.5 z-[1000] mx-auto flex max-w-xl items-center gap-3.5 bg-kraft p-3.5 shadow-[0_10px_30px_-10px_rgba(43,29,20,0.5)]">
          <div className="relative h-[72px] w-[72px] flex-none overflow-hidden">
            <Media image={current.image} sizes="72px" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-mono text-[10px] uppercase opacity-60">
              {t("common.number", { n: pad2(current.number) })} ·{" "}
              {current.access === "open" ? t("common.open") : t("common.private")}
            </div>
            <Link
              href={`/carrozas/${current.slug}`}
              className="block truncate font-serif text-lg font-semibold hover:underline"
            >
              {current.name}
            </Link>
            <div className="text-xs opacity-70">
              {current.neighborhood}
              {current.access === "private" && ` · ${t("map.approx")}`}
            </div>
          </div>
          {current.access === "open" ? (
            <ExternalButton href={googleMapsDirections(current.lat, current.lng)} size="sm">
              {t("map.go")} <ArrowUpRight />
            </ExternalButton>
          ) : (
            <ExternalButton href={visitHrefs[current.slug]} size="sm" variant="ghost">
              {t("float.requestVisit")}
            </ExternalButton>
          )}
          <button
            type="button"
            onClick={() => setSelected(null)}
            aria-label={t("nav.close")}
            className="absolute right-1.5 top-0.5 p-1 text-xs opacity-50 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
