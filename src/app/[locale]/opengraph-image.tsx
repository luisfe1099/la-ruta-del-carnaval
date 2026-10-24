import { ImageResponse } from "next/og";

export const alt = "La Ruta del Carnaval";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
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
            "linear-gradient(180deg, rgba(43,29,20,.1), rgba(43,29,20,.9)), radial-gradient(circle at 70% 30%, #C98B2B, transparent 45%), radial-gradient(circle at 25% 65%, #A8553A, transparent 50%), #5a3a26",
        }}
      >
        <div style={{ fontSize: 26, letterSpacing: 4, opacity: 0.85 }}>PASTO · NARIÑO · 6 · {locale === "es" ? "ENERO" : "JAN"}</div>
        <div style={{ fontSize: 104, lineHeight: 1.02, marginTop: 16, display: "flex" }}>
          La Ruta del Carnaval<span style={{ color: "#C8341E" }}>.</span>
        </div>
        <div style={{ fontSize: 36, marginTop: 16, opacity: 0.9 }}>
          {locale === "es" ? "Donde nace el carnaval" : "Where the carnival is born"}
        </div>
      </div>
    ),
    size,
  );
}
