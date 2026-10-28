import { ImageResponse } from "next/og";
import { getExperience } from "@/data/repository";
import type { Locale } from "@/i18n/routing";

export const alt = "La Ruta del Carnaval";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const x = await getExperience(locale as Locale, slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 72,
          color: "#F3EBDD",
          background:
            "linear-gradient(180deg, rgba(43,29,20,.1), rgba(43,29,20,.9)), radial-gradient(circle at 70% 30%, #C98B2B, transparent 45%), radial-gradient(circle at 25% 65%, #A8553A, transparent 50%), #4a2f20",
        }}
      >
        <div style={{ fontSize: 26, letterSpacing: 4, opacity: 0.85 }}>
          {x ? `EXPERIENCIA · ${x.year}` : "LA RUTA DEL CARNAVAL"}
        </div>
        <div style={{ fontSize: 92, lineHeight: 1.05, marginTop: 16 }}>{x?.name ?? "La Ruta del Carnaval"}</div>
        <div style={{ fontSize: 32, marginTop: 20, opacity: 0.9, display: "flex" }}>
          {x?.creatorName ?? ""}
          <span style={{ marginLeft: "auto", display: "flex" }}>
            La Ruta del Carnaval<span style={{ color: "#C8341E" }}>.</span>
          </span>
        </div>
      </div>
    ),
    size,
  );
}
