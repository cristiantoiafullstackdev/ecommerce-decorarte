// src/app/auth/register/page.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/actions/registerUsers-actions';
import { DecorarteIsotype, GameStyles } from '@/app/components/iconos/DecorArteBrand';

export default function RegisterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const result = await registerUser(formData);

    if (!result.ok) {
      setErrorMessage(result.message);
      setIsSubmitting(false);
      return;
    }

    setSuccessMessage(result.message);
    
    // Esperamos 2 segundos para que el usuario lea el éxito y lo mandamos al login
    setTimeout(() => {
      router.push('/auth/login');
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-[#F5F2EB] flex items-center justify-center pt-28 pb-12 px-4">
      <GameStyles />
      
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border-2 border-stone-200 shadow-sm space-y-6">
        <div className="text-center flex flex-col items-center">
          <div className="text-[#1C1816] mb-3">
            <DecorarteIsotype size={45} />
          </div>
          <h1 className="text-xl font-black text-[#1C1816] uppercase tracking-tight">
            Crear Cuenta en DecorArte
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Registrate para gestionar tus órdenes y coordinar tus envíos.
          </p>
        </div>

        {/* Feedback de Estado */}
        {errorMessage && (
          <div className="bg-red-50 border-2 border-red-200 text-red-800 rounded-xl p-3.5 text-xs font-bold uppercase tracking-wider">
            ⚠️ {errorMessage}
          </div>
        )}
        
        {successMessage && (
          <div className="bg-emerald-50 border-2 border-emerald-200 text-emerald-800 rounded-xl p-3.5 text-xs font-bold uppercase tracking-wider">
            ✅ {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-2">Nombre Completo</label>
            <input required disabled={isSubmitting} id="name" type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Ej: Juan Pérez" className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-[#1C1816] bg-[#FCF9F5] text-sm text-stone-800 font-medium focus:outline-none transition-colors disabled:opacity-50" />
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-2">Correo Electrónico</label>
            <input required disabled={isSubmitting} id="email" type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="juan@ejemplo.com" className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-[#1C1816] bg-[#FCF9F5] text-sm text-stone-800 font-medium focus:outline-none transition-colors disabled:opacity-50" />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-2">Contraseña (Mín. 6 caracteres)</label>
            <input required disabled={isSubmitting} id="password" type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-[#1C1816] bg-[#FCF9F5] text-sm text-stone-800 font-medium focus:outline-none transition-colors disabled:opacity-50" />
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#1C1816] hover:bg-[#B57C38] text-[#FFC107] hover:text-white py-3.5 rounded-xl font-bold uppercase text-xs tracking-[0.2em] transition-all duration-150 border-2 border-[#1C1816] shadow-[0_4px_0px_#B57C38] active:translate-y-1 active:shadow-none focus:outline-none disabled:opacity-50"
          >
            {isSubmitting ? "Registrando..." : "Registrarse en el Taller"}
          </button>
        </form>

        <div className="border-t border-stone-200 pt-4 text-center">
          <p className="text-xs text-stone-500">
            ¿Ya tenés una cuenta activa?{" "}
            <Link href="/auth/login" className="font-bold text-[#B57C38] hover:text-[#1C1816] uppercase tracking-wider transition-colors">
              Iniciar Sesión
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}