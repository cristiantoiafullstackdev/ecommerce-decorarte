// src/app/components/ui/header/Navbar.tsx
import Header from "./Header";

export const Navbar = async () => {
  // 1. Traemos las categorías vivas desde Neon (Listo para la conexión futura)

  // 2. Valores provisorios (Cambiarán en la Fase de Zustand)
  const wishCount = 0;

  return (
    <>
      {/* Acoplamos el Header limpio enviándole los datos requeridos */}
      <Header 
        wishCount={wishCount}
        currentSection="catalogo"
      />
      
      {/* Corregido a h-32 para que el contenido empiece exactamente donde termina el Header fixed */}
      <div className="h-32 w-full bg-[#f5f2eb]" />
    </>
  );
};