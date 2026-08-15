// src/app/components/admin/AdminSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export default function AdminSidebar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Dashboard", href: "/admin" },
    { name: "Productos y Stock", href: "/admin/product" },
    { name: "Órdenes", href: "/admin/orders" },
    { name: "Clientes", href: "/admin/clientes" },
    { name: "Configuración Envíos", href: "/admin/settings" }, // ⚙️ NUEVO ENLACE
  ];

  return (
    <aside className="w-64 bg-[#1C1816] text-white flex flex-col justify-between p-6 shadow-md">
      <div className="space-y-8">
        {/* Identidad del Panel */}
        <div>
          <h2 className="text-sm font-black uppercase tracking-widest text-amber-400">DecorArte</h2>
          <p className="text-xs text-stone-400">Panel de Gestión</p>
        </div>

        {/* Enlaces de Navegación del Admin */}
        <nav className="space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                  isActive 
                    ? "bg-amber-400 text-black" 
                    : "text-stone-300 hover:bg-stone-800 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Zona Inferior: Enlaces rápidos de salida y sesión */}
      <div className="pt-6 border-t border-stone-800 space-y-3">
        {/* Enlace clave para ir al Shop a revisar stock/visualización */}
        <Link
          href="/"
          className="flex items-center justify-between px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
        >
          <span>Ver Shop Público</span>
          <span>↗</span>
        </Link>

        <button
          onClick={() => signOut({ callbackUrl: "/auth/login" })}
          className="w-full text-left px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-300 hover:bg-stone-800 transition-colors"
        >
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}