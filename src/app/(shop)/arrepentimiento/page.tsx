// src/app/(shop)/arrepentimiento/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ArrepentimientoPage() {
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setOrderId('');
    setSubmitted(false);
  };

  return (
    <main className="min-h-screen bg-[#F5F2EB] pt-36 pb-20 px-4 md:px-8 font-sans text-stone-900">
      <div className="max-w-2xl mx-auto bg-white p-8 md:p-12 rounded-3xl border-2 border-stone-200 shadow-xs space-y-6">
        
        <div className="border-b pb-4 border-stone-100">
          <span className="text-[10px] text-amber-700 uppercase tracking-widest font-black">Ley 24.240 - Art. 34</span>
          <h1 className="text-2xl font-black uppercase tracking-tight text-[#1C1816] mt-1">
            Botón de Arrepentimiento
          </h1>
        </div>
        
        {!submitted ? (
          <>
            <p className="text-xs md:text-sm text-stone-600 font-medium leading-relaxed">
              Conforme a las normativas vigentes, tenés derecho a revocar la aceptación de tu compra dentro de los <strong className="text-stone-900">10 (diez) días corridos</strong> contados a partir de la fecha de entrega del producto.
            </p>

            <form className="space-y-4 pt-2" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-black text-stone-700 uppercase mb-1">Número de Orden o Pedido *</label>
                <input 
                  required 
                  type="text" 
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Ej: #123456" 
                  className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 bg-[#FCF9F5] text-sm font-medium focus:outline-none focus:border-stone-900" 
                />
              </div>
              <div>
                <label className="block text-xs font-black text-stone-700 uppercase mb-1">Email Asociado a la Compra *</label>
                <input 
                  required 
                  type="email" 
                  placeholder="tu@email.com" 
                  className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 bg-[#FCF9F5] text-sm font-medium focus:outline-none focus:border-stone-900" 
                />
              </div>
              <div>
                <label className="block text-xs font-black text-stone-700 uppercase mb-1">Motivo (Opcional)</label>
                <textarea 
                  rows={3} 
                  placeholder="Contanos brevemente el motivo..." 
                  className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 bg-[#FCF9F5] text-sm font-medium focus:outline-none focus:border-stone-900 resize-none" 
                />
              </div>
              <button 
                type="submit" 
                className="w-full py-4 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-sm"
              >
                Enviar Solicitud de Revocación
              </button>
            </form>
          </>
        ) : (
          <div className="py-6 text-center space-y-6">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto text-xl font-bold shadow-xs">
              ✓
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-black uppercase text-[#1C1816]">Solicitud Registrada con Éxito</h3>
              <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed font-medium">
                Hemos registrado correctamente el pedido <span className="font-bold text-stone-900">{orderId}</span>. Nos pondremos en contacto a la brevedad por correo electrónico para coordinar los detalles de la devolución y el retiro.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
              <Link
                href="/"
                className="px-6 py-3.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all text-center"
              >
                Volver al Inicio
              </Link>
              <button
                onClick={handleReset}
                className="px-6 py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-black uppercase tracking-widest transition-all text-center"
              >
                Nueva consulta
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}