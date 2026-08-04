//src/app/components/shop/ProductList.tsx

"use client";

import React, { useState } from 'react';
import { Product, Category } from '@prisma/client';
import CardProduct from './CardProduct';
import FilterCatalog from './FilterCatalog';

interface ProductListProps {
  initialProducts: (Product & { category: Category })[];
  categories: Category[];
}

export default function ProductList({ initialProducts, categories }: ProductListProps) {
  const [activeCategory, setActiveCategory] = useState('todo');
  const [searchQuery, setSearchQuery] = useState(''); // Estado para la búsqueda en vivo

  // Filtrado combinado: Categoría + Texto de búsqueda (por título o descripción)
  const filteredProducts = initialProducts.filter(product => {
    const matchesCategory = activeCategory === 'todo' || product.category.slug === activeCategory;
    const matchesQuery = 
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesQuery;
  });

  return (
    <>
      {/* 1. Componente de Filtros y Búsqueda */}
      <FilterCatalog 
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 2. Grilla Dinámica de Productos */}
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="p-8 mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {filteredProducts.map((product) => (
            <CardProduct key={product.id} product={product} />
          ))}
        </div>

        {/* 3. Estado de feedback condicional si no hay resultados */}
        {filteredProducts.length === 0 && (
          <div className="w-full text-center py-16 bg-white/50 backdrop-blur-xs rounded-3xl border border-stone-200 my-8">
            <p className="text-stone-600 font-bold uppercase tracking-wider text-sm">
              No se encontraron piezas que coincidan con tu búsqueda.
            </p>
            <p className="text-stone-400 text-xs mt-1">
              Prueba buscando con otros términos o cambiando de categoría.
            </p>
          </div>
        )}
      </div>
    </>
  );
}