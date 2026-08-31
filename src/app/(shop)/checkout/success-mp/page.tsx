//src/app/(shop)/checkout/success-mp/page.tsx
"use client";

import React, { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCartStore } from '@/store/cart/cart-store';
import { DecorarteIsotype, GameStyles } from '@/app/components/iconos/DecorArteBrand';

function SuccessMpContent() {
  const searchParams = useSearchParams();
  const hasHydrated = useCartStore((state) => state._hasHydrated);
  const clearCart = useCartStore((state) => state.clearCart || (() => {}));

  const paymentId = searchParams.get('payment_id') || 'N/A';
  const orderId = searchParams.get('external_reference') || 'DA-XXXXX';

  useEffect(() => {
    if (hasHydrated) {
      clearCart();
    }
  }, [hasHydrated, clearCart]);

  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-[#F5F2EB] flex flex-col items-center justify-center text-center px-4">
        <div className="text-[#B57C38] animate-spin mb-4">
          <DecorarteIsotype size={40} />
        </div>
        <span className="text-xs font-black uppercase text-stone-500 tracking-widest">Sincronizando con el taller...</span>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F2EB] pt-32 pb-20 px-4 sm:px-6 flex items-center justify-center">
      <GameStyles />
      
      <div className="max-w-xl w-full bg-white rounded-2xl border-2 border-stone-200 p-6 sm:p-8 md:p-12 shadow-sm text-center space-y-6 sm:space-y-8">
        
        <div className="mx-auto w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 border border-emerald-200 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
          </svg>
        </div>

        <div className="space-y-2">
          <span className="text-[10px] text-emerald-700 uppercase tracking-widest font-black bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-md inline-block">
            ¡Pago Aprobado con Éxito!
          </span>
          <h1 className="text-xl md:text-2xl font-black text-[#1C1816] uppercase tracking-wider pt-2">
            Tu Orden entró a Producción
          </h1>
          <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
            Mercado Pago acreditó tu pago instantáneamente. Nuestros carpinteros y herreros ya tienen los planos para fabricar tus piezas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#FCF9F5] p-4 rounded-xl border border-stone-200 text-center overflow-hidden">
            <span className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">
              ID de Transacción MP
            </span>
            <span className="text-xs font-mono font-bold text-stone-700 break-all">
              {paymentId}
            </span>
          </div>

          <div className="bg-[#FCF9F5] p-4 rounded-xl border-2 border-dashed border-stone-300 text-center overflow-hidden">
            <span className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">
              Código de Seguimiento
            </span>
            <span className="text-xs font-mono font-black text-[#1C1816] select-all break-all">
              {orderId}
            </span>
          </div>
        </div>

        <div className="bg-[#E2DCD0]/40 p-4 sm:p-5 rounded-xl border border-stone-300 space-y-1 text-left">
          <h4 className="text-xs font-black text-[#1C1816] uppercase tracking-wider flex items-center gap-1.5">
            📦 ¿Cómo sigue mi pedido?
          </h4>
          <p className="text-[11px] text-stone-600 leading-relaxed">
            Te enviamos una confirmación por correo electrónico. Cuando tus piezas finalicen la etapa de pintura y ensamble en nuestro taller, el transportista te contactará para coordinar el despacho.
          </p>
        </div>

        <div className="border-t border-stone-200 pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href={`/checkout/orders/${orderId}`} 
            className="w-full sm:flex-1 text-center border-2 border-[#1C1816] bg-white text-[#1C1816] hover:bg-stone-50 py-3.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-colors"
          >
            🔍 Ver Detalles de Orden
          </Link>
          <Link 
            href="/" 
            className="w-full sm:flex-1 text-center border-2 border-[#1C1816] bg-[#1C1816] text-[#FFC107] py-3.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-[#B57C38] hover:border-[#B57C38] hover:text-white transition-all shadow-[0_4px_0px_#B57C38] active:translate-y-0.5 active:shadow-none"
          >
            Volver al Catálogo
          </Link>
        </div>

      </div>
    </main>
  );
}

export default function SuccessMpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F5F2EB] flex flex-col items-center justify-center text-center px-4">
        <div className="text-[#B57C38] animate-spin mb-4">
          <DecorarteIsotype size={40} />
        </div>
        <span className="text-xs font-black uppercase text-stone-500 tracking-widest">Sincronizando con el taller...</span>
      </div>
    }>
      <SuccessMpContent />
    </Suspense>
  );
}