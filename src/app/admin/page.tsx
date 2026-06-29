import Link from 'next/link';
import prisma from '@/lib/prisma';
import { DecorarteIsotype, GameStyles } from '@/app/components/iconos/DecorArteBrand';

// Forzamos que el panel consulte siempre la base de datos Neon en tiempo real
export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  // 1. Traemos todos los pedidos de Neon DB ordenados por fecha de creación (los más nuevos primero)
  const orders = await prisma.order.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      items: true,
    },
  });

  // 2. Calculamos métricas reales del taller
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'PENDING').length;
  const paidOrders = orders.filter(o => o.status === 'PAID').length;

  const totalRevenue = orders
    .filter(o => o.status === 'PAID')
    .reduce((sum, o) => sum + Number(o.total), 0);

  // Mapeo estricto de badges para el listado principal
  const statusLabels: Record<string, { text: string; color: string; bg: string }> = {
    PENDING: { text: 'Pendiente', color: 'text-amber-700 border-amber-200', bg: 'bg-amber-50' },
    PAID: { text: 'Listo / Pagado', color: 'text-emerald-700 border-emerald-200', bg: 'bg-emerald-50' },
  };

  return (
    <div className="space-y-8 p-1 md:p-4">
      <GameStyles />

      {/* ENCABEZADO PRINCIPAL CON ISOTIPO INTEGRADO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border-2 border-stone-200 shadow-xs">
        <div className="flex items-center gap-4">
          {/* Aquí utilizamos el Isotipo para eliminar la advertencia de ESLint y mejorar el branding */}
          <div className="p-2.5 bg-stone-100 rounded-xl border border-stone-200 shrink-0">
            <DecorarteIsotype size={40} className="text-[#B57C38]" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#B57C38]">
              Área de Gestión Interna
            </span>
            <h1 className="text-2xl font-black text-[#1C1816] uppercase mt-0.5">
              Panel de Control del Taller
            </h1>
            <p className="text-[11px] text-stone-500 font-medium">
              Monitoreo de pedidos en Neon DB y estado de fabricación de piezas de madera.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start md:self-center">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-stone-600 uppercase tracking-wider">Conectado a Neon</span>
        </div>
      </div>

      {/* TARJETAS DE MÉTRICAS EN TIEMPO REAL */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Recaudado */}
        <div className="bg-white p-5 rounded-2xl border-2 border-stone-200 space-y-1.5 shadow-xs">
          <span className="text-[9px] font-black uppercase tracking-wider text-stone-400 block">Recaudación Acreditada</span>
          <p className="text-xl font-black text-[#B57C38]">${totalRevenue.toLocaleString('es-AR')}</p>
          <span className="text-[9px] text-stone-400 font-bold block">Solo órdenes marcadas como PAID</span>
        </div>

        {/* Órdenes Totales */}
        <div className="bg-white p-5 rounded-2xl border-2 border-stone-200 space-y-1.5 shadow-xs">
          <span className="text-[9px] font-black uppercase tracking-wider text-stone-400 block">Pedidos Registrados</span>
          <p className="text-xl font-black text-stone-850">{totalOrders}</p>
          <span className="text-[9px] text-stone-400 font-bold block">Historial general de compras</span>
        </div>

        {/* Pendientes de Pago */}
        <div className="bg-[#FFFDF9] p-5 rounded-2xl border-2 border-amber-200 space-y-1.5 shadow-xs">
          <span className="text-[9px] font-black uppercase tracking-wider text-amber-600 block">Pendientes de Pago</span>
          <p className="text-xl font-black text-amber-800">{pendingOrders}</p>
          <span className="text-[9px] text-amber-600/75 font-bold block">Esperando transferencia/acreditación</span>
        </div>

        {/* Pagados / Listos */}
        <div className="bg-[#FAFFF9] p-5 rounded-2xl border-2 border-emerald-200 space-y-1.5 shadow-xs">
          <span className="text-[9px] font-black uppercase tracking-wider text-emerald-600 block">Listos para Fabricar</span>
          <p className="text-xl font-black text-emerald-800">{paidOrders}</p>
          <span className="text-[9px] text-emerald-600/75 font-bold block">Maderas listas para corte y lijado</span>
        </div>
      </div>

      {/* LISTADO DE PEDIDOS DE LA BASE DE DATOS */}
      <div className="bg-white rounded-2xl border-2 border-stone-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-stone-150 bg-stone-50/50 flex justify-between items-center">
          <h2 className="text-xs font-black uppercase tracking-wider text-stone-800 flex items-center gap-2">
            📋 Registro de Hoja de Ruta ({orders.length})
          </h2>
          <span className="text-[9px] text-stone-400 font-black uppercase">Últimos movimientos</span>
        </div>

        {orders.length === 0 ? (
          <div className="p-12 text-center">
            <span className="text-3xl block mb-2">🪵</span>
            <p className="text-xs font-bold text-stone-500 uppercase tracking-wide">No se registraron pedidos en la base de datos aún.</p>
            <p className="text-[10px] text-stone-400 mt-1">Los pedidos aparecerán aquí automáticamente cuando los clientes finalicen el checkout.</p>
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
                  <th className="py-4 px-6 text-center">Estado</th>
                  <th className="py-4 px-6 text-right">Monto Cobrado</th>
                  <th className="py-4 px-6 text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium text-stone-700">
                {orders.map((order) => {
                  const friendlyId = order.id.slice(0, 8).toUpperCase();
                  const status = statusLabels[order.status] || { text: order.status, color: 'text-stone-700 border-stone-300', bg: 'bg-stone-50' };
                  
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
                        {order.province === 'cordoba' ? 'Córdoba' : order.province}
                      </td>

                      <td className="py-4 px-6 text-center text-[10px] font-bold text-stone-600">
                        {String(order.paymentMethod).toLowerCase() === 'transferencia' ? '🏦 Transferencia' : '💳 Tarjeta'}
                      </td>

                      <td className="py-4 px-6 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-md border text-[9px] font-black uppercase tracking-wider ${status.bg} ${status.color}`}>
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
                          Ver Carpeta 🡒
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
  );
}  