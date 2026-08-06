// src/app/auth/new-password/page.tsx
"use client";

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { resetPassword } from '@/actions/auth-actions'; // (O la ruta donde tengas tu Server Action)
import { DecorarteIsotype, GameStyles } from '@/app/components/iconos/DecorArteBrand';

// 1. Componente interno que consume useSearchParams
function NewPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      return;
    }

    if (!token) {
      setErrorMessage("Token de recuperación inválido o ausente.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await resetPassword(token, password);

      if (!result.ok) {
        setErrorMessage(result.message);
        setIsSubmitting(false);
        return;
      }

      setSuccessMessage("¡Contraseña actualizada con éxito! Redirigiendo al login...");
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch {
      setErrorMessage("Ocurrió un error inesperado. Inténtalo de nuevo.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl border-2 border-stone-200 shadow-sm space-y-6">
      <div className="text-center flex flex-col items-center">
        <div className="text-[#1C1816] mb-3">
          <DecorarteIsotype size={45} />
        </div>
        <h1 className="text-xl font-black text-[#1C1816] uppercase tracking-tight">
          Restablecer Contraseña
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Ingresa tu nueva clave para acceder a DecorArte.
        </p>
      </div>

      {errorMessage && (
        <div className="bg-red-50 border-2 border-red-200 text-red-800 rounded-xl p-3.5 text-xs font-bold uppercase tracking-wider">
          ⚠️ {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border-2 border-green-200 text-green-800 rounded-xl p-3.5 text-xs font-bold uppercase tracking-wider">
          ✅ {successMessage}
        </div>
      )}

      {!token ? (
        <div className="text-center text-red-600 text-xs font-bold uppercase">
          Token no proporcionado. Vuelve a solicitar la recuperación de contraseña.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-2">Nueva Contraseña</label>
            <input 
              required 
              disabled={isSubmitting} 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••" 
              className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-[#1C1816] bg-[#FCF9F5] text-sm text-stone-800 font-medium focus:outline-none transition-colors disabled:opacity-50" 
            />
          </div>

          <div>
            <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-2">Confirmar Contraseña</label>
            <input 
              required 
              disabled={isSubmitting} 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              placeholder="••••••••" 
              className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-[#1C1816] bg-[#FCF9F5] text-sm text-stone-800 font-medium focus:outline-none transition-colors disabled:opacity-50" 
            />
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#1C1816] hover:bg-[#B57C38] text-[#FFC107] hover:text-white py-3.5 rounded-xl font-bold uppercase text-xs tracking-[0.2em] transition-all duration-150 border-2 border-[#1C1816] shadow-[0_4px_0px_#B57C38] active:translate-y-1 active:shadow-none focus:outline-none disabled:opacity-50"
          >
            {isSubmitting ? "Actualizando..." : "Actualizar Contraseña"}
          </button>
        </form>
      )}
    </div>
  );
}

// 2. Componente principal de la página con Suspense (Resuelve el error del build)
export default function NewPasswordPage() {
  return (
    <main className="min-h-screen bg-[#F5F2EB] flex items-center justify-center pt-28 pb-12 px-4">
      <GameStyles />
      <Suspense fallback={
        <div className="text-center text-xs font-black uppercase text-stone-500 tracking-widest">
          Cargando portal...
        </div>
      }>
        <NewPasswordForm />
      </Suspense>
    </main>
  );
}