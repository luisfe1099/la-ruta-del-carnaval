import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemaTypes";

/**
 * Configuración del Studio. Ejecutar con `npm run studio`
 * (requiere NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET).
 */
export default defineConfig({
  name: "la-ruta-del-carnaval",
  title: "La Ruta del Carnaval",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  plugins: [structureTool()],
  schema: { types: schemaTypes },
});
