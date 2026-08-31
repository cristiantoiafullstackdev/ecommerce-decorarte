// src/app/components/shop/HeroShop.tsx
import Image from 'next/image';

/**
 * ============================================================================
 * HERO SHOP COMPONENT
 * Sección de bienvenida principal para el catálogo de muebles artesanales.
 * ============================================================================
 */
export default function HeroShop() {
  return (
    <section className="relative w-full h-[75vh] min-h-[550px] flex items-center justify-start overflow-hidden bg-[var(--iron-dark)] pt-32">
      
      <Image
        src="/imagen-hero.png"
        alt="Taller artesanal cálido y ordenado de DecorArte"
        fill
        className="w-full h-full object-cover opacity-55 object-center"
        priority
      />
      
      <div 
        className="absolute inset-0 bg-gradient-to-r from-[var(--iron-dark)]/95 via-[var(--iron-dark)]/50 to-transparent z-1" 
        aria-hidden="true" 
      />

      <div className="relative z-10 max-w-2xl px-8 md:px-16 lg:px-24 text-[var(--bg-parchment)]">
        
        <span className="text-[var(--accent-gold)] text-xs font-bold uppercase tracking-[0.3em] block mb-3">
          Taller de Mobiliario de Autor
        </span>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.15] tracking-tight text-white">
          Artesanías en <br />
          <span className="text-[var(--accent-gold-light)]">Madera &amp; Hierro</span>
        </h1>
        
        <p className="mt-4 text-base md:text-lg text-[var(--bg-parchment)]/80 max-w-md leading-relaxed font-light">
          Muebles con alma artesanal creados en Córdoba, diseñados para trascender generaciones.
        </p>

        <div className="mt-8">
          <a
            href="#catalogo"
            className="inline-block game-bounce bg-[var(--accent-gold)] hover:bg-[var(--accent-gold-light)] active:bg-[var(--accent-gold)] text-[var(--iron-dark)] text-xs font-black uppercase tracking-[0.2em] px-8 py-4 rounded-xl border-2 border-[var(--iron-dark)] shadow-[0_4px_0px_var(--iron-dark)] hover:translate-y-0.5 hover:shadow-[0_2px_0px_var(--iron-dark)] active:translate-y-1 active:shadow-none transition-all duration-150"
          >
            Explorar Colecciones
          </a>
        </div>

      </div>
    </section>
  );
}