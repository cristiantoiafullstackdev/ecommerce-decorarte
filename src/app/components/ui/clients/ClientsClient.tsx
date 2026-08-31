// src/app/admin/clientes/ClientsClient.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { Role } from '@prisma/client';

interface ClientWithOrders {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  createdAt: Date;
  orders: {
    total: number;
    province: string;
    paymentMethod: string;
  }[];
}

interface ClientsClientProps {
  initialClients: ClientWithOrders[];
}

export default function ClientsClient({ initialClients }: ClientsClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');

  const filteredClients = useMemo(() => {
    return initialClients.filter((client) => {
      const matchesSearch = 
        (client.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = selectedRole === 'ALL' || client.role === selectedRole;

      return matchesSearch && matchesRole;
    });
  }, [initialClients, searchTerm, selectedRole]);

  return (
    <div className="space-y-6">
      {/* Barra de Filtros y Búsqueda */}
      <div className="bg-white p-4 rounded-2xl border-2 border-stone-200 shadow-xs flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="w-full sm:w-96">
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border-2 border-stone-200 bg-[#FCF9F5] text-xs font-medium focus:outline-none focus:border-[#1C1816] text-stone-900"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <span className="text-[10px] font-black uppercase tracking-wider text-stone-500">Filtrar Rol:</span>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-2.5 rounded-xl border-2 border-stone-200 bg-[#FCF9F5] text-xs font-bold text-stone-800 focus:outline-none focus:border-[#1C1816]"
          >
            <option value="ALL">Todos los roles</option>
            <option value="USER">USER</option>
            <option value="MANAGER">MANAGER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>
      </div>

      {/* Tabla de Resultados */}
      <div className="bg-white rounded-2xl border-2 border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#E2DCD0] text-[#1C1816] text-[10px] font-black uppercase tracking-widest border-b-2 border-stone-300">
                <th className="p-4">Cliente / Email</th>
                <th className="p-4">Rol en Sistema</th>
                <th className="p-4 text-center">Total Órdenes</th>
                <th className="p-4">Monto Histórico Gastado</th>
                <th className="p-4">Fecha de Alta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 text-xs text-stone-800 font-medium">
              {filteredClients.map((client) => {
                const totalSpent = client.orders.reduce((acc, order) => acc + (order.total || 0), 0);
                
                return (
                  <tr key={client.id} className="hover:bg-[#FCF9F5] transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-[#1C1816]">{client.name || 'Sin Nombre Registrado'}</div>
                      <div className="text-stone-500 text-[11px]">{client.email}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase ${client.role === 'ADMIN' ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-700'}`}>
                        {client.role}
                      </span>
                    </td>
                    <td className="p-4 text-center font-bold">
                      <span className="bg-stone-100 px-2.5 py-1 rounded-full text-stone-800">{client.orders.length}</span>
                    </td>
                    <td className="p-4 font-black text-[#B57C38]">
                      ${totalSpent.toLocaleString('es-AR')}
                    </td>
                    <td className="p-4 text-stone-500">
                      {new Date(client.createdAt).toLocaleDateString('es-AR')}
                    </td>
                  </tr>
                );
              })}
              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-stone-400 font-medium">
                    No se encontraron clientes que coincidan con los filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}