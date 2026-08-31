// src/app/components/shop/CardProduct.tsx
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product, Category } from '@prisma/client';
import { DecorarteIsotype } from '@/app/components/iconos/DecorArteBrand';
import { useCartStore } from '@/store/cart/cart-store';
import { useWishlistStore } from '@/store/wishlist/wishlist-store';
import { useSession } from 'next-auth/react';

interface CardProductProps {
  product: Product & { category: Category };
}

export default function CardProduct({ product }: CardProductProps) {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const toggleFavorite = useWishlistStore((state) => state.toggleFavorite);
  const isFav = useWishlistStore((state) => state.isFavorite(product.id));
  const _hasHydrated = useWishlistStore((state) => state._hasHydrated);
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

      {/* Botón de Favorito Estilo */}
      <button 
        onClick={() => toggleFavorite(product.id, userId)}
        className={`absolute top-3 right-3 z-10 game-bounce p-2.5 rounded-xl border-2 transition-all duration-100 shadow-[0_3px_0px_#1C1816] active:translate-y-0.75 active:shadow-none focus:outline-none flex items-center justify-center
          ${isFavorite 
            ? 'bg-[#1C1816] border-[#1C1816] text-[#D69624]' 
            : 'bg-[#F5F2EB] border-[#1C1816] text-stone-700 hover:bg-[#1C1816] hover:text-[#D69624]'
          }`}
        aria-label="Marcar como favorito"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill={isFavorite ? "#D69624" : "none"} 
          viewBox="0 0 24 24" 
          strokeWidth={2.5} 
          stroke="currentColor" 
          className="w-5 h-5 transition-transform duration-300 group-hover:scale-105"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>
      </button>
      
      {/* Contenedor de Imagen */}
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

      {/* Información e Inferior */}
      <div className="p-3 sm:p-5 flex flex-col grow justify-between bg-[#E2DCD0]">
        <div>
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-bold text-stone-900 text-base md:text-lg tracking-tight leading-snug group-hover:text-[#B57C38] transition-colors duration-200 line-clamp-1">
              {product.title}
            </h3>
          </Link>
          <p className="text-xs text-stone-600 mt-1 line-clamp-2 font-light leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between pt-3 border-t border-stone-300/80 gap-2">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-widest text-stone-500 font-bold">
              Stock: {product.stock}
            </span>
            <span className="text-md md:text-xl font-black text-[#1C1816]">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* Botones de acción agrupados: Carrito + Ver Detalle */}
          <div className="flex items-center gap-1 md:gap-2">
            {/* 1. Botón de Carrito (Bolsa) */}
            <button
              onClick={() => addProductToCart(product, 1, userId)}
              disabled={product.stock === 0}
              className="game-bounce bg-[#1C1816] hover:bg-[#B57C38] text-[#FFC107] hover:text-white border-2 border-[#1C1816] rounded-xl p-2.5 shadow-[0_3px_0px_#B57C38] active:translate-y-0.75 active:shadow-none disabled:opacity-30 disabled:pointer-events-none transition-all duration-100 focus:outline-none"
              aria-label="Añadir directo a la bolsa"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
            </button>

            {/* 2. Botón de Ver Detalle (Ojo) */}
            <Link 
              href={`/product/${product.slug}`}
              className="game-bounce bg-[#F5F2EB] hover:bg-[#1C1816] text-[#1C1816] hover:text-[#FFC107] border-2 border-[#1C1816] rounded-xl p-2.5 shadow-[0_3px_0px_#1C1816] active:translate-y-0.75 active:shadow-none transition-all duration-100 focus:outline-none flex items-center justify-center"
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