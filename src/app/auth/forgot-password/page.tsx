//src/auth/forgot-password/page.tsx
'use client';

import { useState } from 'react';
import { forgotPassword } from '@/actions/auth-actions'; // Ajusta la ruta a donde guardaste tus Server Actions
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const res = await forgotPassword(email);
    setLoading(false);
    setMessage({ ok: res.ok, text: res.message });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-stone-200">
        <h1 className="text-2xl font-bold text-stone-800 mb-2 text-center">Recuperar Contraseña</h1>
        <p className="text-sm text-stone-500 mb-6 text-center">
          Ingresa tu correo electrónico y te enviaremos las instrucciones para restablecer tu clave.
        </p>

        {message && (
          <div className={`p-4 mb-4 text-sm rounded-lg ${message.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Correo Electrónico</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-stone-900 text-white font-medium rounded-lg hover:bg-stone-800 transition-colors disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Enviar instrucciones'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/auth/login" className="text-sm text-stone-600 hover:underline font-medium">
            ← Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
}