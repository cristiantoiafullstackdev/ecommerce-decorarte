// src/app/admin/welcome/AdminWelcomePage.tsx
"use client";

import { useState } from "react";
import { useRouter as useNextRouter } from "next/navigation";
import { DecorarteIsotype } from "@/app/components/iconos/DecorArteBrand";

export default function AdminWelcomePage() {
  const router = useNextRouter();
  const [storeName, setStoreName] = useState("DecorArte");
  const [contactEmail, setContactEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/complete-onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeName, contactEmail, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Ocurrió un error");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error inesperado");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EAE6DC] px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border-2 border-stone-200 shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-block p-3 bg-[#FCF9F5] rounded-2xl border border-stone-200 mb-1">
            <DecorarteIsotype size={40} className="text-[#B57C38]" />
          </div>
          <h1 className="text-lg font-black text-[#1C1816] uppercase tracking-wider">¡Bienvenido a DecorArte!</h1>
          <p className="text-xs text-stone-500 leading-relaxed">
            Estás a un paso de comenzar. Por seguridad, configura los datos de tu taller y define tu contraseña definitiva.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-xl text-xs font-bold uppercase tracking-wider">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-stone-600 mb-1.5">Nombre de tu Tienda</label>
            <input
              type="text"
              required
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-[#1C1816] bg-[#FCF9F5] text-xs font-semibold focus:outline-none transition-colors text-stone-900"
              placeholder="Ej: DecorArte"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-stone-600 mb-1.5">Correo de Contacto / Soporte</label>
            <input
              type="email"
              required
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-[#1C1816] bg-[#FCF9F5] text-xs font-semibold focus:outline-none transition-colors text-stone-900"
              placeholder="contacto@decorarte.com"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-stone-600 mb-1.5">Nueva Contraseña Definitiva</label>
            <input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-[#1C1816] bg-[#FCF9F5] text-xs font-semibold focus:outline-none transition-colors text-stone-900"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1C1816] hover:bg-[#B57C38] text-[#FFC107] hover:text-white py-3.5 rounded-xl font-black uppercase text-xs tracking-[0.15em] transition-all duration-150 border-2 border-[#1C1816] shadow-[0_4px_0px_#B57C38] active:translate-y-1 active:shadow-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Guardando..." : "Guardar y Entrar al Panel"}
          </button>
        </form>
      </div>
    </div>
  );
}