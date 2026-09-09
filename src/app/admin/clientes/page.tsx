// src/app/admin/clients/page.tsx

import React from 'react';
import prisma from '@/lib/prisma';
import ClientsClient from '@/app/components/ui/clients/ClientsClient';
import Link from 'next/link';
import { DecorarteIsotype } from '@/app/components/iconos/DecorArteBrand';

export default async function AdminClientsPage() {
  const users = await prisma.user.findMany({
    include: {
      orders: {
        select: {
          total: true,
          province: true,
          paymentMethod: true,
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <main className="min-h-screen bg-[#F5F2EB] pt-28 pb-20 px-4 md:px-8 font-sans text-stone-900">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Cabecera unificada */}
        <div className="bg-[#FCF9F5] border-2 border-stone-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-stone-100 rounded-xl border border-stone-200 shrink-0">
              <DecorarteIsotype size={36} className="text-[#B57C38]" />
            </div>
            <div>
              <span className="text-[10px] text-[#B57C38] uppercase tracking-widest font-black">
                Panel de Control CRM
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-[#1C1816] uppercase tracking-tight mt-0.5">
                Comunidad y Clientes ({users.length})
              </h1>
              <p className="text-xs text-stone-600 mt-1 font-medium">
                Gestión integral de compradores, volúmenes de facturación y roles de acceso.
              </p>
            </div>
          </div>
          <Link 
            href="/admin"
            className="w-full sm:w-auto px-4 py-3 bg-[#1C1816] hover:bg-[#B57C38] text-[#FFC107] hover:text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-[0_4px_0px_#B57C38] active:translate-y-0.5 text-center shrink-0"
          >
            ← Volver al Centro de Mando
          </Link>
        </div>

        {/* Renderizamos el componente cliente interactivo */}
        <ClientsClient initialClients={users} />
      </div>
    </main>
  );
}