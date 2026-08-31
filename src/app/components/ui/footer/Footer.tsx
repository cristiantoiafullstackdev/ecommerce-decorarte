// src/app/components/footer/Footer.tsx
import Link from 'next/link';

/**
 * ============================================================================
 * FOOTER COMPONENT
 * Pie de página institucional, enlaces de ayuda, legales y autoría.
 * ============================================================================
 */
export default function Footer() {
  return (
    <footer className="w-full bg-[var(--iron-dark)] border-t-4 border-[var(--accent-wood)] text-stone-300 font-sans">
      
      {/* Sección Superior: Enlaces Institucionales y Legales */}
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-[var(--iron-medium)]">
        
        <div className="space-y-3">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent-gold-light)]">DecorArte</h4>
          <p className="text-xs text-stone-400 font-medium leading-relaxed">
            Piezas únicas en madera y hierro. Diseño artesanal con identidad y oficio en Córdoba.
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent-gold-light)]">Navegación &amp; Ayuda</h4>
          <ul className="space-y-2 text-xs font-medium">
            <li><Link href="/nosotros" className="hover:text-white transition-colors">Nosotros / Taller</Link></li>
            <li><Link href="/contacto" className="hover:text-white transition-colors">Contacto &amp; WhatsApp</Link></li>
            <li><Link href="/terminos" className="hover:text-white transition-colors">Términos y Condiciones</Link></li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent-gold)]">Defensa del Consumidor</h4>
          <ul className="space-y-2 text-xs font-medium">
            <li>
              <a 
                href="https://www.argentina.gob.ar/produccion/defensadelconsumidor" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-white transition-colors"
              >
                Defensa del Consumidor (Nación)
              </a>
            </li>
            <li>
              <Link href="/arrepentimiento" className="inline-block text-[var(--accent-gold)] hover:text-[var(--accent-gold-light)] font-bold">
                ⚖️ Botón de Arrepentimiento
              </Link>
            </li>
          </ul>
        </div>

      </div>

      {/* Sección Inferior: Copyright & Firma de Agencia */}
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row md:justify-between items-center">
        <p className="text-sm text-[var(--accent-gold-light)] opacity-80 mb-4 md:mb-0">
          &copy; {new Date().getFullYear()} DecorArte. Piezas únicas en madera y hierro.
        </p>
        <div className="text-sm">
          <span className="opacity-80 text-[var(--accent-gold-light)]">Creado por:</span>
          <a 
            href="#" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block font-medium hover:scale-105 transition-transform"
          >
            <span className="ml-2 bg-gradient-to-r from-[#FF00FF] via-[#d69bd6] to-[#FF00FF] bg-clip-text text-transparent">
              Agencia de Software <span className="text-lg ml-1 font-bold">ViiViX</span>
            </span>
          </a>
        </div>
      </div>

    </footer>
  );
}