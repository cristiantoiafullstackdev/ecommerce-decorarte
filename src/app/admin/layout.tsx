import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // 1. Verificamos la sesión en el servidor antes de renderizar cualquier cosa del admin
  const session = await getServerSession(authOptions);

  // 2. Si no hay sesión o el usuario no es admin, lo rebotamos al login general
  if (!session || session.user.role !== "ADMIN") {
    redirect("/auth/login?callbackUrl=/admin");
  }

  return (
    <div>
      {/* Este plugin es el que inicializa el contexto de UploadThing */}
      <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
      {children}
    </div>
  );
}