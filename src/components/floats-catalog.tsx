"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { FloatCardData } from "@/data/public";
import { FloatCard } from "./float-card";
import { Reveal } from "./motion";

type Filter = "all" | "open" | "private";

export function FloatsCatalog({ floats }: { floats: FloatCardData[] }) {
  const t = useTranslations();
  const [filter, setFilter] = useState<Filter>("all");
  const visible = filter === "all" ? floats : floats.filter((f) => f.access === filter);

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: t("common.all") },
    { id: "open", label: t("common.open") },
    { id: "private", label: t("common.private") },
  ];

  return (
    <>
      <div role="group" aria-label={t("floats.filterLabel")} className="mt-[18px] flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-[7px] font-mono text-[11px] uppercase tracking-[0.06em] transition-colors ${
              filter === f.id ? "bg-cafe text-kraft" : "border border-cafe hover:bg-cafe/5"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="mt-10 text-sm opacity-70" role="status">
          {t("floats.empty")}
        </p>
      ) : (
        <ul className="mt-6 grid gap-[22px] md:grid-cols-2 lg:grid-cols-3" aria-live="polite">
          {visible.map((f, i) => (
            <Reveal as="li" key={f.slug} delay={Math.min(i, 3) * 0.05}>
              <FloatCard float={f} tone="carton" priority={i < 2} />
            </Reveal>
          ))}
        </ul>
      )}
    </>
  );
}
