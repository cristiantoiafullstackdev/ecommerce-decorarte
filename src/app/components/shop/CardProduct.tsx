// src/app/components/shop/CardProduct.tsx
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product, Category } from '@prisma/client';
import { DecorarteIsotype } from '@/app/components/iconos/DecorArteBrand';
import { useCartStore } from '@/store/cart/cart-store';
import { useWishlistStore } from '@/store/wishlist/wishlist-store';
import { useSession } from 'next-auth/react'; // <--- 1. Importamos la sesión de NextAuth

interface CardProductProps {
  product: Product & { category: Category };
}

export default function CardProduct({ product }: CardProductProps) {
  const { data: session } = useSession(); // <--- 2. Obtenemos la sesión actual
  const userId = session?.user?.id;       // <--- 3. Extraemos el id del usuario logueado

  const toggleFavorite = useWishlistStore((state) => state.toggleFavorite);
  const isFav = useWishlistStore((state) => state.isFavorite(product.id));
  const _hasHydrated = useWishlistStore((state) => state._hasHydrated);
  // Solo marcamos como favorito si Zustand ya cargó del localStorage
  const isFavorite = _hasHydrated && isFav;

  const [imgError, setImgError] = useState(false);
  const addProductToCart = useCartStore((state) => state.addProductToCart);
  
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(value);
  };

  const hasValidImage = product.images && product.images[0] && !imgError;

  return (
    <div className="group relative bg-white rounded-2xl border-2 border-stone-200/80 shadow-[0_8px_24px_rgba(28,24,22,0.04)] hover:shadow-[0_12px_32px_rgba(28,24,22,0.12)] hover:border-[#B57C38] transition-all duration-300 flex flex-col overflow-hidden">

      {/* Botón de Favorito con userId */}
      <button 
        onClick={() => toggleFavorite(product.id, userId)} // <--- 4. Pasamos el userId aquí
        className="absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur-xs rounded-full border border-stone-200 hover:scale-110 transition-all shadow-xs"
        aria-label="Marcar como favorito"
      >
        <span className={`text-lg leading-none ${isFavorite ? 'text-[#C84B31] font-bold' : 'text-stone-400'}`}>
          {isFavorite ? '♥' : '♡'}
        </span>
      </button>
      
      {/* Resto de tu componente imagen y textos... */}
      <div className="relative w-full aspect-square bg-[#F5F2EB] flex items-center justify-center overflow-hidden border-b border-stone-100">
        <span className="absolute top-3 left-3 z-10 bg-[#1C1816] text-[#F5F2EB] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border border-stone-700 shadow-sm">
          {product.category.name}
        </span>

        {hasValidImage ? (
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-[#EFECE4] to-[#E5E1D5] flex flex-col items-center justify-center p-6 text-center select-none">
            <div className="text-[#1C1816]/15 group-hover:text-[#B57C38]/20 transition-colors duration-300">
              <DecorarteIsotype size={72} />
            </div>
            <span className="text-[9px] uppercase tracking-[0.2em] font-black text-stone-400 mt-3 block">
              Pieza en Taller
            </span>
          </div>
        )}
        
        <div className="absolute inset-0 bg-[#3A2212]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-5 flex flex-col grow justify-between bg-[#E2DCD0]">
        <div>
          <h3 className="font-bold text-stone-900 text-base md:text-lg tracking-tight leading-snug group-hover:text-[#B57C38] transition-colors duration-200">
            {product.title}
          </h3>
          <p className="text-xs text-stone-500 mt-1 line-clamp-2 font-light">
            {product.description}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between pt-3 border-t border-stone-300/80">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-stone-600 font-bold flex items-center gap-1">
              Stock: {product.stock}
            </span>
            <span className="text-xl font-black text-[#1C1816]">
              {formatPrice(product.price)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Botón de Carrito con userId */}
            <button
              onClick={() => addProductToCart(product, 1, userId)} // <--- 5. Pasamos el userId aquí también
              disabled={product.stock === 0}
              className="game-bounce bg-[#1C1816] hover:bg-[#B57C38] text-[#FFC107] hover:text-white border-2 border-[#1C1816] rounded-xl p-3 shadow-[0_3px_0px_#B57C38] active:translate-y-0.75 active:shadow-none disabled:opacity-30 disabled:pointer-events-none transition-all duration-100 focus:outline-none"
              aria-label="Añadir directo a la bolsa"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
            </button>

            <Link 
              href={`/product/${product.slug}`}
              className="game-bounce bg-[#F5F2EB] hover:bg-[#1C1816] text-[#1C1816] hover:text-[#FFC107] border-2 border-[#1C1816] rounded-xl p-3 shadow-[0_3px_0px_#1C1816] active:translate-y-0.75 active:shadow-none transition-all duration-100 focus:outline-none"
              aria-label={`Ver detalles de ${product.title}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}