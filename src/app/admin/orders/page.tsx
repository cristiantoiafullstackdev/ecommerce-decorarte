// src/app/admin/orders/page.tsx

"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { DecorarteIsotype } from "@/app/components/iconos/DecorArteBrand";
import { OrderStatus } from "@prisma/client";
import { AdminOrder } from "@/actions/admin-actions";


const ITEMS_PER_PAGE = 8;

function getOrderStatusBadge(status: string) {
  switch (status) {
    case OrderStatus.PAID:
      return <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">Pagado</span>;
    case OrderStatus.PREPARING:
      return <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">En Preparación</span>;
    case OrderStatus.SHIPPED:
      return <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-800 border border-indigo-200">Enviado</span>;
    case OrderStatus.DELIVERED:
      return <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-200">Entregado</span>;
    case OrderStatus.CANCELLED:
      return <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-red-100 text-red-800 border border-red-200">Cancelado</span>;
    case OrderStatus.PENDING:
    default:
      return <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">Pendiente</span>;
  }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    async function loadOrders() {
      setLoading(true);
      try {
        // Importación dinámica o asumiendo el llamado a la Server Action
        const { getAdminOrders } = await import("@/actions/admin-actions");
        const res = await getAdminOrders();
        
        if (res.ok && res.orders) {
          setOrders(res.orders as AdminOrder[]);
        } else {
          setErrorMsg(res.error || "Error al cargar las órdenes.");
        }
      } catch (error) {
          const mensajeError = error instanceof Error ? error.message : "Error desconocido";
          console.error(mensajeError);
          setErrorMsg("Ocurrió un error inesperado al conectar con el servidor.");
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Filtrado optimizado de órdenes por ID, Nombre, Apellido o Email
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const query = searchQuery.toLowerCase();
      const fullName = `${order.firstName} ${order.lastName}`.toLowerCase();
      const shortId = order.id.split('-')[0].toLowerCase();
      const email = order.email.toLowerCase();

      return fullName.includes(query) || shortId.includes(query) || email.includes(query);
    });
  }, [orders, searchQuery]);

  // Cálculos de Paginación estricta
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const safeCurrentPage = Math.min(currentPage, totalPages || 1);

  const paginatedOrders = useMemo(() => {
    const start = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredOrders.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredOrders, safeCurrentPage]);

  console.log({
  totalOrders: orders.length,
  filteredLength: filteredOrders.length,
  totalPages,
  safeCurrentPage,
  paginatedLength: paginatedOrders.length
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
              <span className="text-[10px] font-black uppercase tracking-widest text-[#B57C38]">Panel Operativo</span>
              <h1 className="text-xl sm:text-2xl font-black text-[#1C1816] uppercase tracking-wider">Gestión de Órdenes</h1>
              <p className="text-xs text-stone-500 uppercase tracking-widest mt-1">Seguimiento de pedidos del taller</p>
            </div>
          </div>
          <Link 
            href="/admin"
            className="w-full sm:w-auto px-4 py-3 bg-[#1C1816] hover:bg-[#B57C38] text-[#FFC107] hover:text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-[0_4px_0px_#B57C38] active:translate-y-0.5 text-center shrink-0"
          >
            ← Volver al Centro de Mando
          </Link>
        </div>

        {/* Barra de Búsqueda */}
        <div className="bg-[#FCF9F5] p-4 rounded-2xl border-2 border-stone-200 shadow-xs">
          <input
            type="text"
            placeholder="Buscar por ID de pedido, nombre de cliente o email..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-[#1C1816] bg-white text-xs text-stone-800 font-medium focus:outline-none transition-colors"
          />
        </div>

        {/* Contenido / Tabla */}
        <div className="bg-[#FCF9F5] border-2 border-stone-200 rounded-2xl shadow-xs overflow-hidden">
          {loading ? (
            <div className="p-16 text-center space-y-3">
              <div className="text-[#B57C38] animate-spin flex justify-center">
                <DecorarteIsotype size={32} />
              </div>
              <span className="text-xs font-black uppercase text-stone-500 tracking-widest block">
                Cargando registros de pedidos...
              </span>
            </div>
          ) : errorMsg ? (
            <div className="p-8 text-center text-red-600 text-xs font-bold uppercase">
              {errorMsg}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center gap-3">
              <span className="text-3xl">📭</span>
              <p className="text-xs font-bold text-stone-600 uppercase tracking-wider">No se encontraron órdenes registradas</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-stone-200 bg-stone-100/60 text-[10px] font-black text-stone-500 uppercase tracking-widest">
                      <th className="p-4 pl-6">Pedido ID</th>
                      <th className="p-4">Cliente</th>
                      <th className="p-4">Fecha</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Estado</th>
                      <th className="p-4 pr-6 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 text-xs text-stone-700 font-medium">
                    {paginatedOrders.map((order) => {
                      const shortId = order.id.split('-')[0].toUpperCase();
                      const customerName = `${order.firstName} ${order.lastName}`;
                      const dateFormatted = new Date(order.createdAt).toLocaleDateString('es-AR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit'
                      });

                      return (
                        <tr key={order.id} className="hover:bg-stone-100/40 transition-colors">
                          <td className="p-4 pl-6 font-black text-[#1C1816]">#{shortId}</td>
                          <td className="p-4">
                            <span className="font-bold block text-stone-800">{customerName}</span>
                            <span className="text-[10px] text-stone-400 select-all">{order.email}</span>
                          </td>
                          <td className="p-4 font-semibold text-stone-600">{dateFormatted}</td>
                          <td className="p-4 font-black text-[#C84B31]">${order.total.toLocaleString('es-AR')}</td>
                          <td className="p-4">{getOrderStatusBadge(order.status)}</td>
                          <td className="p-4 pr-6 text-right">
                            <Link
                              href={`/admin/orders/${order.id}`}
                              className="inline-block px-3.5 py-1.5 bg-[#1C1816] hover:bg-[#B57C38] text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-all shadow-xs"
                            >
                              Gestionar
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* BARRA DE PAGINACIÓN MOBILE-FIRST */}
              {totalPages > 1 && (
                <nav 
                  aria-label="Paginación de órdenes de administración" 
                  className="p-5 bg-stone-100/55 border-t-2 border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                  <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider text-center sm:text-left">
                    Página <span className="text-[#1C1816] font-black">{safeCurrentPage}</span> de <span className="text-[#1C1816] font-black">{totalPages}</span>
                  </div>

                  <div className="flex items-center gap-1.5 w-full sm:w-auto justify-between sm:justify-center">
                    <button
                      onClick={() => handlePageChange(safeCurrentPage - 1)}
                      disabled={safeCurrentPage <= 1}
                      className="flex-1 sm:flex-none px-3 sm:px-3.5 py-2 rounded-xl border-2 border-stone-200 bg-white text-stone-700 hover:bg-stone-100 disabled:opacity-30 disabled:hover:bg-white text-xs font-black uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                      </svg>
                      <span>Anterior</span>
                    </button>

                    <div className="flex items-center gap-1 mx-1 overflow-x-auto max-w-[220px] sm:max-w-none py-1">
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
                            className={`min-w-[32px] h-8 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center shrink-0 ${
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
                      className="flex-1 sm:flex-none px-3 sm:px-3.5 py-2 rounded-xl border-2 border-stone-200 bg-white text-stone-700 hover:bg-stone-100 disabled:opacity-30 disabled:hover:bg-white text-xs font-black uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-1"
                    >
                      <span>Siguiente</span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  </div>
                </nav>
              )}
            </>
          )}
        </div>

      </div>
    </main>
  );
}