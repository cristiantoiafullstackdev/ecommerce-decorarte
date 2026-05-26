// src/app/components/shop/CardProduct.tsx
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product, Category } from '@prisma/client';
import { DecorarteIsotype } from '@/app/components/iconos/DecorArteBrand';

interface CardProductProps {
  product: Product & { category: Category };
}

export default function CardProduct({ product }: CardProductProps) {
  // Estado local para capturar si la imagen externa de Unsplash u otra fuente falla
  const [imgError, setImgError] = useState(false);
  
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(value);
  };

  // Validamos si el array tiene un string útil y si no ha dado error previo
  const hasValidImage = product.images && product.images[0] && !imgError;

  return (
    <div className="group relative bg-white rounded-2xl border-2 border-stone-200/80 shadow-[0_8px_24px_rgba(28,24,22,0.04)] hover:shadow-[0_12px_32px_rgba(28,24,22,0.12)] hover:border-[#B57C38] transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Contenedor de Imagen o Placeholder Condicional */}
      <div className="relative w-full aspect-square bg-[#F5F2EB] flex items-center justify-center overflow-hidden border-b border-stone-100">
        <span className="absolute top-3 left-3 z-10 bg-[#1C1816] text-[#F5F2EB] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border border-stone-700 shadow-sm">
          {product.category.name}
        </span>

        {hasValidImage ? (
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            onError={() => setImgError(true)}
          />
        ) : (
          /* SUSTITUTO ARTESANAL: Caja texturizada con el Isotipo de DecorArte */
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

      {/* Datos del Producto */}
      <div className="p-5 flex flex-col grow justify-between bg-white">
        <div>
          <h3 className="font-bold text-stone-900 text-base md:text-lg tracking-tight leading-snug group-hover:text-[#B57C38] transition-colors duration-200">
            {product.title}
          </h3>
          <p className="text-xs text-stone-500 mt-1 line-clamp-2 font-light">
            {product.description}
          </p>
        </div>

        {/* Precio y Enlace */}
        <div className="mt-4 flex items-center justify-between pt-3 border-t border-stone-100">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold flex items-center gap-1">
              Stock: {product.stock}
            </span>
            <span className="text-xl font-black text-[#1C1816]">
              {formatPrice(product.price)}
            </span>
          </div>

          <Link 
            href={`/product/${product.slug}`}
            className="game-bounce bg-[#F5F2EB] hover:bg-[#1C1816] text-[#1C1816] hover:text-[#FFC107] border-2 border-[#1C1816] rounded-xl p-3 shadow-[0_3px_0px_#1C1816] hover:translate-y-px hover:shadow-[0_2px_0px_#1C1816] active:translate-y-0.75 active:shadow-none transition-all duration-100 focus:outline-none"
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
  );
}