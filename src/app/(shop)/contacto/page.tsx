// src/app/(shop)/contacto/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setFormData({ name: '', email: '', message: '' });
    setSubmitted(false);
  };

  return (
    <main className="min-h-screen bg-[#F5F2EB] pt-32 pb-20 px-4 sm:px-6 md:px-8 font-sans text-stone-900">
      <div className="max-w-3xl mx-auto space-y-8 md:space-y-10">
        
        <div className="text-center space-y-3">
          <span className="text-[10px] text-[#B57C38] uppercase tracking-[0.2em] font-black bg-[#E2DCD0] px-2.5 py-1 rounded-md">
            Canales Oficiales
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#1C1816]">
            Contacto &amp; Asesoramiento
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto font-medium px-2 leading-relaxed">
            ¿Tenés dudas sobre medidas personalizadas, envíos a todo el país o querés consultar por un proyecto a medida? Escribinos.
          </p>
        </div>

        {/* Tarjeta de Acceso Directo a WhatsApp */}
        <div className="bg-[#1C1816] text-[#FFF9F2] p-6 sm:p-8 rounded-2xl sm:rounded-3xl border-2 border-stone-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left min-w-0">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#FFC107]">Atención Inmediata</span>
            <h3 className="text-base sm:text-lg font-black uppercase">Canal Directo por WhatsApp</h3>
            <p className="text-xs text-stone-400">Respondemos consultas de taller de lunes a viernes.</p>
          </div>
          <a
            href="https://wa.me/5493510000000?text=Hola%20DecorArte!%20Quiero%20consultar%20sobre%20un%20proyecto." 
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto text-center px-6 py-3.5 bg-[#B57C38] hover:bg-[#96632B] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm shrink-0"
          >
            Abrir WhatsApp &rarr;
          </a>
        </div>

        {/* Formulario de Contacto o Pantalla de Éxito */}
        <div className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl border-2 border-stone-200 shadow-sm space-y-6">
          {!submitted ? (
            <>
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#1C1816] border-b pb-3 border-stone-100">
                Formulario de Consulta General
              </h3>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-stone-700 uppercase mb-1">Nombre *</label>
                    <input 
                      required 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 bg-[#FCF9F5] text-sm font-medium focus:outline-none focus:border-stone-900" 
                      placeholder="Tu nombre" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-stone-700 uppercase mb-1">Email *</label>
                    <input 
                      required 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 bg-[#FCF9F5] text-sm font-medium focus:outline-none focus:border-stone-900 break-all" 
                      placeholder="tu@email.com" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-stone-700 uppercase mb-1">Mensaje o Detalle del Proyecto *</label>
                  <textarea 
                    required 
                    rows={4} 
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 bg-[#FCF9F5] text-sm font-medium focus:outline-none focus:border-stone-900 resize-none" 
                    placeholder="Contanos qué estás buscando..." 
                  />
                </div>
                <button type="submit" className="w-full py-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-sm">
                  Enviar Mensaje
                </button>
              </form>
            </>
          ) : (
            <div className="py-6 sm:py-8 text-center space-y-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto text-2xl font-bold border border-emerald-200">
                ✓
              </div>
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-black uppercase text-[#1C1816]">¡Mensaje enviado con éxito!</h3>
                <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
                  Gracias por contactarte con DecorArte. Hemos registrado tu consulta y te responderemos a la brevedad a <span className="font-bold text-stone-900 break-all">{formData.email}</span>.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
                <Link
                  href="/"
                  className="w-full sm:w-auto px-6 py-3.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all text-center"
                >
                  Volver al Catálogo
                </Link>
                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto px-6 py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-black uppercase tracking-widest transition-all text-center"
                >
                  Enviar otra consulta
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}