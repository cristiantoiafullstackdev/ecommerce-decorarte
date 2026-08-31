// src/app/(shop)/layout.tsx
import IconWhatsApp from "../components/iconos/IconWhatsApp";
import Footer from "../components/ui/footer/Footer";
import { Navbar } from "../components/ui/header/Navbar";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    /* Contenedor principal de la tienda usando el tono oscuro de madera de las variables */
    <div className="w-full flex flex-col min-h-screen bg-(--bg-wood-dark)">
      
      {/* Barra de navegación superior fija o sticky */}
      <Navbar />

      {/* 
        Contenedor dinámico de vistas. 
        Se usa una transparencia elegante sobre la madera para dar profundidad visual. 
      */}
      <main className="w-full flex-1 flex flex-col bg-(--wood-dark)/40">
        {children}
      </main>

      {/* Widget flotante de contacto rápido */}
      <IconWhatsApp />

      {/* Pie de página institucional */}
      <Footer />

    </div>
  );
}