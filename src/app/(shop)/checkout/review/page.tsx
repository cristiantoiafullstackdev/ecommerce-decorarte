//src/app/(shop)/checkout/review/page.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCartStore } from '@/store/cart/cart-store';
import { DecorarteIsotype, GameStyles } from '@/app/components/iconos/DecorArteBrand';
import { PaymentMethod, PaymentMethodSelector } from '@/app/components/ui/checkout/PaymentMethodSelector';
import { createOrder } from '@/actions/order-actions';

export default function ReviewPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const cart = useCartStore((state) => state.cart);
  const address = useCartStore((state) => state.address);
  const hasHydrated = useCartStore((state) => state._hasHydrated);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const subTotal = useCartStore((state) => state.getSubTotal());

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mercadopago');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeCart = hasHydrated ? cart : [];
  const activeSubTotal = hasHydrated ? subTotal : 0;

  const shippingCost = activeSubTotal > 0 
    ? (address?.province === 'cordoba' ? 4500 : 8500) 
    : 0;
    
  const discount = paymentMethod === 'transferencia' ? Math.round(activeSubTotal * 0.10) : 0;
  const finalTotal = activeSubTotal + shippingCost - discount;

  const handlePlaceOrder = async () => {
    if (!address) return;
    
    setIsPlacingOrder(true);
    setErrorMessage(null);

    const userId = session?.user?.id;
    if (!userId) {
      setErrorMessage("Tu sesión caducó o no estás autenticado. Por favor, iniciá sesión nuevamente.");
      setIsPlacingOrder(false);
      return;
    }

    const itemsInput = activeCart.map(item => ({
      productId: item.id,
      quantity: item.quantity,
      price: item.price
    }));

    try {
      const response = await createOrder({
        userId: userId,
        firstName: address.firstName,
        lastName: address.lastName,
        email: address.email,
        phone: address.phone,
        address: address.address,
        city: address.city,
        province: address.province,
        zipCode: address.zipCode,
        notes: address.notes || undefined,
        paymentMethod: paymentMethod,
        items: itemsInput
      });

      if (!response.ok) {
        setErrorMessage(response.message);
        setIsPlacingOrder(false);
        return;
      }

      if (paymentMethod === 'transferencia') {
        router.push(`/checkout/success-transfer?orderId=${response.orderId}&finalTotal=${finalTotal}`);
      } else {
        router.push(`/checkout/payment?orderId=${response.orderId}&finalTotal=${finalTotal}`);
      }

    } catch (error) {
      console.error("Error en taller:", error);
      setErrorMessage("Ocurrió un error inesperado al procesar tu compra. Reintentá en unos momentos.");
      setIsPlacingOrder(false);
    }
  };

  if (status === "loading" || !hasHydrated) {
    return (
      <div className="min-h-screen bg-[#F5F2EB] flex flex-col items-center justify-center text-center">
        <div className="text-[#B57C38] animate-spin mb-4">
          <DecorarteIsotype size={40} />
        </div>
        <span className="text-xs font-black uppercase text-stone-500 tracking-widest">Sincronizando con el taller...</span>
      </div>
    );
  }

  if (hasHydrated && (!address || activeCart.length === 0)) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 pt-32 bg-[#F5F2EB]">
        <div className="text-stone-400 mb-6">
          <DecorarteIsotype size={80} />
        </div>
        <h1 className="text-2xl font-black text-[#1C1816] uppercase tracking-wider">Faltan datos de la orden</h1>
        <p className="text-sm text-stone-600 mt-2 max-w-sm">No encontramos información de despacho o productos activos para revisar.</p>
        <Link href="/checkout" className="mt-8 border-2 border-[#1C1816] bg-[#1C1816] text-[#FFC107] px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#B57C38] transition-all shadow-[0_4px_0px_#B57C38]">
          Volver al Formulario
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F2EB] pt-36 pb-20 px-4 md:px-8">
      <GameStyles />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* COLUMNA IZQUIERDA: Formularios y Selectores */}
        <div className="lg:col-span-7 space-y-8">
          
        {errorMessage && (
            <div className="bg-red-50 border-2 border-red-200 text-red-800 rounded-xl p-5 space-y-3 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider">
                <span>⚠️ Atención en el Taller</span>
              </div>
              <p className="text-xs font-medium leading-relaxed">{errorMessage}</p>
              
              {errorMessage.includes("pendiente de pago") && (
                <div className="pt-2">
                  <Link 
                    href="/orders" 
                    className="inline-block bg-[#1C1816] text-[#FFC107] px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-[#B57C38] hover:text-white transition-all"
                  >
                    Ir a Mis Compras a Resolver el Pago →
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Bloque Informativo: Resumen de Envío */}
          <div className="bg-white p-6 md:p-10 rounded-2xl border-2 border-stone-200 shadow-sm space-y-6">
            <div>
              <span className="text-[10px] text-[#B57C38] uppercase tracking-widest font-black bg-[#E2DCD0] px-2.5 py-1 rounded-md">Paso 2 de 2</span>
              <h1 className="text-xl md:text-2xl font-black text-[#1C1816] uppercase tracking-tight mt-3">Verificá tu Orden</h1>
              <p className="text-xs text-stone-500 mt-1">Revisá que la información de despacho sea la correcta.</p>
            </div>

            <div className="border-t border-stone-200 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xs font-black text-stone-400 uppercase tracking-widest mb-1">Destinatario</h3>
                <p className="text-sm font-bold text-[#1C1816]">{address?.firstName ?? ''} {address?.lastName ?? ''}</p>
                <p className="text-xs text-stone-600">{address?.email ?? ''} | Tel: {address?.phone ?? ''}</p>
              </div>
              <div>
                <h3 className="text-xs font-black text-stone-400 uppercase tracking-widest mb-1">Despacho Logístico</h3>
                <p className="text-sm font-medium text-stone-800">{address?.address ?? ''}</p>
                <p className="text-xs text-stone-600">
                  {address?.city ?? ''}, {address?.province === 'cordoba' ? 'Córdoba' : (address?.province ?? '').toUpperCase()} (CP: {address?.zipCode ?? ''})
                </p>
              </div>
            </div>

            {address?.notes && (
              <div className="bg-[#FCF9F5] p-4 rounded-xl border border-stone-200 text-xs text-stone-600">
                <span className="block font-black text-[#B57C38] uppercase tracking-wider mb-1">Notas para el Taller:</span>
                <p className="italic">&quot;{address.notes}&quot;</p>
              </div>
            )}

            <div className="border-t border-stone-150 pt-4">
              <Link href="/checkout" className="text-xs font-bold text-[#B57C38] hover:underline uppercase tracking-wider">✏️ Modificar datos de envío</Link>
            </div>
          </div>

          <PaymentMethodSelector 
            selectedMethod={paymentMethod} 
            onMethodChange={setPaymentMethod} 
          />
        </div>

        {/* COLUMNA DERECHA: Totales de compra y Botón de Acción */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#E2DCD0] p-6 rounded-2xl border-2 border-stone-300 flex flex-col justify-between shadow-xs">
            <div>
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-[#1C1816] pb-4 border-b border-stone-300">Productos a Fabricar</h2>
              <div className="divide-y divide-stone-300 max-h-60 overflow-y-auto pr-2 scrollbar-none my-4">
                {activeCart.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-stone-300 bg-white shrink-0">
                        {item.image ? (
                          <Image src={item.image} alt={item.title} fill sizes="48px" className="object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-stone-400">
                            <DecorarteIsotype size={20} />
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-stone-900 line-clamp-1">{item.title}</h4>
                        <p className="text-[10px] text-stone-500 font-bold">Cantidad: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-[#1C1816]">${(item.price * item.quantity).toLocaleString('es-AR')}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t-2 border-stone-300 pt-4 space-y-2.5 text-xs font-semibold text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal ({totalItems} piezas)</span>
                <span className="font-bold text-[#1C1816]">${activeSubTotal.toLocaleString('es-AR')}</span>
              </div>
              <div className="flex justify-between">
                <span>Costo de Envío</span>
                <span className="font-bold text-[#1C1816]">${shippingCost.toLocaleString('es-AR')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200 font-bold text-[11px]">
                  <span>Beneficio 10% Transferencia</span>
                  <span>-${discount.toLocaleString('es-AR')}</span>
                </div>
              )}
              <div className="border-t border-stone-300 pt-3 flex justify-between text-base font-black text-[#1C1816]">
                <span>Total Final</span>
                <span className="text-xl font-black text-[#B57C38]">${finalTotal.toLocaleString('es-AR')}</span>
              </div>
            </div>
          </div>

          <button 
            onClick={handlePlaceOrder} 
            disabled={isPlacingOrder}
            className="w-full game-bounce bg-[#B57C38] hover:bg-[#1C1816] text-white hover:text-[#FFC107] py-4 rounded-xl font-bold uppercase text-xs tracking-[0.2em] transition-all border-2 border-[#B57C38] hover:border-[#1C1816] shadow-[0_4px_0px_#1C1816] active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPlacingOrder ? (
              "Procesando Orden..."
            ) : (
              paymentMethod === 'transferencia' ? 'Confirmar Orden Especial' : 'Pagar con Mercado Pago'
            )}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </button>
        </div>

      </div>
    </main>
  );
}