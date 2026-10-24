import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "La Ruta del Carnaval",
    short_name: "La Ruta",
    description: "Donde nace el carnaval.",
    start_url: "/es",
    scope: "/",
    display: "standalone",
    background_color: "#F3EBDD",
    theme_color: "#2B1D14",
    icons: [
      { src: "/pwa-icon/192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/pwa-icon/512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/pwa-icon/512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
