// src/app/components/shop/HeroShop.tsx
import Image from 'next/image';

export default function HeroShop() {
  return (
    // pt-32 empuja perfectamente todo el contenido hacia abajo absorbiendo la barra de navegación de 128px.
    <section className="relative w-full h-[75vh] min-h-137.5 flex items-center justify-start overflow-hidden bg-[#1C1816] pt-32">
      
      <Image
        src="/imagen-hero.png"
        alt="Taller artesanal cálido y ordenado de DecorArte"
        fill
        className="w-full h-full object-cover opacity-55 object-center"
        priority
      />
      
      <div 
        className="absolute inset-0 bg-linear-to-r from-[#1C1816]/95 via-[#1C1816]/50 to-transparent z-1" 
        aria-hidden="true" 
      />

      {/* Contenedor */}
      <div className="relative z-10 max-w-2xl px-8 md:px-16 lg:px-24 text-[#F5F2EB]">
        
        <span className="text-[#FFC107] text-xs font-bold uppercase tracking-[0.3em] block mb-3">
          Taller de Mobiliario de Autor
        </span>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.15] tracking-tight text-white">
          Artesanías en <br />
          <span className="text-[#D7A15C]">Madera & Hierro</span>
        </h1>
        
        <p className="mt-4 text-base md:text-lg text-[#F5F2EB]/80 max-w-md leading-relaxed font-light">
          Muebles con alma artesanal creados en Córdoba, diseñados para trascender generaciones.
        </p>

        <div className="mt-8">
          <a
            href="#catalogo"
            className="inline-block game-bounce bg-[#B57C38] hover:bg-[#966F43] active:bg-[#6E471B] text-[#F5F2EB] text-xs font-bold uppercase tracking-[0.2em] px-8 py-4 rounded-xl border-2 border-[#1C1816] shadow-[0_4px_0px_#1C1816] hover:translate-y-0.5 hover:shadow-[0_2px_0px_#1C1816] active:translate-y-1 active:shadow-none transition-all duration-150"
          >
            Explorar Colecciones
          </a>
        </div>

      </div>
    </section>
  );
}