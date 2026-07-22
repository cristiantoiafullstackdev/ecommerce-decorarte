"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAdminOrders, AdminOrder } from '@/actions/admin-actions';
import { DecorarteIsotype, GameStyles } from '@/app/components/iconos/DecorArteBrand';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros de estado y tiempo seleccionados en el cliente
  const [revenueRange, setRevenueRange] = useState<'all' | 'year' | 'month' | '30days' | '7days'>('all');
  const [activeStatusFilter, setActiveStatusFilter] = useState<string | null>(null);

  // Sincronizamos las órdenes frescas de Neon DB al montar el componente
  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      const res = await getAdminOrders();
      if (res.ok && res.orders) {
        setOrders(res.orders);
      } else {
        setError(res.error || "No se pudieron recuperar los registros del taller.");
      }
      setLoading(false);
    }
    fetchDashboardData();
  }, []);

  // Mapeo unificado de colores y textos para los badges y tarjetas (6 estados reales de schema.prisma)
  const statusConfig: Record<string, { text: string; color: string; bg: string; border: string }> = {
    PENDING: { text: 'Pendiente de Pago', color: 'text-amber-750 border-amber-200', bg: 'bg-amber-50/50', border: 'border-amber-200' },
    PAID: { text: 'Pago Aprobado', color: 'text-emerald-700 border-emerald-200', bg: 'bg-emerald-50/50', border: 'border-emerald-200' },
    PREPARING: { text: 'En Preparación & Calidad', color: 'text-blue-750 border-blue-200', bg: 'bg-blue-50/50', border: 'border-blue-200' },
    SHIPPED: { text: 'Despachado / En Viaje', color: 'text-indigo-750 border-indigo-200', bg: 'bg-indigo-50/50', border: 'border-indigo-200' },
    DELIVERED: { text: 'Entregado', color: 'text-stone-700 border-stone-300', bg: 'bg-stone-100', border: 'border-stone-300' },
    CANCELLED: { text: 'Cancelado', color: 'text-red-750 border-red-200', bg: 'bg-red-50/50', border: 'border-red-200' },
  };

  // Función utilitaria para filtrar las órdenes por fecha según la selección del administrador
  const filterOrdersByDate = (orderList: AdminOrder[], range: typeof revenueRange) => {
    const now = new Date();
    return orderList.filter((order) => {
      const orderDate = new Date(order.createdAt);
      if (range === 'year') {
        return orderDate.getFullYear() === now.getFullYear();
      }
      if (range === 'month') {
        return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
      }
      if (range === '30days') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);
        return orderDate >= thirtyDaysAgo;
      }
      if (range === '7days') {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);
        return orderDate >= sevenDaysAgo;
      }
      return true; // 'all' (Histórico Total)
    });
  };

  // 1. Calculamos la recaudación dinámica (excluimos pedidos PENDING y CANCELLED para ser realistas con la caja)
  const revenueOrders = orders.filter(o => ['PAID', 'PREPARING', 'SHIPPED', 'DELIVERED'].includes(o.status));
  const datedRevenueOrders = filterOrdersByDate(revenueOrders, revenueRange);
  const totalRevenue = datedRevenueOrders.reduce((sum, o) => sum + Number(o.total), 0);

  // 2. Calculamos los contadores totales para todos los estados de forma inmutable
  const countByStatus = (status: string) => orders.filter((o) => o.status === status).length;

  // 3. Filtramos los pedidos que se renderizan en la tabla inferior
  const displayedOrders = activeStatusFilter
    ? orders.filter((o) => o.status === activeStatusFilter)
    : orders;

  return (
    <div className="space-y-8 p-1 md:p-4">
      <GameStyles />

      {/* ENCABEZADO PRINCIPAL CON LOGO DE LA MARCA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border-2 border-stone-200 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-stone-100 rounded-xl border border-stone-200 shrink-0">
            <DecorarteIsotype size={40} className="text-[#B57C38]" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#B57C38]">
              Área de Control Operativo
            </span>
            <h1 className="text-2xl font-black text-[#1C1816] uppercase mt-0.5">
              Panel de Control del Taller
            </h1>
            <p className="text-[11px] text-stone-500 font-medium">
              Monitoreo de maderas y pedidos en tiempo real sobre Neon DB.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start md:self-center">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-stone-600 uppercase tracking-wider">Conectado a Neon</span>
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center space-y-3">
          <div className="text-[#B57C38] animate-spin flex justify-center">
            <DecorarteIsotype size={32} />
          </div>
          <span className="text-xs font-black uppercase text-stone-500 tracking-widest block">
            Cargando base de datos de pedidos...
          </span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-2 border-red-200 text-red-800 text-xs font-bold uppercase tracking-wider rounded-xl p-6 text-center">
          ⚠️ Alerta: {error}
        </div>
      ) : (
        <>
          {/* SECCIÓN DE CONTROLES SUPERIORES: RECAUDACIÓN INTERACTIVA */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-[#1C1816] text-[#FFF9F2] p-6 rounded-2xl border-2 border-stone-800 shadow-md flex flex-col justify-between gap-4 lg:col-span-1">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-wider text-stone-400 block">
                    Recaudación del Taller
                  </span>
                  <p className="text-2xl font-black text-[#FFC107] mt-1">
                    ${totalRevenue.toLocaleString('es-AR')}
                  </p>
                </div>
                
                {/* Selector interactivo de rango temporal */}
                <select
                  value={revenueRange}
                  onChange={(e) => setRevenueRange(e.target.value as typeof revenueRange)}
                  className="bg-stone-900 border border-stone-800 text-[#FFF9F2] text-[10px] font-black uppercase tracking-wider p-2 rounded-lg cursor-pointer focus:outline-none focus:border-[#B57C38] h-9"
                >
                  <option value="all">Histórico Total</option>
                  <option value="year">Este Año</option>
                  <option value="month">Este Mes</option>
                  <option value="30days">Últimos 30 Días</option>
                  <option value="7days">Últimos 7 Días</option>
                </select>
              </div>
              <p className="text-[10px] text-stone-400 font-bold leading-relaxed">
                Calculado en base a órdenes con pago acreditado en el período de tiempo seleccionado.
              </p>
            </div>

            {/* CONTADORES OPERATIVOS EN GRID (6 tarjetas para todos tus estados de base de datos) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 lg:col-span-2">
              {/* Tarjeta PAID */}
              <button
                onClick={() => setActiveStatusFilter(activeStatusFilter === 'PAID' ? null : 'PAID')}
                className={`p-4 rounded-2xl border-2 text-left transition-all relative ${
                  activeStatusFilter === 'PAID'
                    ? 'border-[#B57C38] bg-emerald-50/50 scale-[1.02] shadow-xs'
                    : 'border-stone-200 bg-white hover:border-[#B57C38]'
                }`}
              >
                <span className="text-[8px] font-black uppercase tracking-widest text-emerald-600 block">Pago Aprobado</span>
                <p className="text-xl font-black text-stone-900 mt-1">{countByStatus('PAID')}</p>
                <span className="text-[9px] text-stone-400 font-bold block mt-0.5">Listo para preparar</span>
                {activeStatusFilter === 'PAID' && <span className="absolute top-2 right-2 text-xs">🔍</span>}
              </button>

              {/* Tarjeta PREPARING */}
              <button
                onClick={() => setActiveStatusFilter(activeStatusFilter === 'PREPARING' ? null : 'PREPARING')}
                className={`p-4 rounded-2xl border-2 text-left transition-all relative ${
                  activeStatusFilter === 'PREPARING'
                    ? 'border-[#B57C38] bg-blue-50/50 scale-[1.02] shadow-xs'
                    : 'border-stone-200 bg-white hover:border-[#B57C38]'
                }`}
              >
                <span className="text-[8px] font-black uppercase tracking-widest text-blue-650 block">En Preparación</span>
                <p className="text-xl font-black text-stone-900 mt-1">{countByStatus('PREPARING')}</p>
                <span className="text-[9px] text-stone-400 font-bold block mt-0.5">Calidad y Embalaje</span>
                {activeStatusFilter === 'PREPARING' && <span className="absolute top-2 right-2 text-xs">🔍</span>}
              </button>

              {/* Tarjeta SHIPPED */}
              <button
                onClick={() => setActiveStatusFilter(activeStatusFilter === 'SHIPPED' ? null : 'SHIPPED')}
                className={`p-4 rounded-2xl border-2 text-left transition-all relative ${
                  activeStatusFilter === 'SHIPPED'
                    ? 'border-[#B57C38] bg-indigo-50/50 scale-[1.02] shadow-xs'
                    : 'border-stone-200 bg-white hover:border-[#B57C38]'
                }`}
              >
                <span className="text-[8px] font-black uppercase tracking-widest text-indigo-600 block">Despachados</span>
                <p className="text-xl font-black text-stone-900 mt-1">{countByStatus('SHIPPED')}</p>
                <span className="text-[9px] text-stone-400 font-bold block mt-0.5">En manos del flete</span>
                {activeStatusFilter === 'SHIPPED' && <span className="absolute top-2 right-2 text-xs">🔍</span>}
              </button>

              {/* Tarjeta DELIVERED */}
              <button
                onClick={() => setActiveStatusFilter(activeStatusFilter === 'DELIVERED' ? null : 'DELIVERED')}
                className={`p-4 rounded-2xl border-2 text-left transition-all relative ${
                  activeStatusFilter === 'DELIVERED'
                    ? 'border-[#B57C38] bg-stone-55 scale-[1.02] shadow-xs'
                    : 'border-stone-200 bg-white hover:border-[#B57C38]'
                }`}
              >
                <span className="text-[8px] font-black uppercase tracking-widest text-stone-500 block">Entregados</span>
                <p className="text-xl font-black text-stone-900 mt-1">{countByStatus('DELIVERED')}</p>
                <span className="text-[9px] text-stone-400 font-bold block mt-0.5">Completados</span>
                {activeStatusFilter === 'DELIVERED' && <span className="absolute top-2 right-2 text-xs">🔍</span>}
              </button>

              {/* Tarjeta PENDING */}
              <button
                onClick={() => setActiveStatusFilter(activeStatusFilter === 'PENDING' ? null : 'PENDING')}
                className={`p-4 rounded-2xl border-2 text-left transition-all relative ${
                  activeStatusFilter === 'PENDING'
                    ? 'border-[#B57C38] bg-amber-50/50 scale-[1.02] shadow-xs'
                    : 'border-stone-200 bg-white hover:border-[#B57C38]'
                }`}
              >
                <span className="text-[8px] font-black uppercase tracking-widest text-amber-600 block">Pago Pendiente</span>
                <p className="text-xl font-black text-stone-900 mt-1">{countByStatus('PENDING')}</p>
                <span className="text-[9px] text-stone-400 font-bold block mt-0.5">En espera</span>
                {activeStatusFilter === 'PENDING' && <span className="absolute top-2 right-2 text-xs">🔍</span>}
              </button>

              {/* Tarjeta CANCELLED */}
              <button
                onClick={() => setActiveStatusFilter(activeStatusFilter === 'CANCELLED' ? null : 'CANCELLED')}
                className={`p-4 rounded-2xl border-2 text-left transition-all relative ${
                  activeStatusFilter === 'CANCELLED'
                    ? 'border-[#B57C38] bg-red-50/50 scale-[1.02] shadow-xs'
                    : 'border-stone-200 bg-white hover:border-[#B57C38]'
                }`}
              >
                <span className="text-[8px] font-black uppercase tracking-widest text-red-600 block">Cancelados</span>
                <p className="text-xl font-black text-stone-900 mt-1">{countByStatus('CANCELLED')}</p>
                <span className="text-[9px] text-stone-400 font-bold block mt-0.5">Bajas de maderas</span>
                {activeStatusFilter === 'CANCELLED' && <span className="absolute top-2 right-2 text-xs">🔍</span>}
              </button>
            </div>
          </div>

          {/* TABLA DE ÓRDENES Y SEGUIMIENTO CON FILTROS EN TIEMPO REAL */}
          <div className="bg-white rounded-2xl border-2 border-stone-200 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-stone-150 bg-stone-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xs font-black uppercase tracking-wider text-stone-800 flex items-center gap-2">
                  📋 Hoja de Ruta ({displayedOrders.length})
                </h2>
                {activeStatusFilter && (
                  <p className="text-[10px] text-stone-500 font-semibold uppercase mt-0.5">
                    Filtrando por: <span className="text-[#B57C38] font-bold">{statusConfig[activeStatusFilter]?.text}</span>
                  </p>
                )}
              </div>
              {activeStatusFilter && (
                <button
                  onClick={() => setActiveStatusFilter(null)}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 border border-stone-250 rounded-lg text-[9px] font-black uppercase tracking-wider transition-colors"
                >
                  ✕ Quitar Filtro (Ver todos)
                </button>
              )}
            </div>

            {displayedOrders.length === 0 ? (
              <div className="p-16 text-center">
                <span className="text-3xl block mb-2">🪵</span>
                <p className="text-xs font-bold text-stone-500 uppercase tracking-wide">
                  No hay pedidos con el estado seleccionado en este momento.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-stone-150 text-stone-400 font-black uppercase text-[9px] tracking-wider bg-stone-50/25">
                      <th className="py-4 px-6">ID Pedido</th>
                      <th className="py-4 px-6">Cliente</th>
                      <th className="py-4 px-6 hidden md:table-cell">Provincia</th>
                      <th className="py-4 px-6 text-center">Medio de Pago</th>
                      <th className="py-4 px-6 text-center">Estado Logístico</th>
                      <th className="py-4 px-6 text-right">Monto Total</th>
                      <th className="py-4 px-6 text-center">Carpeta</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium text-stone-700">
                    {displayedOrders.map((order) => {
                      const friendlyId = order.id.slice(0, 8).toUpperCase();
                      const status = statusConfig[order.status] || { 
                        text: order.status, 
                        color: 'text-stone-700 border-stone-300', 
                        bg: 'bg-stone-50', 
                        border: 'border-stone-300' 
                      };
                      
                      return (
                        <tr key={order.id} className="hover:bg-stone-50/50 transition-colors">
                          <td className="py-4 px-6 font-bold text-[#1C1816]">
                            #DA-{friendlyId}
                          </td>
                          
                          <td className="py-4 px-6">
                            <div className="font-bold text-stone-900">{order.firstName} {order.lastName}</div>
                            <div className="text-[10px] text-stone-400 font-bold font-sans">{order.email}</div>
                          </td>

                          <td className="py-4 px-6 hidden md:table-cell text-stone-500 font-semibold uppercase text-[10px]">
                            {order.province === 'cordoba' ? 'Córdoba' : order.province.toUpperCase()}
                          </td>

                          <td className="py-4 px-6 text-center text-[10px] font-bold text-stone-600">
                            {String(order.paymentMethod).toLowerCase() === 'transferencia' ? '🏦 Transferencia' : '💳 Tarjeta'}
                          </td>

                          <td className="py-4 px-6 text-center">
                            <span className={`inline-block px-2.5 py-0.5 rounded-md border text-[9px] font-black uppercase tracking-wider ${status.bg} ${status.color} ${status.border}`}>
                              {status.text}
                            </span>
                          </td>

                          <td className="py-4 px-6 text-right font-black text-stone-900">
                            ${Number(order.total).toLocaleString('es-AR')}
                          </td>

                          <td className="py-4 px-6 text-center">
                            <Link
                              href={`/admin/orders/${order.id}`}
                              className="inline-block px-3 py-1.5 bg-[#E2DCD0] hover:bg-[#B57C38] hover:text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-all text-stone-700"
                            >
                              Abrir 🡒
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}