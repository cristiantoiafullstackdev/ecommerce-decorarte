import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "@/app/api/uploadthing/core";

// Exportamos las rutas necesarias para que UploadThing funcione
// Esto crea el endpoint POST y GET que espera la librería
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  // Opcional: configurar log level
  // config: { ... }
});