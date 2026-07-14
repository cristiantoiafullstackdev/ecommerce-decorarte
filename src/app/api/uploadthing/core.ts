/**
 * Configuración de UploadThing para el manejo de imágenes de productos.
 * * Este archivo define los "FileRoutes" que actúan como endpoints para 
 * subir archivos, asegurando la autenticación y permisos antes de la subida.
 */

import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// Simulación de autenticación (Aquí integrarás tu lógica real, ej: NextAuth o Clerk)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const auth = (req: Request) => ({ id: "usuario_admin_123" });

// Definimos el router para el manejo de subida de imágenes
export const ourFileRouter = {
  // Definimos una ruta llamada "imageUploader" para fotos de productos
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 5 } })
    .middleware(async ({ req }) => {
      const user = await auth(req);

      // Si el usuario no está autenticado, lanzamos error
      if (!user) throw new Error("No autorizado");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Esta función se ejecuta cuando la subida termina
      console.log("Subida completada por usuario:", metadata.userId);
      console.log("URL del archivo:", file.url);
      
      // Aquí podrías disparar notificaciones o guardar la URL en tu DB
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;