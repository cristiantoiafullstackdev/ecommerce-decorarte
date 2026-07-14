import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {/* Este plugin es el que inicializa el contexto de UploadThing */}
      <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
      {children}
    </div>
  )
}


