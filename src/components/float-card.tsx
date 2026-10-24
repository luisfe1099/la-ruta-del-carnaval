import { useTranslations } from "next-intl";
import type { FloatCardData } from "@/data/public";
import { Link } from "@/i18n/navigation";
import { pad2 } from "@/lib/site";
import { Media } from "./media";
import type { ReactNode } from "react";

export function AccessChip({ access }: { access: "open" | "private" }) {
  const t = useTranslations("common");
  return (
    <span
      className={`absolute left-3 top-3 z-[2] px-2 py-[5px] font-mono text-[10px] uppercase tracking-[0.1em] ${
        access === "private" ? "bg-cafe text-kraft" : "bg-kraft text-cafe"
      }`}
    >
      {access === "open" ? t("open") : t("private")}
    </span>
  );
}

export function FloatCard({
  float,
  tone = "kraft",
  priority = false,
  footer,
  imageHeight = "h-[230px]",
}: {
  float: FloatCardData;
  tone?: "kraft" | "carton";
  priority?: boolean;
  footer?: ReactNode;
  imageHeight?: string;
}) {
  const t = useTranslations("common");
  return (
    <article className={`group relative flex flex-col overflow-hidden rounded-lg ${tone === "kraft" ? "bg-kraft" : "bg-carton"}`}>
      <Link href={`/carrozas/${float.slug}`} className="block">
        <div className={`relative overflow-hidden ${imageHeight} md:h-[260px]`}>
          <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]">
            <Media
              image={float.image}
              priority={priority}
              sizes="(min-width: 1024px) 384px, (min-width: 768px) 50vw, 100vw"
            />
          </div>
          <AccessChip access={float.access} />
        </div>
        <div className="px-4 pb-[18px] pt-3.5">
          <div className="font-mono text-[11px] tracking-[0.1em] opacity-65">
            {t("number", { n: pad2(float.number) })}
          </div>
          <h3 className="mb-0.5 mt-1 font-serif text-[22px] font-semibold tracking-[-0.01em]">{float.name}</h3>
          <div className="text-[13px] opacity-75">{float.creatorName}</div>
        </div>
      </Link>
      {footer && <div className="px-4 pb-[18px]">{footer}</div>}
    </article>
  );
}
