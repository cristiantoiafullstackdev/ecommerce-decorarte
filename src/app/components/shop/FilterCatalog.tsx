// src/app/components/shop/FilterCatalog.tsx
"use client";

import React from 'react';
import { Category } from '@prisma/client';

interface FilterCatalogProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (slug: string) => void;
}

export default function FilterCatalog({ 
  categories, 
  activeCategory, 
  onCategoryChange 
}: FilterCatalogProps) {
  
  // Excluimos "todo" de la lista dinámica si viniera reflejado en la DB
  const dynamicCategories = categories.filter(cat => cat.slug !== 'todo');

  return (
    <section id="catalog" className="w-full bg-[#F5F2EB] py-12 px-6 md:px-16 lg:px-24 border-b border-stone-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-[0.2em] text-[#1C1816]">
            Nuestras Colecciones
          </h2>
          <div className="w-24 h-1 bg-[#B57C38] mx-auto mt-3 rounded-full" />
        </div>

        {/* Filters Container with horizontal mobile scrolling */}
        <div className="flex items-center justify-start md:justify-center overflow-x-auto pb-4 md:pb-0 scrollbar-none space-x-4 md:space-x-6">
          
          {/* Master Button for 'Ver Todo' */}
          <button
            onClick={() => onCategoryChange('todo')}
            className={`
              shrink-0 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-[0.15em] 
              border-2 transition-all duration-150 game-bounce focus:outline-none
              ${activeCategory === 'todo'
                ? 'bg-[#1C1816] text-[#FFC107] border-[#1C1816] shadow-[0_4px_0px_#B57C38]' 
                : 'bg-white text-stone-700 border-stone-300 shadow-[0_4px_0px_rgba(28,24,22,0.15)] hover:border-stone-500 hover:text-stone-900 active:translate-y-0.5 active:shadow-[0_2px_0px_rgba(28,24,22,0.15)]'
              }
            `}
          >
            Ver Todo
          </button>

          {/* Dynamic Category Buttons from Neon */}
          {dynamicCategories.map((cat) => {
            const isActive = activeCategory === cat.slug;
            
            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.slug)}
                className={`
                  shrink-0 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-[0.15em] 
                  border-2 transition-all duration-150 game-bounce focus:outline-none
                  ${isActive 
                    ? 'bg-[#1C1816] text-[#FFC107] border-[#1C1816] shadow-[0_4px_0px_#B57C38]' 
                    : 'bg-white text-stone-700 border-stone-300 shadow-[0_4px_0px_rgba(28,24,22,0.15)] hover:border-stone-500 hover:text-stone-900 active:translate-y-0.5 active:shadow-[0_2px_0px_rgba(28,24,22,0.15)]'
                  }
                `}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}