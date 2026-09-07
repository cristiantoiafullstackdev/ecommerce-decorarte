// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Roboto_Slab } from 'next/font/google';
import AuthProvider from "@/providers/AuthProvider";
import IdleTimer from "./components/auth/IdleTimer";

// Configuración de la tipografía principal optimizada por Next.js
const robotoSlab = Roboto_Slab({
  subsets: ['latin'],
  weight: ['400', '700'],
});

// Metadatos globales SEO para buscadores y pestañas del navegador
export const metadata: Metadata = {
  title: "Artesanías DecorArte | Taller de Muebles de Autor",
  description: "Muebles de madera y hierro con alma artesanal, creados en Córdoba.",
  icons: {
    icon: "/api/favicon?v=2",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /* Definimos el idioma en español y aplicamos la fuente global */
    <html lang="es" className={`${robotoSlab.className} h-full`}>
      {/* 
        Usamos clases utilitarias de Tailwind combinadas con el color base de la 
        variable global (--iron-dark) para evitar pantallas blancas durante la carga.
      */}
      <body className="w-full min-h-screen flex flex-col bg-[#1E1A17] text-stone-100 antialiased selection:bg-[#D69624] selection:text-white">
        
        {/* AuthProvider inyecta el contexto de NextAuth en toda la app */}
        <AuthProvider>
          <IdleTimer />
          <div className="w-full flex flex-col flex-1">
            {children}
          </div>
        </AuthProvider>

      </body>
    </html>
  );
}

export { robotoSlab };