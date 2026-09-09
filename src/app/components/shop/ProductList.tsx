// src/app/components/shop/ProductList.tsx
"use client";

import React, { useState, useMemo } from 'react';
import { Product, Category } from '@prisma/client';
import CardProduct from './CardProduct';
import FilterCatalog from './FilterCatalog';

interface ProductListProps {
  initialProducts: (Product & { category: Category })[];
  categories: Category[];
}

const ITEMS_PER_PAGE = 3; // Cantidad óptima para paginación mobile-first

export default function ProductList({ initialProducts, categories }: ProductListProps) {
  const [activeCategory, setActiveCategory] = useState('todo');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Wrappers para cambiar filtros y resetear la página a 1
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Filtrado optimizado de productos
  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return initialProducts.filter(product => {
      const matchesCategory = activeCategory === 'todo' || product.category.slug === activeCategory;
      const matchesQuery = 
        !query ||
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);
      
      return matchesCategory && matchesQuery;
    });
  }, [initialProducts, activeCategory, searchQuery]);

  // Cálculo de paginación robusto
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  // Segmentación exacta de los elementos para la página actual
  const paginatedProducts = useMemo(() => {
    const start = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, safeCurrentPage]);

  return (
    <>
      {/* 1. Componente de Filtros y Búsqueda */}
      <FilterCatalog 
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      {/* 2. Grilla Dinámica de Productos */}
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {paginatedProducts.length > 0 ? (
          <div className="p-8 mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {paginatedProducts.map((product) => (
              <CardProduct key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* 3. Estado de feedback condicional si no hay resultados */
          <div className="w-full text-center py-16 bg-white/50 backdrop-blur-xs rounded-3xl border border-stone-200 my-8">
            <p className="text-stone-600 font-bold uppercase tracking-wider text-sm">
              No se encontraron piezas que coincidan con tu búsqueda.
            </p>
            <p className="text-stone-400 text-xs mt-1">
              Prueba buscando con otros términos o cambiando de categoría.
            </p>
          </div>
        )}

        {/* 4. Componente de Paginación Optimizado (Mobile-First) */}
        {totalPages > 1 && (
          <nav 
            aria-label="Paginación de productos" 
            className="mt-8 pt-6 border-t-2 border-stone-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 px-2"
          >
            {/* Indicador de progreso */}
            <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider text-center sm:text-left">
              Página <span className="text-[#1C1816] font-black">{safeCurrentPage}</span> de <span className="text-[#1C1816] font-black">{totalPages}</span>
            </div>

            {/* Controles de navegación */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto justify-between sm:justify-center">
              {/* Botón Anterior */}
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={safeCurrentPage <= 1}
                className="flex-1 sm:flex-none px-3 sm:px-3.5 py-2.5 rounded-xl border-2 border-stone-200 bg-white text-stone-700 hover:bg-stone-100 disabled:opacity-30 disabled:hover:bg-white text-xs font-black uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
                <span>Anterior</span>
              </button>

              {/* Números de página */}
              <div className="flex items-center gap-1 mx-1 overflow-x-auto max-w-55 sm:max-w-none py-1 scrollbar-none">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  const isNearCurrent = Math.abs(page - safeCurrentPage) <= 1 || page === 1 || page === totalPages;
                  
                  if (!isNearCurrent) {
                    if (page === 2 || page === totalPages - 1) {
                      return <span key={page} className="px-1 text-stone-400 font-bold text-xs select-none">•••</span>;
                    }
                    return null;
                  }

                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`min-w-9 h-9 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                        safeCurrentPage === page
                          ? "bg-[#1C1816] text-[#FFC107] shadow-sm scale-105"
                          : "border-2 border-stone-200 bg-white text-stone-600 hover:bg-stone-100"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              {/* Botón Siguiente */}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={safeCurrentPage >= totalPages}
                className="flex-1 sm:flex-none px-3 sm:px-3.5 py-2.5 rounded-xl border-2 border-stone-200 bg-white text-stone-700 hover:bg-stone-100 disabled:opacity-30 disabled:hover:bg-white text-xs font-black uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer disabled:cursor-not-allowed"
              >
                <span>Siguiente</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </nav>
        )}
      </div>
    </>
  );
}