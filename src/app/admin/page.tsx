// src/app/admin/page.tsx
import Link from 'next/link';
import prisma from '@/lib/prisma';

export default async function AdminDashboard() {
  // Métricas macro rápidas de órdenes
  const totalOrders = await prisma.order.count();
  const pendingOrders = await prisma.order.count({ where: { status: 'PENDING' } });

  return (
    <div className="p-8 space-y-8 bg-[#FCF9F5] min-h-screen font-sans text-stone-900">
      {/* Cabecera */}
      <div className="flex justify-between items-center border-b border-stone-200 pb-6">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-wider text-stone-900">
            ⚡ Centro de Mando — DecorArte
          </h1>
          <p className="text-xs text-stone-500 font-medium">
            Resumen ejecutivo del taller y accesos rápidos de gestión.
          </p>
        </div>
        <div>
          <Link
            href="/admin/orders"
            className="px-4 py-2.5 bg-stone-900 text-[#FFF9F2] rounded-xl text-xs font-black uppercase tracking-wider hover:bg-stone-800 transition-all shadow-sm"
          >
            Ver Órdenes
          </Link>
        </div>
      </div>

      {/* Tarjetas de Métricas Macro */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border-2 border-stone-200 shadow-xs space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Total Histórico Órdenes</span>
          <div className="text-3xl font-black text-stone-900">{totalOrders}</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border-2 border-stone-200 shadow-xs space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-600">Pendientes de Acción</span>
          <div className="text-3xl font-black text-amber-700">{pendingOrders}</div>
          <Link href="/admin/orders?status=PENDING" className="text-[11px] font-bold text-[#B57C38] hover:underline block pt-1">
            Revisar pendientes &rarr;
          </Link>
        </div>
        {/* ⚙️ NUEVA TARJETA DE CONFIGURACIÓN DE ENVÍOS */}
        <div className="bg-white p-6 rounded-2xl border-2 border-stone-200 shadow-xs space-y-2 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Logística</span>
            <div className="text-lg font-black text-stone-900 mt-1">Costos de Envío</div>
          </div>
          <Link href="/admin/settings" className="text-[11px] font-bold text-[#B57C38] hover:underline block pt-1">
            Modificar tarifas &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}