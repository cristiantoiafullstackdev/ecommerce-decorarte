// src/app/components/shop/ProductView.tsx
"use client";

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Product, Category } from '@prisma/client';
import { useCartStore } from '@/store/cart/cart-store'; // 1. Importamos la store
import { ProductSlideshow } from './ProductSlideShow';
import { DecorarteIsotype } from '@/app/components/iconos/DecorArteBrand';

interface ProductViewProps {
  product: Product & { category: Category };
}

export const ProductView = ({ product }: ProductViewProps) => {

  const addProductToCart = useCartStore((state) => state.addProductToCart); // 2. Traemos la acción
  const router = useRouter();
  
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 mt-4 mb-20 bg-(--bgWoodLight) backdrop-blur-md border-b border-stone-200/80 shadow-sm rounded-xl">
      
      {/* 1. NAVEGACIÓN DE RETORNO Y BREADCRUMBS */}
      <div className="mt-48 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-stone-200">
        
        {/* Botón de volver clásico con comportamiento dinámico */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1C1816] hover:text-[#B57C38] bg-white border-2 border-stone-200 hover:border-[#B57C38] px-4 py-2 rounded-xl shadow-[0_3px_0px_rgba(28,24,22,0.1)] active:translate-y-px active:shadow-none transition-all focus:outline-none w-fit"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Volver
        </button>

        {/* Migas de Pan (Breadcrumbs) para SEO y ubicación espacial */}
        <nav className="text-xs font-medium tracking-wide text-stone-500 flex items-center flex-wrap gap-2">
          <Link href="/" className="hover:text-[#B57C38] transition-colors">
            Inicio
          </Link>
          <span className="text-stone-300 font-bold">/</span>
          <Link href="/#catalog" className="hover:text-[#B57C38] transition-colors">
            Catálogo
          </Link>
          <span className="text-stone-300 font-bold">/</span>
          <span className="text-stone-400 pointer-events-none uppercase tracking-wider text-[11px] font-bold">
            {product.category.name}
          </span>
          <span className="text-stone-300 font-bold">/</span>
          <span className="text-[#1C1816] font-semibold truncate max-w-45 sm:max-w-none">
            {product.title}
          </span>
        </nav>
      </div>

      {/* 2. DETALLE DEL PRODUCTO (GRILLA) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        
        {/* Columna de Imágenes */}
        <div className="md:col-span-7 w-full">
          <ProductSlideshow images={product.images} title={product.title} />
        </div>

        {/* Columna de Detalles */}
        <div className="md:col-span-5 bg-white rounded-2xl border-2 border-stone-200/80 p-8 shadow-[0_8px_24px_rgba(28,24,22,0.04)]">
          
          {/* Etiqueta de la Colección */}
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#B57C38] bg-[#F5F2EB] px-3 py-1 rounded-md border border-stone-200">
            <DecorarteIsotype size={10} /> Colección {product.category.name}
          </span>

          {/* Título Principal */}
          <h1 className="font-bold text-3xl md:text-4xl text-[#1C1816] tracking-tight mt-4 leading-tight">
            {product.title}
          </h1>
          
          {/* Precio Formateado */}
          <p className="text-2xl font-black text-[#1C1816] mt-4">
            {formatPrice(product.price)}
          </p>

          {/* Estado de Stock */}
          <div className="mt-6 flex items-center justify-between text-xs border-t border-b border-stone-100 py-3">
            <span className="font-bold text-stone-500 uppercase tracking-wider">Disponibilidad:</span>
            {product.stock > 0 ? (
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide">
                {product.stock} disponibles en taller
              </span>
            ) : (
              <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide">
                A pedido (15 días de producción)
              </span>
            )}
          </div>

          {/* Botón de Añadir al carrito */}
          <button 
            disabled={product.stock === 0}
            onClick={() => addProductToCart(product, 1)} // 3. Cableamos el clic aquí
            className={`w-full game-bounce py-4 rounded-xl font-bold uppercase text-xs tracking-[0.2em] transition-all duration-150 border-2 mt-6 focus:outline-none flex items-center justify-center gap-2
              ${product.stock > 0
                ? 'bg-[#1C1816] hover:bg-[#B57C38] text-[#FFC107] hover:text-white border-[#1C1816] shadow-[0_4px_0px_#B57C38] active:translate-y-1 active:shadow-none'
                : 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed shadow-none'
              }
            `}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            {product.stock > 0 ? 'Añadir a la bolsa' : 'Encargar Pieza'}
          </button>

          {/* Descripción */}
          <div className="mt-8 pt-6 border-t border-stone-100">
            <h3 className="font-bold text-xs text-stone-400 uppercase pb-2 mb-3 tracking-widest">
              Descripción de la Pieza
            </h3>
            <p className="text-stone-600 leading-relaxed text-sm font-light">
              {product.description}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};