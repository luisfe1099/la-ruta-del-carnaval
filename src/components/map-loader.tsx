"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import type { MapPoint } from "@/data/public";

function Loading() {
  const t = useTranslations("map");
  return (
    <div className="flex h-full w-full items-center justify-center bg-carton font-mono text-xs tracking-[0.1em] opacity-70">
      {t("loading")}
    </div>
  );
}

const MapView = dynamic(() => import("./map-view"), { ssr: false, loading: Loading });

export function MapLoader(props: { points: MapPoint[]; visitHrefs: Record<string, string> }) {
  return <MapView {...props} />;
}
