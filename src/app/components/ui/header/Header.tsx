// src/app/components/ui/header/Header.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link'; // Importamos Link nativo de Next
import { useSession, signOut } from 'next-auth/react'; // Hook de autenticación
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
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false); // Control para menú flotante
  
  // Consumimos NextAuth Session
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  const hasHydrated = useCartStore((state) => state._hasHydrated);
  const totalItems = useCartStore((state) => state.getTotalItems());

  const handleSearch = () => console.log("Buscar...");
  const handleWishlist = () => console.log("Wishlist...");

  const displayItems = hasHydrated ? totalItems : 0;

  return (
    <>
      <GameStyles />

      {/* Contenedor Fijo Superior */}
      <nav className="fixed top-0 w-full bg-[#EAE6DC]/90 backdrop-blur-md border-b border-stone-200/80 shadow-sm transition-all z-50">
        <div className="max-w-7xl mx-auto px-6 h-32 flex items-center justify-between">
          
          {/* 1. SECCIÓN DE LOGO RESPONSIVO */}
          <Link href="/" className="shrink-0 flex items-center cursor-pointer">
            <div className="hidden md:block">
              <DecorarteLogo height={96} />
            </div>
            <div className="block md:hidden">
              <DecorarteIsotype size={56} />
            </div>
          </Link>

          {/* 2. ENLACES DE NAVEGACIÓN EN LINEA */}
          <div className="hidden lg:flex items-center space-x-10">
            <Link href="/#catalogo" className={`game-link text-sm uppercase tracking-[0.2em] font-bold text-stone-800 ${currentSection === "catalogo" ? "game-link-active" : ""}`}>
              Catálogo
            </Link>
            <Link href="/#nosotros" className={`game-link text-sm uppercase tracking-[0.2em] font-bold text-stone-800 ${currentSection === "nosotros" ? "game-link-active" : ""}`}>
              Nosotros
            </Link>
            <Link href="/#contacto" className={`game-link text-sm uppercase tracking-[0.2em] font-bold text-stone-800 ${currentSection === "contacto" ? "game-link-active" : ""}`}>
              Contacto
            </Link>
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

            {/* BOTÓN DEL CARRITO */}
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

            {/* 🛠️ PERFIL DINÁMICO CONECTADO A NEXTAUTH */}
            <div className="relative">
              {isAuthenticated ? (
                // Si está logueado: Botón abre un menú desplegable rústico
                <button 
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="focus:outline-none p-1 flex items-center gap-1 text-stone-800 font-bold uppercase tracking-wider text-[11px] game-bounce"
                >
                  <DecorarteUserIcon size={36} />
                  <span className="hidden sm:inline text-stone-600 font-medium lowercase">
                    hola, <span className="font-black uppercase text-stone-800 text-xs">{session?.user?.name?.split(" ")[0]}</span>
                  </span>
                </button>
              ) : (
                // Si es un visitante anónimo: El ícono te redirige directo a loguearte
                <Link href="/auth/login" className="focus:outline-none p-1 block game-bounce" aria-label="Iniciar Sesión">
                  <DecorarteUserIcon size={36} />
                </Link>
              )}

              {/* Menú Flotante Desplegable para Usuarios Autenticados */}
              {isAuthenticated && isProfileMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-[#FCF9F5] rounded-xl border-2 border-stone-200 shadow-xl py-2 z-50 flex flex-col font-bold uppercase text-[10px] tracking-widest text-stone-700 animate-fadeIn">
                  <div className="px-4 py-2 border-b border-stone-200 text-stone-400 font-normal text-[9px] lowercase">
                    Conectado como: <br /><span className="font-bold text-stone-600 normal-case text-xs">{session?.user?.email}</span>
                  </div>

                  {/* Si el rol inyectado desde Neon es ADMIN, pintamos acceso dorado al panel */}
                  {session?.user?.role === 'ADMIN' && (
                    <Link 
                      href="/admin" 
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="px-4 py-3 text-[#B57C38] hover:bg-amber-50 hover:text-[#1C1816] transition-colors border-b border-stone-100 font-black"
                    >
                      👑 Panel Administración
                    </Link>
                  )}

                  <Link href="/orders" onClick={() => setIsProfileMenuOpen(false)} className="px-4 py-3 hover:bg-stone-100 text-stone-800 transition-colors">
                    Mis Compras
                  </Link>

                  <button 
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      signOut({ callbackUrl: '/' });
                    }} 
                    className="px-4 py-3 text-left hover:bg-red-50 text-red-600 border-t border-stone-200 transition-colors mt-1 font-black"
                  >
                    [ Cerrar Sesión ]
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>
      </nav>

      {/* COMPONENTE SIDEBAR INYECTADO */}
      <SidebarCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}