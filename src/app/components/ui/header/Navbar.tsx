// src/app/components/ui/header/Navbar.tsx
import Header from "./Header";

/**
 * ============================================================================
 * NAVBAR CONTAINER
 * Componente servidor que orquesta la barra de navegación superior.
 * ============================================================================
 */
export const Navbar = async () => {
  return (
    <>
      {/* Header fijo superior con lógica de sesión, búsqueda y carrito */}
      <Header currentSection="catalogo" />
      
      {/* 
        Espaciador estructural (Dummy Block).
        Equivale a la altura exacta del header fijo (h-32) para evitar que 
        el contenido de la página se oculte detrás del componente fixed.
      */}
      <div className="h-32 w-full bg-[var(--iron-dark)]/10" />
    </>
  );
};