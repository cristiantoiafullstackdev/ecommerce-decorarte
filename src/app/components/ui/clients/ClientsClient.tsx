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

const CLIENTS_PER_PAGE = 8; // Cantidad de clientes por página en la tabla

export default function ClientsClient({ initialClients }: ClientsClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const filteredClients = useMemo(() => {
    return initialClients.filter((client) => {
      const matchesSearch = 
        (client.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = selectedRole === 'ALL' || client.role === selectedRole;

      return matchesSearch && matchesRole;
    });
  }, [initialClients, searchTerm, selectedRole]);

  const totalPages = Math.ceil(filteredClients.length / CLIENTS_PER_PAGE);
  const safeCurrentPage = Math.min(currentPage, totalPages || 1);

  const paginatedClients = useMemo(() => {
    const start = (safeCurrentPage - 1) * CLIENTS_PER_PAGE;
    return filteredClients.slice(start, start + CLIENTS_PER_PAGE);
  }, [filteredClients, safeCurrentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      {/* Barra de Filtros y Búsqueda */}
      <div className="bg-white p-4 rounded-2xl border-2 border-stone-200 shadow-xs flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="w-full sm:w-96">
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reseteamos la página directamente al buscar
            }}
            className="w-full px-4 py-2.5 rounded-xl border-2 border-stone-200 bg-[#FCF9F5] text-xs font-medium focus:outline-none focus:border-[#1C1816] text-stone-900"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <span className="text-[10px] font-black uppercase tracking-wider text-stone-500">Filtrar Rol:</span>
          <select
            value={selectedRole}
            onChange={(e) => {
              setSelectedRole(e.target.value);
              setCurrentPage(1); // Reseteamos la página directamente al filtrar por rol
            }}
            className="px-4 py-2.5 rounded-xl border-2 border-stone-200 bg-[#FCF9F5] text-xs font-bold text-stone-800 focus:outline-none focus:border-[#1C1816] cursor-pointer"
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
              {paginatedClients.map((client) => {
                const totalSpent = client.orders.reduce((acc, order) => acc + (order.total || 0), 0);
                
                return (
                  <tr key={client.id} className="hover:bg-[#FCF9F5] transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-[#1C1816] uppercase">{client.name || 'Sin Nombre Registrado'}</div>
                      <div className="text-stone-500 text-[11px] select-all">{client.email}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase ${client.role === 'ADMIN' ? 'bg-amber-100 text-amber-800' : client.role === 'MANAGER' ? 'bg-stone-200 text-stone-800' : 'bg-stone-100 text-stone-700'}`}>
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
              {paginatedClients.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-stone-400 font-medium">
                    No se encontraron clientes que coincidan con los filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* BARRA DE PAGINACIÓN MOBILE-FIRST */}
        {totalPages > 1 && (
          <nav 
            aria-label="Paginación de clientes" 
            className="p-4 border-t-2 border-stone-200 bg-stone-50 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider text-center sm:text-left">
              Mostrando página <span className="text-[#1C1816] font-black">{safeCurrentPage}</span> de <span className="text-[#1C1816] font-black">{totalPages}</span> <span className="text-stone-400">({filteredClients.length} clientes en total)</span>
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto justify-between sm:justify-center">
              <button
                onClick={() => handlePageChange(safeCurrentPage - 1)}
                disabled={safeCurrentPage <= 1}
                className="flex-1 sm:flex-none px-3 py-2 rounded-xl border-2 border-stone-200 bg-white text-stone-700 hover:bg-stone-100 disabled:opacity-30 disabled:hover:bg-white text-[10px] font-black uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Anterior</span>
              </button>

              <div className="flex items-center gap-1 mx-1 overflow-x-auto max-w-[180px] py-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  const isNearCurrent = Math.abs(page - safeCurrentPage) <= 1 || page === 1 || page === totalPages;
                  
                  if (!isNearCurrent) {
                    if (page === 2 || page === totalPages - 1) {
                      return <span key={page} className="px-1 text-stone-400 font-bold text-xs select-none">•••</span>;
                    }
                    return null;
                  }

                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`min-w-[28px] h-7 px-2 rounded-lg text-[10px] font-black transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                        safeCurrentPage === page
                          ? "bg-[#1C1816] text-[#FFC107] shadow-sm scale-105"
                          : "border-2 border-stone-200 bg-white text-stone-600 hover:bg-stone-100"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(safeCurrentPage + 1)}
                disabled={safeCurrentPage >= totalPages}
                className="flex-1 sm:flex-none px-3 py-2 rounded-xl border-2 border-stone-200 bg-white text-stone-700 hover:bg-stone-100 disabled:opacity-30 disabled:hover:bg-white text-[10px] font-black uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Siguiente</span>
              </button>
            </div>
          </nav>
        )}
      </div>
    </div>
  );
}