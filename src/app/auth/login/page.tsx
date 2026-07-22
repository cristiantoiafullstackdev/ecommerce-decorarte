// src/app/auth/login/page.tsx
"use client";

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { DecorarteIsotype, GameStyles } from '@/app/components/iconos/DecorArteBrand';

// 1. Creamos el componente interno que consume los parámetros de la URL
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Si el middleware rebotó al usuario del checkout, capturamos a dónde iba
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const result = await signIn('credentials', {
      redirect: false,
      email: formData.email.toLowerCase(),
      password: formData.password,
    });

    if (result?.error) {
      setErrorMessage("Credenciales incorrectas. Verificá tu correo y contraseña.");
      setIsSubmitting(false);
      return;
    }

    // Si hay una callbackUrl explícita (ej. intentó entrar al checkout), la respetamos.
    // Si no, redirigimos dinámicamente según su rol consultando la sesión o una ruta inteligente.
    if (callbackUrl !== '/') {
      router.push(callbackUrl);
    } else {
      // Redirección escalable por roles
      // (Podemos verificar el rol o mandar a una ruta central que decida)
      router.push('/'); // O una ruta de redirección por roles
    }
    
    router.refresh();
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl border-2 border-stone-200 shadow-sm space-y-6">
      <div className="text-center flex flex-col items-center">
        <div className="text-[#1C1816] mb-3">
          <DecorarteIsotype size={45} />
        </div>
        <h1 className="text-xl font-black text-[#1C1816] uppercase tracking-tight">
          Ingresar al Taller
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Iniciá sesión para continuar con tu compra en DecorArte.
        </p>
      </div>

      {/* Alerta de Error */}
      {errorMessage && (
        <div className="bg-red-50 border-2 border-red-200 text-red-800 rounded-xl p-3.5 text-xs font-bold uppercase tracking-wider">
          ⚠️ {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-2">Correo Electrónico</label>
          <input required disabled={isSubmitting} id="email" type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="juan@ejemplo.com" className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-[#1C1816] bg-[#FCF9F5] text-sm text-stone-800 font-medium focus:outline-none transition-colors disabled:opacity-50" />
        </div>

        <div>
          <label htmlFor="password" className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-2">Contraseña</label>
          <input required disabled={isSubmitting} id="password" type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-[#1C1816] bg-[#FCF9F5] text-sm text-stone-800 font-medium focus:outline-none transition-colors disabled:opacity-50" />
        </div>

        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#1C1816] hover:bg-[#B57C38] text-[#FFC107] hover:text-white py-3.5 rounded-xl font-bold uppercase text-xs tracking-[0.2em] transition-all duration-150 border-2 border-[#1C1816] shadow-[0_4px_0px_#B57C38] active:translate-y-1 active:shadow-none focus:outline-none disabled:opacity-50"
        >
          {isSubmitting ? "Autenticando..." : "Iniciar Sesión"}
        </button>
      </form>

      <div className="border-t border-stone-200 pt-4 text-center">
        <p className="text-xs text-stone-500">
          ¿Sos nuevo en el taller?{" "}
          <Link href="/auth/register" className="font-bold text-[#B57C38] hover:text-[#1C1816] uppercase tracking-wider transition-colors">
            Crear una cuenta
          </Link>
        </p>
      </div>
    </div>
  );
}

// 2. El componente principal de la página envuelve al formulario en Suspense
export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#F5F2EB] flex items-center justify-center pt-28 pb-12 px-4">
      <GameStyles />
      <Suspense fallback={
        <div className="text-center text-xs font-black uppercase text-stone-500 tracking-widest">
          Cargando portal...
        </div>
      }>
        <LoginForm />
      </Suspense>
    </main>
  );
}