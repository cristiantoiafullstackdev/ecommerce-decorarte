//src/app/(shop)/checkout/success-transfer/page.tsx
"use client";

import React, { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCartStore } from '@/store/cart/cart-store';
import { DecorarteIsotype, GameStyles } from '@/app/components/iconos/DecorArteBrand';

// 1. Separamos el contenido que consume useSearchParams en un componente interno
function SuccessTransferContent() {
  const searchParams = useSearchParams();
  const hasHydrated = useCartStore((state) => state._hasHydrated);
  const clearCart = useCartStore((state) => state.clearCart || (() => {}));

  // Recuperamos el ID de la orden y el monto final directamente del Query String
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const orderId = searchParams.get('orderId') || 'DA-XXXXX';
  const finalTotal = Number(searchParams.get('finalTotal') || 0);

  // Vaciamos el carrito de forma segura SOLO al montar este componente final
  useEffect(() => {
    if (hasHydrated) {
      clearCart();
    }
  }, [hasHydrated, clearCart]);

  // Esperamos que Zustand termine de hidratarse de forma segura
  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-[#F5F2EB] flex flex-col items-center justify-center text-center">
        <div className="text-[#B57C38] animate-spin mb-4">
          <DecorarteIsotype size={40} />
        </div>
        <span className="text-xs font-black uppercase text-stone-500 tracking-widest">Verificando orden en el taller...</span>
      </div>
    );
  }

  // Función utilitaria nativa de front para copiar datos al portapapeles
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(`¡${label} copiado con éxito!`);
  };

  return (
    <main className="min-h-screen bg-[#F5F2EB] pt-36 pb-20 px-4 flex items-center justify-center">
      <GameStyles />
      
      <div className="max-w-xl w-full bg-white rounded-2xl border-2 border-stone-200 p-6 md:p-10 shadow-sm space-y-8">
        
        {/* Encabezado Exitoso */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 font-bold mb-2">
            ✓
          </div>
          <h1 className="text-xl md:text-2xl font-black text-[#1C1816] uppercase tracking-tight">
            ¡Orden Recibida en el Taller!
          </h1>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Reservamos tus piezas en nuestro catálogo de fabricación. Tu pedido quedará activo apenas verifiquemos la transferencia.
          </p>
        </div>

        {/* Monto Final con Descuento (Leído directamente de la URL de forma inmutable) */}
        <div className="bg-[#FCF9F5] p-4 rounded-xl border border-stone-200 text-center">
          <span className="text-[10px] text-stone-400 uppercase tracking-widest font-black block mb-1">
            Monto Neto a Transferir (10% OFF Aplicado)
          </span>
          <span className="text-2xl font-black text-emerald-700">
            ${finalTotal.toLocaleString('es-AR')}
          </span>
        </div>

        {/* DATOS BANCARIOS CON COPIADO RÁPIDO */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-stone-400 uppercase tracking-widest pl-1">Datos de la Cuenta</h3>
          
          <div className="bg-stone-50 border border-stone-200 rounded-xl divide-y divide-stone-200 text-xs">
            {/* Banco */}
            <div className="p-4 flex justify-between items-center">
              <div>
                <span className="text-stone-400 block text-[10px] uppercase tracking-wider">Banco</span>
                <span className="font-bold text-stone-800">Banco Galicia</span>
              </div>
            </div>

            {/* CBU */}
            <div className="p-4 flex justify-between items-center gap-4">
              <div>
                <span className="text-stone-400 block text-[10px] uppercase tracking-wider">CBU</span>
                <span className="font-mono font-bold text-stone-800 break-all">0070123420000012345678</span>
              </div>
              <button 
                onClick={() => handleCopy('0070123420000012345678', 'CBU')}
                className="shrink-0 text-[10px] font-black uppercase text-[#B57C38] hover:underline focus:outline-none"
              >
                Copiar
              </button>
            </div>

            {/* Alias */}
            <div className="p-4 flex justify-between items-center gap-4">
              <div>
                <span className="text-stone-400 block text-[10px] uppercase tracking-wider">Alias</span>
                <span className="font-bold text-stone-800">decorarte.taller.mp</span>
              </div>
              <button 
                onClick={() => handleCopy('decorarte.taller.mp', 'Alias')}
                className="shrink-0 text-[10px] font-black uppercase text-[#B57C38] hover:underline focus:outline-none"
              >
                Copiar
              </button>
            </div>

            {/* Titular */}
            <div className="p-4 flex justify-between items-center">
              <div>
                <span className="text-stone-400 block text-[10px] uppercase tracking-wider">Titular de la Cuenta</span>
                <span className="font-bold text-stone-800">DecorArte S.H. (Marta Gomez)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Próximos pasos informativos */}
        <div className="bg-[#E2DCD0]/40 p-5 rounded-xl border border-stone-300 space-y-2">
          <h4 className="text-xs font-black text-[#1C1816] uppercase tracking-wider flex items-center gap-1.5">
            📢 ¿Qué hago ahora?
          </h4>
          <ol className="text-[11px] text-stone-600 space-y-1 list-decimal list-inside leading-relaxed">
            <li>Realizá la transferencia desde tu Homebanking o billetera virtual.</li>
            <li>Enviá el comprobante de pago por WhatsApp indicando tu nombre.</li>
            <li>¡Listo! Te notificaremos cuando las maderas ingresen a la mesa de producción.</li>
          </ol>
        </div>

        {/* Acciones Finales */}
        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <a 
            href="https://wa.me/5493512345678?text=Hola%20DecorArte!%20Acabo%20de%20hacer%20la%20transferencia%20de%20mi%20pedido."
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center bg-[#25D366] hover:bg-[#20ba59] text-white py-3.5 rounded-xl font-bold uppercase text-xs tracking-wider transition-colors shadow-xs"
          >
            💬 Enviar Comprobante
          </a>
          <Link 
            href="/"
            className="flex-1 text-center border-2 border-[#1C1816] bg-white text-[#1C1816] hover:bg-[#1C1816] hover:text-white py-3 rounded-xl font-bold uppercase text-xs tracking-wider transition-all"
          >
            Volver al Inicio
          </Link>
        </div>

      </div>
    </main>
  );
}

// 2. Exportamos por defecto la página envuelta en un Suspense Boundary para cumplir con Next.js en producción
export default function SuccessTransferPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F5F2EB] flex flex-col items-center justify-center text-center">
        <div className="text-[#B57C38] animate-spin mb-4">
          <DecorarteIsotype size={40} />
        </div>
        <span className="text-xs font-black uppercase text-stone-500 tracking-widest">Sincronizando con el taller...</span>
      </div>
    }>
      <SuccessTransferContent />
    </Suspense>
  );
}