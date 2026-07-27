// src/app/admin/orders/page.tsx
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Prisma, OrderStatus } from '@prisma/client';// 1. Importamos los tipos generados por Prisma


interface AdminOrdersPageProps {
  searchParams: Promise<{ status?: string; query?: string }>;
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const resolvedSearchParams = await searchParams;
  const statusFilter = resolvedSearchParams.status;
  const queryFilter = resolvedSearchParams.query;

  // 2. Construimos el objeto 'where' tipado estrictamente con Prisma.OrderWhereInput
  const whereClause: Prisma.OrderWhereInput = {};

  // Si hay un filtro de estado válido, lo asignamos de forma segura
 if (statusFilter && Object.values(OrderStatus).includes(statusFilter as OrderStatus)) {
  whereClause.status = statusFilter as OrderStatus;
}


  // Si hay una consulta de búsqueda, armamos el OR tipado
  if (queryFilter) {
    whereClause.OR = [
      { email: { contains: queryFilter, mode: 'insensitive' } },
      { firstName: { contains: queryFilter, mode: 'insensitive' } },
      { lastName: { contains: queryFilter, mode: 'insensitive' } },
    ];
  }

  const orders = await prisma.order.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="p-8 space-y-6 bg-[#FCF9F5] min-h-screen font-sans text-stone-900">
      <div className="flex justify-between items-center border-b border-stone-200 pb-6">
        <div>
          <h1 className="text-xl font-black uppercase tracking-wider text-stone-900">
            📦 Mesa de Trabajo: Órdenes y Logística
          </h1>
          <p className="text-xs text-stone-500 font-medium">
            Listado completo de pedidos, control de estados de taller y despachos.
          </p>
        </div>
        <Link
          href="/admin"
          className="text-xs font-bold text-stone-600 hover:text-stone-900 underline"
        >
          &larr; Volver al Dashboard
        </Link>
      </div>

      {/* Filtros rápidos de estado */}
      <div className="flex gap-2 flex-wrap">
        <Link
          href="/admin/orders"
          className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${!statusFilter ? 'bg-stone-900 text-white' : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'}`}
        >
          Todas
        </Link>
        <Link
          href="/admin/orders?status=PENDING"
          className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${statusFilter === 'PENDING' ? 'bg-amber-600 text-white' : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'}`}
        >
          Pendientes
        </Link>
        <Link
          href="/admin/orders?status=PAID"
          className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${statusFilter === 'PAID' ? 'bg-emerald-600 text-white' : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'}`}
        >
          Pagadas
        </Link>
      </div>

      {/* Tabla Operativa */}
      <div className="bg-white rounded-2xl border-2 border-stone-200 overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-stone-100 border-b border-stone-200 text-stone-500 font-black uppercase text-[10px] tracking-wider">
              <th className="p-4">ID Pedido</th>
              <th className="p-4">Cliente</th>
              <th className="p-4">Estado</th>
              <th className="p-4">Total</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 font-medium text-stone-700">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-stone-400 font-medium">
                  No se encontraron órdenes registradas con los filtros actuales.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                  <td className="p-4 font-mono font-bold text-stone-900">#{order.id.slice(-6)}</td>
                  <td className="p-4 font-bold text-stone-900">{order.firstName} {order.lastName}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase bg-stone-100 text-stone-800 border border-stone-200">
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 font-black text-[#B57C38]">${Number(order.total ?? 0).toLocaleString('es-AR')}</td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="px-3 py-1.5 bg-stone-900 text-white rounded-xl text-[10px] font-black uppercase hover:bg-stone-800 transition-all"
                    >
                      Gestionar
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}