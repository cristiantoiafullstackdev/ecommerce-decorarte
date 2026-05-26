import type { Metadata } from "next";
import "./globals.css";
import { Roboto_Slab } from 'next/font/google'
import { Navbar } from "@/app/components/ui/header/navbar";
import IconWhatsApp from "@/app/components/ui/iconos/IconWhatsApp";

// const montserrat = Montserrat({
//   subsets: ['latin'],
//   weight: ['400', '500', '700'],
// })

const robotoSlab = Roboto_Slab({
  subsets: ['latin'],
  weight: ['400', '700'],
})

export const metadata: Metadata = {
  title: "Artesanías DecorArte | Taller de Muebles de Autor",
  description: "Muebles de madera y hierro con alma artesanal, creados en Córdoba.",
  // El isotipo como favicon de la pestaña del navegador
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
    <html
      lang="en"
      className={`${robotoSlab.className}`}
    >
      <body className="w-full p-8 flex flex-col">
        <Navbar />
        <main>
          {children}
        </main>
        <IconWhatsApp />
      </body>
    </html>
  );
}
export { robotoSlab }