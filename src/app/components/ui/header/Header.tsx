//src/app/components/ui/header/Header.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { 
  DecorarteLogo, 
  DecorarteIsotype, 
  DecorarteHeartIcon, 
  DecorarteBagIcon, 
  DecorarteUserIcon,
  GameStyles
} from '@/app/components/iconos/DecorArteBrand';
import { useCartStore } from '@/store/cart/cart-store';
import SidebarCart from '@/app/components/cart/SidebarCart';
import { useWishlistStore } from '@/store/wishlist/wishlist-store';

interface ExtendedUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
}

interface ExtendedSession {
  user?: ExtendedUser;
}

/**
 * ============================================================================
 * HEADER COMPONENT (CLIENT)
 * Detecta la ruta automáticamente para el estado activo y gestiona la UI.
 * ============================================================================
 */
export default function Header() {
  const router = useRouter();
  const pathname = usePathname(); // <-- Detección automática de la ruta activa

  // Estados locales para la UI
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Control de hidratación segura para evitar errores de SSR en Zustand
  const [isMounted] = useState(() => typeof window !== 'undefined');

  // Referencias para manejo de clics fuera de los elementos flotantes
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  
  // Gestión de sesión mediante NextAuth
  const { data: session, status } = useSession() as { data: ExtendedSession | null; status: string };
  const isAuthenticated = status === "authenticated";
  const userId = session?.user?.id;

  // Stores globales de Zustand
  const hasHydrated = useCartStore((state) => state._hasHydrated);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const loadUserCart = useCartStore((state) => state.loadUserCart);

  const hasHydratedWish = useWishlistStore((state) => state._hasHydrated);
  const wishCount = useWishlistStore((state) => state.getWishCount());
  const loadUserFavorites = useWishlistStore((state) => state.loadUserFavorites);
  
  const displayWishCount = isMounted && hasHydratedWish ? wishCount : 0;  
  const displayItems = isMounted && hasHydrated ? totalItems : 0;

  // Efecto para cerrar modales y menús flotantes al hacer clic fuera de ellos
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleWishlist = () => {
    router.push('/favorites');
  };

  // Sincronización automática de carritos y favoritos según autenticación
  useEffect(() => {
    if (isAuthenticated && userId) {
      loadUserCart(userId);
      loadUserFavorites(userId);
    } else if (status === "unauthenticated") {
      useCartStore.getState().clearCart();
      useWishlistStore.getState().clearWishlist();
    }
  }, [isAuthenticated, userId, status, loadUserCart, loadUserFavorites]);

  return (
    <>
      <GameStyles />

      {/* Barra de navegación principal fija superior */}
      <nav className="fixed top-0 w-full bg-(--iron-dark)/95 backdrop-blur-md border-b border-(--iron-medium) shadow-lg transition-all z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 lg:h-32 flex items-center justify-between gap-4">
          
          {/* ==================================================================
             1. LOGOTIPO A LA IZQUIERDA
             ================================================================== */}
          <Link href="/" className="flex items-center cursor-pointer shrink-0">
            <div className="hidden sm:block">
              <DecorarteLogo height={60} />
            </div>
            <div className="block sm:hidden">
              <DecorarteIsotype size={40} />
            </div>
          </Link>

          {/* ==================================================================
             2. NAVEGACIÓN CENTRAL (Escritorio Lg+) con validación por pathname
             ================================================================== */}
          <div className="hidden lg:flex items-center space-x-8 shrink-0">
            <Link 
              href="/" 
              className={`game-link text-xs uppercase tracking-[0.2em] font-bold transition-colors ${
                pathname === "/" 
                  ? "game-link-active text-(--accent-gold) font-black border-b-2 border-(--accent-gold) pb-1" 
                  : "text-stone-300 hover:text-(--accent-gold)"
              }`}
            >
              Catálogo
            </Link>
            <Link 
              href="/nosotros" 
              className={`game-link text-xs uppercase tracking-[0.2em] font-bold transition-colors ${
                pathname === "/nosotros" 
                  ? "game-link-active text-(--accent-gold) font-black border-b-2 border-(--accent-gold) pb-1" 
                  : "text-stone-300 hover:text-(--accent-gold)"
              }`}
            >
              Nosotros
            </Link>
            <Link 
              href="/contacto" 
              className={`game-link text-xs uppercase tracking-[0.2em] font-bold transition-colors ${
                pathname === "/contacto" 
                  ? "game-link-active text-(--accent-gold) font-black border-b-2 border-(--accent-gold) pb-1" 
                  : "text-stone-300 hover:text-(--accent-gold)"
              }`}
            >
              Contacto
            </Link>
          </div>

          {/* ==================================================================
             3. CONTROLES DE ACCESO RÁPIDO (Zona Derecha)
             ================================================================== */}
          <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">

            {/* FAVORITOS */}
            <button onClick={handleWishlist} className="focus:outline-none p-1.5 relative btn-decorarte" aria-label="Favoritos">
              <DecorarteHeartIcon size={28} filled={displayWishCount > 0} />
              {displayWishCount > 0 && (
                <span className="absolute -top-2 -right-1 bg-(--accent-gold) text-(--iron-dark) text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-(--iron-dark) shadow">
                  {displayWishCount}
                </span>
              )}
            </button>

            {/* CARRITO */}
            <button 
              onClick={() => setIsCartOpen(true)} 
              className="focus:outline-none p-1.5 relative btn-decorarte" 
              aria-label="Carrito"
            >
              <DecorarteBagIcon size={32} />
              {displayItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-(--accent-gold) text-(--iron-dark) text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-(--iron-dark) shadow">
                  {displayItems}
                </span>
              )}
            </button>

            {/* PERFIL DE USUARIO */}
            <div className="relative" ref={profileMenuRef}>
              {isAuthenticated ? (
                <button 
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="focus:outline-none p-1.5 flex items-center gap-1.5 text-stone-200 font-bold text-[11px] btn-decorarte"
                >
                  <DecorarteUserIcon size={28} />
                  <span className="hidden md:inline text-stone-400 font-medium lowercase">
                    hola, <span className="font-black uppercase text-stone-100">{session?.user?.name?.split(" ")[0]}</span>
                  </span>
                </button>
              ) : (
                <Link href="/auth/login" className="focus:outline-none p-1.5 block btn-decorarte" aria-label="Iniciar Sesión">
                  <DecorarteUserIcon size={28} />
                </Link>
              )}

              {isAuthenticated && isProfileMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-(--iron-dark) rounded-xl border-2 border-(--iron-medium) shadow-xl py-2 z-50 flex flex-col font-bold uppercase text-[10px] tracking-widest text-stone-200">
                  <div className="px-4 py-2 border-b border-(--iron-medium) text-stone-400 font-normal text-[9px] lowercase">
                    cuenta: <br /><span className="font-bold text-stone-200 normal-case text-xs">{session?.user?.email}</span>
                  </div>

                  {session?.user?.role === 'ADMIN' && (
                    <Link 
                      href="/admin" 
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="px-4 py-3 text-(--accent-gold) hover:bg-(--iron-medium) transition-colors border-b border-(--iron-medium) font-black"
                    >
                      👑 Panel Administración
                    </Link>
                  )}

                  <Link href="/orders" onClick={() => setIsProfileMenuOpen(false)} className="px-4 py-3 hover:bg-(--iron-medium) transition-colors">
                    Mis Compras
                  </Link>

                  <button 
                    onClick={async () => {
                      setIsProfileMenuOpen(false);
                      useCartStore.getState().clearCart();
                      useCartStore.getState().clearAddress();
                      useWishlistStore.getState().clearWishlist();

                      localStorage.removeItem('decorarte-shopping-cart');
                      localStorage.removeItem('decorarte-wishlist');
                      
                      await signOut({ redirect: false });
                      window.location.href = '/';
                    }} 
                    className="px-4 py-3 text-left hover:bg-red-950/40 text-red-400 border-t border-(--iron-medium) transition-colors mt-1 font-black"
                  >
                    [ Cerrar Sesión ]
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* ==================================================================
           4. BARRA INFERIOR MÓVIL
           ================================================================== */}
        <div className="lg:hidden w-full bg-(--iron-medium)/80 border-t border-(--iron-medium) py-1.5 px-4 flex justify-center items-center">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-full max-w-xs py-1.5 rounded-lg bg-(--iron-dark) border border-(--iron-light) text-(--accent-gold) hover:bg-(--iron-light)/20 transition-all focus:outline-none shadow-sm flex items-center justify-center gap-2"
            aria-label="Abrir Menú de Navegación"
          >
            {isMobileMenuOpen ? (
              <>
                <svg className="w-4 h-4 transform rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="text-[10px] font-black uppercase tracking-widest text-stone-300">Cerrar Menú</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 transform transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
                <span className="text-[10px] font-black uppercase tracking-widest text-(--accent-gold)">Menú</span>
              </>
            )}
          </button>
        </div>

        {/* ==================================================================
           5. MENÚ MÓVIL DESPLEGABLE (Drawer) con validación automática por pathname
           ================================================================== */}
        {isMobileMenuOpen && (
          <div ref={mobileMenuRef} className="lg:hidden bg-(--iron-dark) border-b-2 border-(--iron-medium) px-6 py-6 flex flex-col space-y-4 shadow-2xl animate-fadeIn">
            <Link 
              href="/" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-xs uppercase tracking-[0.2em] py-3 border-b border-(--iron-medium) flex items-center justify-between ${
                pathname === "/" 
                  ? "text-(--accent-gold) font-black bg-(--iron-medium)/30 px-3 rounded" 
                  : "text-stone-300 font-bold"
              }`}
            >
              <span>Catálogo</span>
              <span className="text-[10px]">→</span>
            </Link>
            <Link 
              href="/nosotros" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-xs uppercase tracking-[0.2em] py-3 border-b border-(--iron-medium) flex items-center justify-between ${
                pathname === "/nosotros" 
                  ? "text-(--accent-gold) font-black bg-(--iron-medium)/30 px-3 rounded" 
                  : "text-stone-300 font-bold"
              }`}
            >
              <span>Nosotros / Taller</span>
              <span className="text-[10px]">→</span>
            </Link>
            <Link 
              href="/contacto" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-xs uppercase tracking-[0.2em] py-3 flex items-center justify-between ${
                pathname === "/contacto" 
                  ? "text-(--accent-gold) font-black bg-(--iron-medium)/30 px-3 rounded" 
                  : "text-stone-300 font-bold"
              }`}
            >
              <span>Contacto</span>
              <span className="text-[10px]">→</span>
            </Link>
          </div>
        )}
      </nav>

      {/* Componente lateral del Carrito */}
      <SidebarCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}