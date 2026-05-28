// src/app/components/ui/header/Header.tsx
"use client";

import { useState, useEffect } from 'react';
import { 
  DecorarteLogo, 
  DecorarteIsotype, 
  DecorarteSearchIcon, 
  DecorarteHeartIcon, 
  DecorarteBagIcon, 
  DecorarteUserIcon,
  GameStyles
} from '@/app/components/iconos/DecorArteBrand';
import { useCartStore } from '@/store/cart/cart-store';
import SidebarCart from '@/app/components/cart/SlidebarCart';

interface HeaderProps {
  wishCount: number;
  currentSection?: string;
}

export default function Header({ wishCount = 0, currentSection = "catalogo" }: HeaderProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Consumimos el estado de hidratación y la función contadora por separado
  const hasHydrated = useCartStore((state) => state._hasHydrated);
  const totalItems = useCartStore((state) => state.getTotalItems());

  // Estado secundario para asegurarnos que Next.js no choque render de servidor con cliente
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
  }, []);

  const handleSearch = () => console.log("Buscar...");
  const handleWishlist = () => console.log("Wishlist...");
  const handleProfile = () => console.log("Perfil...");

  // Si no se ha hidratado Zustand o no estamos en el cliente, mostramos 0 temporalmente de forma pasiva
  const displayItems = (isClient && hasHydrated) ? totalItems : 0;

  return (
    <>
      <GameStyles />

      {/* Contenedor Fijo Superior */}
      <nav className="fixed top-0 w-full bg-[#EAE6DC]/90 backdrop-blur-md border-b border-stone-200/80 shadow-sm transition-all z-50">
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

          {/* 2. ENLACES DE NAVEGACIÓN EN LINEA */}
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

          {/* 3. CONTROLES CON BOTONES COMPACTOS */}
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

            {/* BOTÓN DEL CARRITO CONECTADO DIRECTAMENTE A LA STORE OPTIMIZADA */}
            <button 
              onClick={() => setIsCartOpen(true)} 
              className="focus:outline-none p-1 relative game-bounce" 
              aria-label="Carrito"
            >
              <DecorarteBagIcon size={44} />
              {displayItems > 0 && (
                <span className="absolute -top-1 -right-1.5 bg-[#C84B31] text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-stone-900 shadow">
                  {displayItems}
                </span>
              )}
            </button>

            <button onClick={handleProfile} className="focus:outline-none p-1 hidden sm:inline-block game-bounce" aria-label="Perfil">
              <DecorarteUserIcon size={36} />
            </button>
          </div>

        </div>
      </nav>

      {/* COMPONENTE SIDEBAR INYECTADO */}
      <SidebarCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}