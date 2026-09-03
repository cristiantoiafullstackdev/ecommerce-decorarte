//src/app/api/uploadthing/core.ts
/**
 * Configuración de UploadThing para el manejo de imágenes de productos.
 */

import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 5 } })
    .middleware(async () => {
      // Obtenemos la sesión respetando el tipado estricto
      const session = await getServerSession(authOptions);

      // Validamos que exista una sesión activa
      if (!session || !session.user) {
        throw new Error("No autorizado: Debes iniciar sesión para realizar esta acción.");
      }

      // Validamos estrictamente que el usuario posea el rol de Administrador
      if (session.user.role !== "ADMIN") {
        throw new Error("Acceso denegado: Solo el administrador puede modificar el catálogo de productos.");
      }

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Subida completada por el administrador ID:", metadata.userId);
      console.log("URL segura del archivo:", file.url);
      
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;