import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AdminSidebar from "../components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/auth/login?callbackUrl=/admin");
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-stone-100">
      <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
      
      {/* Barra lateral adaptable */}
      <AdminSidebar />

      {/* Contenido principal del panel con padding adaptable móvil */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto w-full">
        {children}
      </main>
    </div>
  );
}