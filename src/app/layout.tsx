// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Roboto_Slab } from 'next/font/google';
import AuthProvider from "@/providers/AuthProvider"; // <-- Importamos nuestro puente de sesión

const robotoSlab = Roboto_Slab({
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: "Artesanías DecorArte | Taller de Muebles de Autor",
  description: "Muebles de madera y hierro con alma artesanal, creados en Córdoba.",
  icons: {
    icon: "/favicon.svg?v=3",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${robotoSlab.className}`}>
      <body className="w-full p-8 flex flex-col">
        {/* Envolvemos la app con AuthProvider para habilitar el uso de sesiones */}
        <AuthProvider>
          <main>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}

export { robotoSlab };