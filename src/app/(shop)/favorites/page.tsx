// src/app/(shop)/favorites/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useWishlistStore } from '@/store/wishlist/wishlist-store';
import CardProduct from '@/app/components/shop/CardProduct';
import { Product, Category } from '@prisma/client';
import { DecorarteIsotype } from '@/app/components/iconos/DecorArteBrand';

export default function FavoritesPage() {
  const [favoriteProducts, setFavoriteProducts] = useState<(Product & { category: Category })[]>([]);
  const [loading, setLoading] = useState(true);
  
  const favoritesIds = useWishlistStore((state) => state.favorites);
  const hasHydrated = useWishlistStore((state) => state._hasHydrated);

  useEffect(() => {
    async function fetchFavoriteProducts() {
      if (!hasHydrated) return;
      
      if (favoritesIds.length === 0) {
        setFavoriteProducts([]);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/product/batch?ids=${favoritesIds.join(',')}`);
        if (res.ok) {
          const data = await res.json();
          setFavoriteProducts(data);
        }
      } catch (error) {
        console.error("Error al cargar favoritos", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFavoriteProducts();
  }, [favoritesIds, hasHydrated]);

  return (
    <main className="min-h-screen bg-[#F5F2EB] pt-32 pb-20 px-4 sm:px-6 md:px-8 font-sans text-stone-900">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Cabecera de la sección */}
        <div className="border-b pb-6 border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] text-[#B57C38] uppercase tracking-widest font-black bg-[#E2DCD0] px-2.5 py-1 rounded-md">
              Mi Espacio
            </span>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#1C1816] mt-2">
              Productos Favoritos
            </h1>
          </div>
          <Link 
            href="/"
            className="w-full sm:w-auto text-center px-6 py-3.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shrink-0"
          >
            Volver al Catálogo
          </Link>
        </div>

        {/* Contenido dinámico */}
        {!hasHydrated || loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
            <div className="text-[#B57C38] animate-spin">
              <DecorarteIsotype size={36} />
            </div>
            <span className="text-xs font-black uppercase text-stone-500 tracking-widest">Cargando tus piezas guardadas...</span>
          </div>
        ) : favoriteProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {favoriteProducts.map((product) => (
              <CardProduct key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-16 sm:py-20 text-center space-y-4 bg-white rounded-3xl border-2 border-stone-200 p-6 sm:p-8 max-w-xl mx-auto shadow-sm">
            <div className="w-16 h-16 bg-stone-100 text-stone-400 rounded-full flex items-center justify-center mx-auto text-2xl font-bold border border-stone-200">
              ♡
            </div>
            <h3 className="text-base font-black uppercase text-stone-800">Todavía no tenés favoritos</h3>
            <p className="text-xs text-stone-600 font-medium leading-relaxed max-w-sm mx-auto">
              Explorá el catálogo y hacé clic en el ícono del corazón de cualquier pieza para guardarla aquí y consultarla cuando quieras.
            </p>
            <div className="pt-2">
              <Link 
                href="/#catalog"
                className="inline-block px-6 py-3.5 bg-[#B57C38] hover:bg-[#96632B] text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-sm"
              >
                Explorar Colecciones
              </Link>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}