// src/components/ui/header/Header.tsx
"use client";
import { 
  DecorarteLogo, 
  DecorarteIsotype, 
  DecorarteSearchIcon, 
  DecorarteHeartIcon, 
  DecorarteBagIcon, 
  DecorarteUserIcon,
  GameStyles
} from '@/app/components/ui/iconos/DecorArteBrand';

interface HeaderProps {
  cartCount: number;
  wishCount: number;
  currentSection?: string;
}

export default function Header({ cartCount = 0, wishCount = 0, currentSection = "catalogo" }: HeaderProps) {
  
  const handleSearch = () => console.log("Buscar...");
  const handleWishlist = () => console.log("Wishlist...");
  const handleCart = () => console.log("Carrito...");
  const handleProfile = () => console.log("Perfil...");

  return (
    <>
      {/* Inyectamos las animaciones CSS globales del ecosistema */}
      <GameStyles />

      <nav className="fixed top-0 w-full bg-[#f5f2eb]/90 backdrop-blur-md border-b border-stone-200/80 shadow-sm transition-all z-100">
        <div className="max-w-7xl mx-auto p-6 h-30 flex items-center justify-between">
          
          {/* 1. SECCIÓN DE LOGO RESPONSIVO */}
          <div className="shrink-0 flex items-center">
            {/* Escritorio: Logo completo (Isotipo reconstituido + Texto) */}
            <div className="hidden md:block">
              <DecorarteLogo height={96} />
            </div>
            
            {/* Móvil: Únicamente el Isotipo */}
            <div className="block md:hidden">
              <DecorarteIsotype size={56} />
            </div>
          </div>

          {/* 2. ENLACES DE NAVEGACIÓN EN LINEA */}
          <div className="hidden lg:flex items-center space-x-10">
            <a href="#catalogo" className={`game-link text-sm uppercase tracking-[0.2em] font-bold text-stone-800 ${currentSection === "catalogo" ? "game-link-active" : ""}`}>
              Catálogo
            </a>
            <a href="#nosotros" className={`game-link text-sm uppercase tracking-[0.2em] font-bold text-stone-800 ${currentSection === "taller" ? "game-link-active" : ""}`}>
              Nosotros
            </a>
            <a href="#contacto" className={`game-link text-sm uppercase tracking-[0.2em] font-bold text-stone-800 ${currentSection === "proceso" ? "game-link-active" : ""}`}>
              Contacto
            </a>
          </div>

          {/* 3. CONTROLES CON BOTONES COMPACTOS + HOVER ANIMADO */}
          <div className="flex items-center space-x-6">
            <button onClick={handleSearch} className="focus:outline-none p-1" aria-label="Buscar">
              <DecorarteSearchIcon size={36} />
            </button>

            <button onClick={handleWishlist} className="focus:outline-none p-1 relative" aria-label="Favoritos">
              <DecorarteHeartIcon size={36} filled={wishCount > 0} />
              {wishCount > 0 && (
                <span className="absolute -top-1 -right-1.5 bg-[#C84B31] text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-stone-900 shadow">
                  {wishCount}
                </span>
              )}
            </button>

            <button onClick={handleCart} className="focus:outline-none p-1 relative" aria-label="Carrito">
              <DecorarteBagIcon size={44} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1.5 bg-[#C84B31] text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-stone-900 shadow">
                  {cartCount}
                </span>
              )}
            </button>

            <button onClick={handleProfile} className="focus:outline-none p-1 hidden sm:inline-block" aria-label="Perfil">
              <DecorarteUserIcon size={36} />
            </button>
          </div>

        </div>
      </nav>
    </>
  );
}