type T = (key: string, values?: Record<string, string | number>) => string;

interface Facts {
  durationMinHours?: number;
  durationMaxHours?: number;
  durationConfirmed: boolean;
  minGroup?: number;
  maxGroup: number;
  pricePerPerson?: number;
}

export function formatDuration(t: T, x: Facts): string {
  const { durationMinHours: min, durationMaxHours: max } = x;
  if (min == null && max == null) return t("durationUnknown");
  const range =
    min != null && max != null && min !== max
      ? t("hoursRange", { min, max })
      : t("hoursOne", { n: (max ?? min) as number });
  return x.durationConfirmed ? range : t("durationTbc", { range });
}

export function formatGroup(t: T, x: Facts): string {
  return x.minGroup != null
    ? t("groupRange", { min: x.minGroup, max: x.maxGroup })
    : t("groupMinTbc", { max: x.maxGroup });
}

/** Sin precio cargado se muestra "Por confirmar"; nunca se inventan cifras. */
export function formatPrice(t: T, x: Facts, locale: string): string {
  return x.pricePerPerson != null
    ? t("perPerson", { price: x.pricePerPerson.toLocaleString(locale === "es" ? "es-CO" : "en-US") })
    : t("priceTbc");
}
