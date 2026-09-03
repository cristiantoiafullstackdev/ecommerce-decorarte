//src/app/components/shop/FilterCatalog.tsx

"use client";

import { Category } from '@prisma/client';

interface FilterCatalogProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (slug: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function FilterCatalog({ 
  categories, 
  activeCategory, 
  onCategoryChange,
  searchQuery,
  onSearchChange
}: FilterCatalogProps) {
  
  const dynamicCategories = categories.filter(cat => cat.slug !== 'todo');

  return (
    <section id="catalog" className="w-full bg-[#E2DCD0] py-12 px-6 md:px-16 lg:px-24 border-b border-stone-200 scroll-mt-36">
      <div className="max-w-8xl mx-auto space-y-8">
        
        {/* Section Header & Barra de Búsqueda Integrada */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-[0.2em] text-[#1C1816]">
              Nuestras Colecciones
            </h2>
            <div className="w-24 h-1 bg-[#B57C38] mt-3 rounded-full" />
          </div>

          {/* Input de Búsqueda en Vivo */}
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-stone-400">
              🔍
            </span>
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar piezas, cuadros, decoración..."
              className="w-full bg-white text-stone-900 text-xs font-medium pl-10 pr-4 py-3.5 rounded-xl border-2 border-stone-300 focus:border-[#1C1816] focus:outline-none shadow-xs transition-all placeholder:text-stone-400"
            />
            {searchQuery && (
              <button 
                onClick={() => onSearchChange('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-bold text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Filters Container with horizontal mobile scrolling */}
        <div className="flex items-center justify-start md:justify-center overflow-x-auto p-2 space-x-3 md:space-x-4">
          
          <button
            onClick={() => onCategoryChange('todo')}
            className={`
              shrink-0 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-[0.15em] 
              border-2 transition-all duration-150 game-bounce focus:outline-none
              ${activeCategory === 'todo'
                ? 'bg-[#1C1816] text-[#FFC107] border-[#1C1816] shadow-[0_4px_0px_#B57C38]' 
                : 'bg-white text-stone-700 border-stone-300 shadow-[0_4px_0px_rgba(28,24,22,0.15)] hover:border-stone-500 hover:text-stone-900 active:translate-y-0.5'
              }
            `}
          >
            Ver Todo
          </button>

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
                    : 'bg-white text-stone-700 border-stone-300 shadow-[0_4px_0px_rgba(28,24,22,0.15)] hover:border-stone-500 hover:text-stone-900 active:translate-y-0.5'
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