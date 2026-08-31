// src/app/(shop)/nosotros/page.tsx
import Link from 'next/link';
import { DecorarteIsotype } from '@/app/components/iconos/DecorArteBrand';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F5F2EB] pt-32 pb-20 px-4 sm:px-6 md:px-8 font-sans text-stone-900">
      <div className="max-w-4xl mx-auto space-y-10 sm:space-y-12">
        
        {/* Cabecera Institucional */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl border-2 border-stone-200 shadow-sm text-[#B57C38] mb-2">
            <DecorarteIsotype size={40} />
          </div>
          <span className="text-[10px] text-[#B57C38] uppercase tracking-[0.2em] font-black block bg-[#E2DCD0] max-w-max mx-auto px-2.5 py-1 rounded-md">
            Tradición y Oficio
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-[#1C1816]">
            El Taller detrás de DecorArte
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-stone-600 max-w-2xl mx-auto font-medium px-2 leading-relaxed">
            Creamos objetos de diseño y mobiliario donde el hierro y la madera noble se fusionan para perdurar en el tiempo. Cada pieza cuenta una historia única.
          </p>
        </div>

        {/* Bloque de Contenido / Filosofía */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-6 sm:p-8 md:p-12 rounded-3xl border-2 border-stone-200 shadow-sm">
          <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
            <h2 className="text-base sm:text-lg font-black uppercase text-[#1C1816] tracking-wide">
              Hecho a mano en Córdoba, Argentina
            </h2>
            <p>
              En <strong className="text-[#1C1816]">DecorArte</strong>, no creemos en la producción en masa impersonal. Cada estante, mesa y elemento decorativo pasa por un riguroso proceso de selección de materiales, herrería artesanal y terminaciones cuidadas al detalle.
            </p>
            <p>
              Trabajamos con maderas estacionadas de primera calidad y estructuras metálicas diseñadas para brindar máxima estabilidad y estética contemporánea a tus espacios.
            </p>
          </div>
          <div className="relative h-56 sm:h-64 md:h-80 rounded-2xl overflow-hidden border-2 border-stone-200 bg-[#FCF9F5] flex items-center justify-center">
            <div className="text-center p-6 space-y-2">
              <DecorarteIsotype size={60} />
              <span className="text-xs font-black text-stone-400 uppercase tracking-widest block">DecorArte Studio</span>
            </div>
          </div>
        </div>

        {/* Llamado a la acción */}
        <div className="text-center pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-block px-8 py-4 bg-[#1C1816] text-[#FFC107] hover:bg-[#B57C38] hover:text-white rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all shadow-[0_4px_0px_#B57C38] active:translate-y-1 active:shadow-none"
          >
            Explorar Catálogo de Piezas
          </Link>
        </div>

      </div>
    </main>
  );
}