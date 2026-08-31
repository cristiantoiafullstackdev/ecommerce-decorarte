// src/app/components/admin/AdminSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { DecorarteIsotype } from "@/app/components/iconos/DecorArteBrand";

export default function AdminSidebar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Dashboard", href: "/admin" },
    { name: "Productos y Stock", href: "/admin/product" },
    { name: "Órdenes", href: "/admin/orders" },
    { name: "Clientes", href: "/admin/clientes" },
    { name: "Configuración Envíos", href: "/admin/settings" },
  ];

  return (
    <aside className="w-full lg:w-64 bg-[#1C1816] text-white flex flex-col justify-between p-5 sm:p-6 shadow-md shrink-0">
      <div className="space-y-6 sm:space-y-8">
        {/* Identidad del Panel */}
        <div className="flex items-center gap-3 lg:block">
          <div className="p-2 bg-stone-900/80 rounded-xl border border-stone-800 inline-block lg:hidden">
            <DecorarteIsotype size={28} className="text-[#B57C38]" />
          </div>
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest text-[#FFC107]">DecorArte</h2>
            <p className="text-[10px] text-stone-400 font-semibold tracking-wider uppercase">Panel de Gestión</p>
          </div>
        </div>

        {/* Enlaces de Navegación del Admin (Optimizado para scroll horizontal en móvil si fuera necesario, o flex-wrap) */}
        <nav className="flex lg:flex-col gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-colors shrink-0 ${
                  isActive 
                    ? "bg-[#FFC107] text-[#1C1816]" 
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
      <div className="pt-6 border-t border-stone-800/80 space-y-2 hidden lg:block">
        <Link
          href="/"
          className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
        >
          <span>Ver Shop Público</span>
          <span>↗</span>
        </Link>

        <button
          onClick={() => signOut({ callbackUrl: "/auth/login" })}
          className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-red-400 hover:text-red-300 hover:bg-stone-800 transition-colors"
        >
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}