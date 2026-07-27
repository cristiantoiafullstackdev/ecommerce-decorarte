// src/app/admin/clients/page.tsx
import React from 'react';
import prisma from '@/lib/prisma';
import ClientsClient from '@/app/components/ui/clients/ClientsClient';

export default async function AdminClientsPage() {
  // Obtenemos los usuarios con sus órdenes asociadas
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
    <div className="p-8 space-y-8 bg-[#FCF9F5] min-h-screen font-sans max-w-7xl mx-auto text-stone-900">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <span className="text-[10px] text-[#B57C38] uppercase tracking-widest font-black bg-white px-2.5 py-1 rounded-md border border-stone-200">
            Panel de Control CRM
          </span>
          <h1 className="text-2xl font-black text-[#1C1816] uppercase tracking-tight mt-2">
            Comunidad y Clientes ({users.length})
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Gestión integral de compradores, volúmenes de facturación y roles de acceso.
          </p>
        </div>
      </div>

      {/* Renderizamos el componente cliente interactivo */}
      <ClientsClient initialClients={users} />
    </div>
  );
}