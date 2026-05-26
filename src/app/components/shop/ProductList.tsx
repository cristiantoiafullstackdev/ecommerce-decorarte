// src/app/components/shop/ProductList.tsx
"use client";

import React, { useState } from 'react';
import { Product, Category } from '@prisma/client';
import CardProduct from './CardProduct';
import FilterCatalog from './FilterCatalog';

// Definimos la interfaz en inglés agregando la relación compuesta obligatoria con Category
interface ProductListProps {
  initialProducts: (Product & { category: Category })[];
  categories: Category[];
}

export default function ProductList({ initialProducts, categories }: ProductListProps) {
  // Estado local para controlar cuál es la categoría seleccionada por el usuario
  const [activeCategory, setActiveCategory] = useState('todo');

  // Filtrado reactivo veloz en memoria basado en el slug técnico
  const filteredProducts = activeCategory === 'todo'
    ? initialProducts
    : initialProducts.filter(product => product.category.slug === activeCategory);

  return (
    <>
      {/* 1. Componente de Filtros unificado y conectado a los estados */}
      <FilterCatalog 
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* 2. Grilla Dinámica de Productos */}
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="p-8 mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {filteredProducts.map((product) => (
            <CardProduct key={product.id} product={product} />
          ))}
        </div>

        {/* 3. Estado de feedback condicional si no hay stock ni piezas cargadas en esa categoría */}
        {filteredProducts.length === 0 && (
          <div className="w-full text-center py-16">
            <p className="text-stone-500 font-medium tracking-wide">
              No se encontraron piezas en esta colección actualmente.
            </p>
          </div>
        )}
      </div>
    </>
  );
}