"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart/cart-store';
import { DecorarteIsotype, GameStyles } from '@/app/components/iconos/DecorArteBrand';

export default function CheckoutPage() {
  const router = useRouter();
  
  const cart = useCartStore((state) => state.cart);
  const hasHydrated = useCartStore((state) => state._hasHydrated);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const subTotal = useCartStore((state) => state.getSubTotal());
  const setAddress = useCartStore((state) => state.setShippingAddress); 
  const savedAddress = useCartStore((state) => state.address); 

  const [formData, setFormData] = useState({
    firstName: savedAddress?.firstName || '',
    lastName: savedAddress?.lastName || '',
    phone: savedAddress?.phone || '',
    email: savedAddress?.email || '',
    address: savedAddress?.address || '',
    city: savedAddress?.city || '',
    province: savedAddress?.province || 'cordoba',
    zipCode: savedAddress?.zipCode || '',
    notes: savedAddress?.notes || ''
  });

  const activeCart = hasHydrated ? cart : [];
  const activeTotalItems = hasHydrated ? totalItems : 0;
  const activeSubTotal = hasHydrated ? subTotal : 0;

  const shippingCost = activeSubTotal > 0 
    ? (formData.province === 'cordoba' ? 4500 : 8500) 
    : 0;
    
  const finalTotal = activeSubTotal + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    setAddress({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      province: formData.province,
      zipCode: formData.zipCode,
      notes: formData.notes || undefined
    });

    console.log("✅ Datos guardados con éxito en Zustand:", formData);
    router.push('/checkout/review');
  };

  if (hasHydrated && activeCart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 pt-32 bg-[#F5F2EB]">
        <div className="text-stone-400 mb-6 animate-bounce">
          <DecorarteIsotype size={80} />
        </div>
        <h1 className="text-2xl font-black text-[#1C1816] uppercase tracking-wider">No hay orden activa</h1>
        <p className="text-sm text-stone-600 mt-2 max-w-sm">
          Tu bolsa de compras está vacía en este momento. Necesitás sumar al menos una pieza artesanal para proceder al checkout.
        </p>
        <Link 
          href="/"
          className="mt-8 border-2 border-[#1C1816] bg-[#1C1816] text-[#FFC107] px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#B57C38] hover:border-[#B57C38] hover:text-white transition-all shadow-[0_4px_0px_#B57C38] active:translate-y-px active:shadow-none"
        >
          Explorar Catálogo
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F2EB] pt-36 pb-20 px-4 md:px-8">
      <GameStyles />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* COLUMNA IZQUIERDA: FORMULARIO DE ENVÍO */}
        <div className="lg:col-span-7 bg-white p-6 md:p-10 rounded-2xl border-2 border-stone-200 shadow-sm space-y-8">
          <div>
            <span className="text-[10px] text-[#B57C38] uppercase tracking-widest font-black bg-[#E2DCD0] px-2.5 py-1 rounded-md">
              Paso 1 de 2
            </span>
            <h1 className="text-xl md:text-2xl font-black text-[#1C1816] uppercase tracking-tight mt-3">
              Datos de Despacho y Contacto
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Por favor, completá los campos técnicos para coordinar la entrega o fabricación de tus piezas.
            </p>
          </div>

          <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor='firstName' className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-2">Nombre *</label>
              <input id='firstName' required type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-[#1C1816] bg-[#FCF9F5] text-sm text-stone-800 font-medium focus:outline-none transition-colors" />
            </div>

            <div>
              <label htmlFor='lastName' className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-2">Apellido *</label>
              <input id='lastName' required type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-[#1C1816] bg-[#FCF9F5] text-sm text-stone-800 font-medium focus:outline-none transition-colors" />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor='email' className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-2">Email de Contacto *</label>
              <input id='email' required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-[#1C1816] bg-[#FCF9F5] text-sm text-stone-800 font-medium focus:outline-none transition-colors" />
            </div>

            <div>
              <label htmlFor='phone' className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-2">Teléfono / WhatsApp *</label>
              <input id='phone' required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-[#1C1816] bg-[#FCF9F5] text-sm text-stone-800 font-medium focus:outline-none transition-colors" />
            </div>

            <div>
              <label htmlFor='zipCode' className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-2">Código Postal *</label>
              <input id='zipCode' required type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-[#1C1816] bg-[#FCF9F5] text-sm text-stone-800 font-medium focus:outline-none transition-colors" />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor='address' className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-2">Dirección Completa (Calle, Altura, Piso) *</label>
              <input id='address' required type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-[#1C1816] bg-[#FCF9F5] text-sm text-stone-800 font-medium focus:outline-none transition-colors" />
            </div>

            <div>
              <label htmlFor='city' className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-2">Localidad / Ciudad *</label>
              <input id='city' required type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-[#1C1816] bg-[#FCF9F5] text-sm text-stone-800 font-medium focus:outline-none transition-colors" />
            </div>

            <div>
              <label htmlFor='province' className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-2" >Provincia *</label>
              <select id='province' name="province" value={formData.province} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-[#1C1816] bg-[#FCF9F5] text-sm text-stone-800 font-bold focus:outline-none transition-colors h-12">
                <option value="cordoba">Córdoba (Envío Regional)</option>
                <option value="buenosaires">Buenos Aires</option>
                <option value="santafe">Santa Fe</option>
                <option value="mendoza">Mendoza</option>
                <option value="otra">Resto del País (Envío Nacional)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-2">Notas Especiales para el Taller (Opcional)</label>
              <textarea name="notes" rows={3} value={formData.notes} onChange={handleInputChange} placeholder="Ej: Horarios de entrega, especificaciones del color del hierro, etc." className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-[#1C1816] bg-[#FCF9F5] text-sm text-stone-800 font-medium focus:outline-none transition-colors resize-none" />
            </div>

            <button id="submit-checkout-form" type="submit" className="hidden" aria-label="Enviar formulario de checkout"/>
          </form>
        </div>

        {/* COLUMNA DERECHA: RESUMEN DE COMPRA */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#E2DCD0] p-6 rounded-2xl border-2 border-stone-300 flex flex-col justify-between shadow-xs">
            <div>
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-[#1C1816] pb-4 border-b border-stone-300">
                Resumen de la Orden
              </h2>
              
              <div className="divide-y divide-stone-300 max-h-60 overflow-y-auto pr-2 scrollbar-none my-4">
                {activeCart.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-stone-300 bg-white shrink-0">
                        {item.image ? (
                          <Image src={item.image} alt={item.title} fill sizes="48px" className="object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-stone-400"><DecorarteIsotype size={20} /></div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-stone-900 line-clamp-1">{item.title}</h4>
                        <p className="text-[10px] text-stone-500 font-bold">Cant: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-[#1C1816]">
                      ${(item.price * item.quantity).toLocaleString('es-AR')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t-2 border-stone-300 pt-4 space-y-2.5 text-xs font-semibold text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal ({activeTotalItems} piezas)</span>
                <span className="font-bold text-[#1C1816]">${activeSubTotal.toLocaleString('es-AR')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Costo de Envío Logístico</span>
                <span className="font-bold text-[#B57C38]">
                  {shippingCost === 0 ? "Gratis" : `$${shippingCost.toLocaleString('es-AR')}`}
                </span>
              </div>
              <div className="border-t border-stone-300 pt-3 flex justify-between text-base font-black text-[#1C1816]">
                <span>Total Final</span>
                <span className="text-xl font-black">${finalTotal.toLocaleString('es-AR')}</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => document.getElementById('submit-checkout-form')?.click()}
            className="w-full game-bounce bg-[#1C1816] hover:bg-[#B57C38] text-[#FFC107] hover:text-white py-4 rounded-xl font-bold uppercase text-xs tracking-[0.2em] transition-all duration-150 border-2 border-[#1C1816] shadow-[0_4px_0px_#B57C38] active:translate-y-1 active:shadow-none focus:outline-none flex items-center justify-center gap-2"
          >
            Continuar al Pago
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75 Governors A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
            </svg>
          </button>

          <Link 
            href="/"
            className="block text-center text-xs font-bold text-stone-500 hover:text-[#1C1816] uppercase tracking-wider transition-colors"
          >
            ← Modificar Bolsa de Compra
          </Link>
        </div>

      </div>
    </main>
  );
}