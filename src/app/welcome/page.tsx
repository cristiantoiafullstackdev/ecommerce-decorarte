"use client";

import { useState } from "react";
import { useRouter as useNextRouter } from "next/navigation";

export default function AdminWelcomePage() {
  const router = useNextRouter();
  const [storeName, setStoreName] = useState("Mi E-commerce");
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

      // Si todo sale bien, lo mandamos al panel principal de administración
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">¡Bienvenido a tu E-commerce!</h1>
          <p className="text-sm text-gray-600 mt-1">
            Estás a un paso de comenzar. Por seguridad, configura los datos de tu tienda y define tu contraseña definitiva.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre de tu Tienda</label>
            <input
              type="text"
              required
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
              placeholder="Ej: DecorArte"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Correo de Contacto / Soporte</label>
            <input
              type="email"
              required
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
              placeholder="contacto@tutienda.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Nueva Contraseña Definitiva</label>
            <input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Guardar y Entrar al Panel"}
          </button>
        </form>
      </div>
    </div>
  );
}