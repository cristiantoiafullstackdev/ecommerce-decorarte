// src/app/components/ui/header/Header.tsx
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
      <GameStyles />

      {/* Cambiado z-100 por z-50 (máximo estándar nativo de Tailwind) */}
      <nav className="fixed top-0 w-full bg-[#f5f2eb]/90 backdrop-blur-md border-b border-stone-200/80 shadow-sm transition-all z-50">
        {/* Cambiado h-30 por h-32 (128px exactos) para dar el espacio idéntico a tu captura */}
        <div className="max-w-7xl mx-auto px-6 h-32 flex items-center justify-between">
          
          {/* 1. SECCIÓN DE LOGO RESPONSIVO */}
          <div className="shrink-0 flex items-center">
            <div className="hidden md:block">
              <DecorarteLogo height={96} />
            </div>
            <div className="block md:hidden">
              <DecorarteIsotype size={56} />
            </div>
          </div>

          {/* 2. ENLACES DE NAVEGACIÓN EN LINEA (Corregidos los textos de validación de sección activa) */}
          <div className="hidden lg:flex items-center space-x-10">
            <a href="#catalogo" className={`game-link text-sm uppercase tracking-[0.2em] font-bold text-stone-800 ${currentSection === "catalogo" ? "game-link-active" : ""}`}>
              Catálogo
            </a>
            <a href="#nosotros" className={`game-link text-sm uppercase tracking-[0.2em] font-bold text-stone-800 ${currentSection === "nosotros" ? "game-link-active" : ""}`}>
              Nosotros
            </a>
            <a href="#contacto" className={`game-link text-sm uppercase tracking-[0.2em] font-bold text-stone-800 ${currentSection === "contacto" ? "game-link-active" : ""}`}>
              Contacto
            </a>
          </div>

          {/* 3. CONTROLES CON BOTONES COMPACTOS + HOVER ANIMADO */}
          <div className="flex items-center space-x-6">
            <button onClick={handleSearch} className="focus:outline-none p-1 game-bounce" aria-label="Buscar">
              <DecorarteSearchIcon size={36} />
            </button>

            <button onClick={handleWishlist} className="focus:outline-none p-1 relative game-bounce" aria-label="Favoritos">
              <DecorarteHeartIcon size={36} filled={wishCount > 0} />
              {wishCount > 0 && (
                <span className="absolute -top-1 -right-1.5 bg-[#C84B31] text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-stone-900 shadow">
                  {wishCount}
                </span>
              )}
            </button>

            <button onClick={handleCart} className="focus:outline-none p-1 relative game-bounce" aria-label="Carrito">
              <DecorarteBagIcon size={44} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1.5 bg-[#C84B31] text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-stone-900 shadow">
                  {cartCount}
                </span>
              )}
            </button>

            <button onClick={handleProfile} className="focus:outline-none p-1 hidden sm:inline-block game-bounce" aria-label="Perfil">
              <DecorarteUserIcon size={36} />
            </button>
          </div>

        </div>
      </nav>
    </>
  );
}