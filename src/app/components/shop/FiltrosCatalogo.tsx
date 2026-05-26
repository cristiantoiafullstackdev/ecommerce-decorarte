// src/app/components/shop/FiltrosCatalogo.tsx
"use client";

import React, { useState } from 'react';

// Definimos las colecciones conceptuales de DecorArte
const COLECCIONES = [
  { id: 'todos', nombre: 'Ver Todo' },
  { id: 'juegos', nombre: 'Juegos de Mesa' },
  { id: 'hierro', nombre: 'Hierro Forjado' },
  { id: 'iluminacion', nombre: 'Iluminación' },
  { id: 'deco', nombre: 'Objetos Deco' },
];

export default function FiltrosCatalogo() {
  const [coleccionActiva, setColeccionActiva] = useState('todos');

  return (
    <section id="catalogo" className="w-full bg-[#F5F2EB] py-12 px-6 md:px-16 lg:px-24 border-b border-stone-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Cabecera de la sección */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-[0.2em] text-[#1C1816]">
            Nuestras Colecciones
          </h2>
          <div className="w-24 h-1 bg-[#B57C38] mx-auto mt-3 rounded-full" />
        </div>

        {/* Contenedor de Filtros (Scroll horizontal automático en móviles) */}
        <div className="flex items-center justify-start md:justify-center overflow-x-auto pb-4 md:pb-0 scrollbar-none space-x-4 md:space-x-6Mask">
          {COLECCIONES.map((cat) => {
            const isActive = coleccionActiva === cat.id;
            
            return (
              <button
                key={cat.id}
                onClick={() => setColeccionActiva(cat.id)}
                className={`
                  shrink-0 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-[0.15em] 
                  border-2 transition-all duration-150 game-bounce focus:outline-none
                  ${isActive 
                    ? 'bg-[#1C1816] text-[#FFC107] border-[#1C1816] shadow-[0_4px_0px_#B57C38] translate-y-0' 
                    : 'bg-white text-stone-700 border-stone-300 shadow-[0_4px_0px_rgba(28,24,22,0.15)] hover:border-stone-500 hover:text-stone-900 active:translate-y-0.5 active:shadow-[0_2px_0px_rgba(28,24,22,0.15)]'
                  }
                `}
              >
                {cat.nombre}
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}