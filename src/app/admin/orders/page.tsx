// src/app/admin/orders/page.tsx

import { getAdminOrders } from "@/actions/admin-actions";
import Link from "next/link";
import { DecorarteIsotype } from "@/app/components/iconos/DecorArteBrand";
import { OrderStatus } from "@prisma/client";

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

export default async function AdminOrdersPage() {
  const { ok, orders, error } = await getAdminOrders();

  return (
    <main className="min-h-screen bg-[#F5F2EB] pt-28 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Cabecera unificada */}
        <div className="bg-[#FCF9F5] border-2 border-stone-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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

        {/* Contenido / Tabla */}
        <div className="bg-[#FCF9F5] border-2 border-stone-200 rounded-2xl shadow-sm overflow-hidden">
          {!ok ? (
            <div className="p-8 text-center text-red-600 text-xs font-bold uppercase">
              {error || "Error al cargar las órdenes."}
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center gap-3">
              <span className="text-3xl">📭</span>
              <p className="text-xs font-bold text-stone-600 uppercase tracking-wider">No hay órdenes registradas en el sistema</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-100/60 text-[10px] font-black text-stone-500 uppercase tracking-widest">
                    <th className="p-4">Pedido ID</th>
                    <th className="p-4">Cliente</th>
                    <th className="p-4">Fecha</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 text-xs text-stone-700">
                  {orders.map((order) => {
                    const shortId = order.id.split('-')[0].toUpperCase();
                    const customerName = `${order.firstName} ${order.lastName}`;
                    const dateFormatted = new Date(order.createdAt).toLocaleDateString('es-AR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: '2-digit'
                    });

                    return (
                      <tr key={order.id} className="hover:bg-stone-100/40 transition-colors">
                        <td className="p-4 font-black text-[#1C1816]">#{shortId}</td>
                        <td className="p-4">
                          <span className="font-bold block text-stone-800">{customerName}</span>
                          <span className="text-[10px] text-stone-400">{order.email}</span>
                        </td>
                        <td className="p-4 font-semibold text-stone-600">{dateFormatted}</td>
                        <td className="p-4 font-black text-[#C84B31]">${order.total.toLocaleString('es-AR')}</td>
                        <td className="p-4">{getOrderStatusBadge(order.status)}</td>
                        <td className="p-4 text-right">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="inline-block px-3.5 py-1.5 bg-[#1C1816] hover:bg-[#B57C38] text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-all shadow-sm"
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
          )}
        </div>

      </div>
    </main>
  );
}