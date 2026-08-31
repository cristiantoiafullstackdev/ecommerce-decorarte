import Link from 'next/link';
import prisma from '@/lib/prisma';

export default async function AdminDashboard() {
  const totalOrders = await prisma.order.count();
  const pendingOrders = await prisma.order.count({ where: { status: 'PENDING' } });
 
  return (
    <div className="space-y-6 font-sans text-stone-900">
      {/* Cabecera */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border-2 border-stone-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-stone-900">
            ⚡ Centro de Mando — DecorArte
          </h1>
          <p className="text-xs text-stone-500 font-medium mt-0.5">
            Resumen ejecutivo del taller y accesos rápidos de gestión.
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <Link
            href="/admin/orders"
            className="w-full sm:w-auto text-center px-5 py-3 bg-stone-900 text-[#FFF9F2] rounded-xl text-xs font-black uppercase tracking-wider hover:bg-stone-800 transition-all shadow-sm inline-flex items-center justify-center gap-3"
          >
            <span>Ver Órdenes</span>
          </Link>
        </div>
      </div>

      {/* Tarjetas de Métricas Macro */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
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

        {/* ⚙️ TARJETA DE CONFIGURACIÓN DE ENVÍOS */}
        <div className="bg-white p-6 rounded-2xl border-2 border-stone-200 shadow-xs space-y-2 flex flex-col justify-between md:col-span-3">
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