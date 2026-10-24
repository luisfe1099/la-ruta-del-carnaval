"use client";

import { useEffect } from "react";

/**
 * Visor 3D opcional (v2). Solo se carga la librería si la carroza tiene GLB.
 */
export function Model3D({ glbUrl, posterUrl, alt }: { glbUrl: string; posterUrl?: string; alt: string }) {
  useEffect(() => {
    import("@google/model-viewer");
  }, []);

  return (
    <model-viewer
      src={glbUrl}
      poster={posterUrl}
      alt={alt}
      camera-controls=""
      auto-rotate=""
      loading="lazy"
      shadow-intensity="1"
      style={{ width: "100%", height: 360, background: "#E4D3B8" }}
    />
  );
}
