"use client";

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { GameStyles } from '@/app/components/iconos/DecorArteBrand';

// 1. Separamos el contenido que consume useSearchParams en un componente interno
function OrderSuccessContent() {
  const searchParams = useSearchParams();
  
  // Recuperamos el ID de la orden real devuelto por tu Backend Neon
  const orderId = searchParams.get('orderId') || 'DA-XXXXX';
  const paymentMethod = searchParams.get('method') || 'mercadopago';

  return (
    <main className="min-h-screen bg-[#F5F2EB] pt-36 pb-20 px-4 flex items-center justify-center">
      <GameStyles />
      
      <div className="max-w-xl w-full bg-white p-8 md:p-12 rounded-2xl border-2 border-stone-200 shadow-sm text-center space-y-8">
        
        {/* Isotipo animado de éxito */}
        <div className="mx-auto w-16 h-16 bg-[#E2DCD0] rounded-full flex items-center justify-center text-[#B57C38] border border-stone-300">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>

        {/* Encabezado informativo */}
        <div className="space-y-2">
          <span className="text-[10px] text-[#B57C38] uppercase tracking-widest font-black bg-[#E2DCD0] px-3 py-1 rounded-md">
            ¡Orden Recibida!
          </span>
          <h1 className="text-2xl font-black text-[#1C1816] uppercase tracking-wider pt-2">
            Tu pedido está en taller
          </h1>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Gracias por elegir DecorArte. Nuestros artesanos ya tienen la notificación para empezar a preparar tus piezas.
          </p>
        </div>

        {/* Recuadro del ID de Orden (Neon DB ID) */}
        <div className="bg-[#FCF9F5] p-4 rounded-xl border-2 border-dashed border-stone-300 inline-block px-6">
          <span className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">
            Código de Seguimiento
          </span>
          <span className="text-sm font-mono font-black text-[#1C1816]">
            {orderId}
          </span>
        </div>

        {/* Contenido Dinámico según Método de Pago */}
        {paymentMethod === 'transferencia' ? (
          <div className="bg-[#Fdfaf2] border-2 border-[#B57C38]/20 rounded-xl p-5 text-left space-y-3">
            <h4 className="text-xs font-black text-[#B57C38] uppercase tracking-wider flex items-center gap-1.5">
              🏛️ Datos de Transferencia Bancaria
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Para que empecemos la fabricación, por favor realiza el depósito neto del total con el 10% de descuento ya aplicado y envía el comprobante.
            </p>
            <div className="pt-2 space-y-1 text-xs font-medium text-stone-800 border-t border-stone-200">
              <p><span className="font-bold text-stone-400">Banco:</span> Galicia</p>
              <p><span className="font-bold text-stone-400">Alias:</span> decorarte.taller.cba</p>
              <p><span className="font-bold text-stone-400">CBU:</span> 0070000000000000000000</p>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-left flex items-start gap-3">
            <span className="text-emerald-700 text-base">💳</span>
            <div>
              <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                Acreditación Inmediata
              </h4>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                Mercado Pago validó tu transacción correctamente. Te enviamos el detalle y la factura digital a tu correo.
              </p>
            </div>
          </div>
        )}

        {/* Botonera de Salida */}
        <div className="border-t border-stone-200 pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/" 
            className="w-full sm:w-auto text-center border-2 border-[#1C1816] bg-[#1C1816] text-[#FFC107] px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#B57C38] hover:border-[#B57C38] hover:text-white transition-all shadow-[0_4px_0px_#B57C38] active:translate-y-0.5 active:shadow-none"
          >
            Seguir Comprando
          </Link>
        </div>

      </div>
    </main>
  );
}

// 2. Exportamos por defecto el componente principal envuelto en un Suspense Boundary
export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F5F2EB] flex flex-col items-center justify-center text-center">
        <span className="text-xs font-black uppercase text-stone-500 tracking-widest">Cargando orden del taller...</span>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
} 