'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { GameStyles } from '@/app/components/iconos/DecorArteBrand';

// Esta página procesa la llegada genérica a /checkout/orders.
// Si hay un query param '?id=XXXX', redirigimos automáticamente a /checkout/orders/XXXX.
// Si no hay, muestra una linda pantalla de confirmación estática que nunca romperá el build.
function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('id');

  useEffect(() => {
    if (orderId) {
      // Redirigimos de forma segura a la ruta dinámica
      router.push(`/checkout/orders/${orderId}`);
    }
  }, [orderId, router]);

  return (
    <main className="min-h-screen bg-[#F5F2EB] pt-36 pb-20 px-4 md:px-8 flex items-center justify-center">
      <GameStyles />
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border-2 border-stone-200 shadow-sm text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-200">
          <span className="text-2xl text-emerald-600">✓</span>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-xl font-black text-[#1C1816] uppercase tracking-tight">
            ¡Tu pedido fue recibido!
          </h1>
          <p className="text-xs text-stone-500">
            Estamos procesando los detalles de tu compra. Si no fuiste redirigido automáticamente, podés volver al inicio.
          </p>
        </div>

        <Link 
          href="/"
          className="block w-full text-center bg-[#1C1816] hover:bg-[#B57C38] text-[#FFC107] hover:text-white py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
        >
          Volver a la Tienda
        </Link>
      </div>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F5F2EB] flex items-center justify-center">
        <p className="text-xs font-bold text-stone-500 uppercase tracking-widest">Cargando...</p>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}