import Header from './Header';

export const Navbar = async () => {
  // 1. Traemos las categorías vivas desde Neon

  // 2. Valores provisorios de estados (Se conectarán a Zustand en Fase 2)
  const cartCount = 0; 
  const wishCount = 0;

  return (
    <>
      {/* Acoplamos el Header limpio enviándole los datos requeridos */}
      <Header 
        cartCount={cartCount}
        wishCount={wishCount}
        currentSection="catalogo"
      />
      
      {/* Colchón o separador para que el contenido no se desplace bajo la barra fija */}
      <div className="h-20 w-full bg-[#f5f2eb]" />
    </>
  );
};