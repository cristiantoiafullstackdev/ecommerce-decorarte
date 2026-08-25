//src/app/components/ui/header/Header.tsx

"use client";

import { useState, useEffect, useRef } from 'react';
import { searchProducts } from '@/actions/product-actions';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
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
import SidebarCart from '@/app/components/cart/SidebarCart';
import { useWishlistStore } from '@/store/wishlist/wishlist-store';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface HeaderProps {
  currentSection?: string;
  wishCout?: number;
}

interface SearchProduct {
  id: string;
  title: string;
  slug: string;
  images: string[];
  price: number;
}

// Extensión segura para la propiedad role del usuario en NextAuth
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

export default function Header({ currentSection = "catalogo" }: HeaderProps) {
  const router = useRouter();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Detecta de forma síncrona si ya estamos en el navegador
  const [isMounted] = useState(() => typeof window !== 'undefined');

  
  // Referencias para manejar clics fuera de los menús flotantes
  const searchRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  
  const { data: session, status } = useSession() as { data: ExtendedSession | null; status: string };
  const isAuthenticated = status === "authenticated";
  const userId = session?.user?.id; // <--- 1. Extraemos el id del usuario actual

  const hasHydrated = useCartStore((state) => state._hasHydrated);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const loadUserCart = useCartStore((state) => state.loadUserCart); // <--- 2. Traemos la función de carga del carrito

  const hasHydratedWish = useWishlistStore((state) => state._hasHydrated);
  const wishCount = useWishlistStore((state) => state.getWishCount());
  const loadUserFavorites = useWishlistStore((state) => state.loadUserFavorites); // <--- 3. Traemos la función de carga de favorito
  const displayWishCount = isMounted && hasHydratedWish ? wishCount : 0;  
  const displayItems = isMounted && hasHydrated ? totalItems : 0;

  // Efecto para cerrar menús al hacer clic fuera de ellos
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Efecto para buscar en tiempo real con debounce
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        setIsLoading(true);
        const results = await searchProducts(searchQuery);
        setSearchResults(results);
        setIsLoading(false);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  const handleWishlist = () => {
    router.push('/favorites');
  };

  // 4. EL PUENTE DE SINCRONIZACIÓN AUTOMÁTICA
  useEffect(() => {
    if (isAuthenticated && userId) {
      // Si hay un usuario logueado, traemos sus datos reales de la BD
      loadUserCart(userId);
      loadUserFavorites(userId);
    } else if (status === "unauthenticated") {
      // Si cerró sesión o no hay nadie, limpiamos la memoria visual local
      useCartStore.getState().clearCart();
      useWishlistStore.getState().clearWishlist();
    }
  }, [isAuthenticated, userId, status, loadUserCart, loadUserFavorites]);

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
            <Link href="/" className={`game-link text-sm uppercase tracking-[0.2em] font-bold text-stone-800 ${currentSection === "catalogo" ? "game-link-active" : ""}`}>
              Catálogo
            </Link>
            <Link href="/nosotros" className={`game-link text-sm uppercase tracking-[0.2em] font-bold text-stone-800 ${currentSection === "nosotros" ? "game-link-active" : ""}`}>
              Nosotros
            </Link>
            <Link href="/contacto" className={`game-link text-sm uppercase tracking-[0.2em] font-bold text-stone-800 ${currentSection === "contacto" ? "game-link-active" : ""}`}>
              Contacto
            </Link>
          </div>

          {/* 3. CONTROLES CON BOTONES COMPACTOS */}
          <div className="flex items-center space-x-6">

            {/* BOTÓN DEL BUSCAR (LUPA) */}
            <div className="relative flex items-center" ref={searchRef}>
              <button onClick={toggleSearch} className="focus:outline-none p-1 game-bounce text-stone-800 hover:text-[#C84B31] transition-colors" aria-label="Buscar">
                <DecorarteSearchIcon size={36} />
              </button>

              {/* Panel Desplegable de Búsqueda Predictiva Rediseñado */}
              {isSearchOpen && (
                <div className="absolute right-0 top-14 w-80 sm:w-96 bg-[#FCF9F5] p-4 rounded-2xl border-2 border-stone-300 shadow-2xl z-50 flex flex-col gap-3 animate-fadeIn">
                  <div className="relative">
                    <input 
                      type="text"
                      placeholder="¿Qué estás buscando hoy?"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      className="w-full bg-white px-4 py-2.5 text-xs font-bold text-stone-800 rounded-xl border border-stone-200 shadow-inner focus:outline-none focus:border-[#C84B31] tracking-wide"
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs font-bold"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Lista de resultados */}
                  <div className="max-h-72 overflow-y-auto flex flex-col gap-1.5 pr-1">
                    {isLoading && (
                      <div className="py-6 text-center">
                        <span className="inline-block w-5 h-5 border-2 border-[#C84B31] border-t-transparent rounded-full animate-spin"></span>
                        <p className="text-[10px] text-stone-400 mt-2 uppercase tracking-widest font-black">Buscando tesoros...</p>
                      </div>
                    )}

                    {!isLoading && searchQuery.trim().length > 1 && searchResults.length === 0 && (
                      <div className="py-8 text-center flex flex-col items-center gap-1">
                        <span className="text-2xl">🔍</span>
                        <p className="text-xs font-bold text-stone-700 uppercase tracking-tight">Sin resultados</p>
                        <p className="text-[10px] text-stone-400">Prueba con otra palabra clave</p>
                      </div>
                    )}

                    {!isLoading && searchQuery.trim().length <= 1 && (
                      <div className="py-4 text-center">
                        <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Escribe al menos 2 letras</p>
                      </div>
                    )}

                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.slug}`}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="flex items-center gap-3 p-2 bg-white/60 hover:bg-white rounded-xl border border-stone-200/80 hover:border-[#C84B31]/40 transition-all shadow-sm group"
                      >
                        {/* Miniatura */}
                        <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                          <Image 
                            src={product.images[0] ? (product.images[0].startsWith('http') ? product.images[0] : `/products/${product.images[0]}`) : '/placeholder.jpg'} 
                            alt={product.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        
                        {/* Info */}
                        <div className="flex flex-col overflow-hidden flex-1">
                          <span className="text-xs font-black text-stone-800 truncate uppercase tracking-tight group-hover:text-[#C84B31] transition-colors">
                            {product.title}
                          </span>
                          <span className="text-xs font-bold text-[#C84B31] mt-0.5">
                            ${Number(product.price).toLocaleString()}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* BOTÓN DE FAVORITOS */}
            <button onClick={handleWishlist} className="focus:outline-none p-1 relative game-bounce" aria-label="Favoritos">
              <DecorarteHeartIcon size={40} filled={displayWishCount > 0} />
              {displayWishCount > 0 && (
                <span className="absolute -top-3 -right-1.5 bg-[#C84B31] text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-stone-900 shadow">
                  {displayWishCount}
                </span>
              )}
            </button>

            {/* BOTÓN DEL CARRITO */}
            <button 
              onClick={() => setIsCartOpen(true)} 
              className="focus:outline-none p-1 relative game-bounce" 
              aria-label="Carrito"
            >
              <DecorarteBagIcon size={48} />
              {displayItems > 0 && (
                <span className="absolute -top-1 -right-1.5 bg-[#C84B31] text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-stone-900 shadow">
                  {displayItems}
                </span>
              )}
            </button>

            {/* PERFIL DINÁMICO CONECTADO A NEXTAUTH */}
            <div className="relative" ref={profileMenuRef}>
              {isAuthenticated ? (
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
                <Link href="/auth/login" className="focus:outline-none p-1 block game-bounce" aria-label="Iniciar Sesión">
                  <DecorarteUserIcon size={36} />
                </Link>
              )}

              {/* Menú Flotante Desplegable */}
              {isAuthenticated && isProfileMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-[#FCF9F5] rounded-xl border-2 border-stone-200 shadow-xl py-2 z-50 flex flex-col font-bold uppercase text-[10px] tracking-widest text-stone-700 animate-fadeIn">
                  <div className="px-4 py-2 border-b border-stone-200 text-stone-400 font-normal text-[9px] lowercase">
                    Conectado como: <br /><span className="font-bold text-stone-600 normal-case text-xs">{session?.user?.email}</span>
                  </div>

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
                    onClick={async () => {
                      setIsProfileMenuOpen(false);
                      // 1. Limpiamos manualmente los stores de Zustand al instante
                      useCartStore.getState().clearCart();
                      useCartStore.getState().clearAddress();
                      useWishlistStore.getState().clearWishlist();

                      // ⚠️ Forzamos limpiar el localStorage residual de Zustand de raíz
                      localStorage.removeItem('decorarte-shopping-cart');
                      localStorage.removeItem('decorarte-wishlist'); // Si aplica para favoritos
                      
                      // 2. Cerramos sesión y forzamos recarga total hacia la raíz
                      await signOut({ redirect: false });
                      window.location.href = '/';
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