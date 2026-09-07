import Link from 'next/link';
import prisma from '@/lib/prisma';
import { DecorarteIsotype, GameStyles } from "@/app/components/iconos/DecorArteBrand";

export default async function AdminDashboard() {
  // Consultas reales a la base de datos (Acciones de compradores y taller)
  const totalOrders = await prisma.order.count();
  const pendingOrders = await prisma.order.count({ where: { status: 'PENDING' } });
  
  // Contamos productos con stock crítico (ej: 3 o menos unidades) y total de clientes
  const lowStockProducts = await prisma.product.count({ 
    where: { 
      isActive: true, 
      stock: { lte: 3 } 
    } 
  });
  const totalClients = await prisma.user.count({ where: { role: 'USER' } }).catch(() => 0);

  // Obtenemos las últimas 5 órdenes con su respectivo tipo limpio
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, email: true } }
    }
  }).catch(() => []);

  return (
    <div className="space-y-6 font-sans text-stone-900">
      <GameStyles />

      {/* CABECERA */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border-2 border-stone-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-stone-100 rounded-xl border border-stone-200 shrink-0">
            <DecorarteIsotype size={36} className="text-[#B57C38]" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#B57C38]">
              Centro de Mando
            </span>
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-stone-900 mt-0.5">
              Taller DecorArte
            </h1>
            <p className="text-xs text-stone-500 font-medium mt-0.5">
              Resumen en tiempo real de la actividad y pedidos de los compradores.
            </p>
          </div>
        </div>
        <div className="w-full sm:w-auto flex gap-2">
          <Link
            href="/admin/orders"
            className="w-full sm:w-auto text-center px-5 py-3 bg-[#1C1816] hover:bg-[#B57C38] text-[#FFC107] hover:text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm inline-flex items-center justify-center gap-2"
          >
            <span>📦 Ver Órdenes</span>
          </Link>
        </div>
      </div>

      {/* TARJETAS DE MÉTRICAS CLAVE (Acción de usuarios) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Órdenes Pendientes */}
        <div className="bg-white p-6 rounded-2xl border-2 border-stone-200 shadow-xs space-y-3 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-2xl">⏳</span>
              <span className="bg-amber-100 text-amber-800 text-[10px] font-black uppercase px-2.5 py-1 rounded-full border border-amber-300">
                Acción Requerida
              </span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 block mt-3">Órdenes Pendientes</span>
            <div className="text-3xl font-black text-amber-700 mt-1">{pendingOrders}</div>
          </div>
          <Link href="/admin/orders?status=PENDING" className="text-[11px] font-bold text-[#B57C38] hover:underline block pt-2">
            Revisar pagos pendientes &rarr;
          </Link>
        </div>

        {/* Stock Crítico en Taller */}
        <div className="bg-white p-6 rounded-2xl border-2 border-stone-200 shadow-xs space-y-3 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-2xl">🪵</span>
              <span className="bg-stone-100 text-stone-800 text-[10px] font-black uppercase px-2.5 py-1 rounded-full border border-stone-200">
                Inventario
              </span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 block mt-3">Stock Crítico o Agotado</span>
            <div className="text-3xl font-black text-stone-900 mt-1">{lowStockProducts} Piezas</div>
          </div>
          <Link href="/admin/products" className="text-[11px] font-bold text-[#B57C38] hover:underline block pt-2">
            Gestionar catálogo &rarr;
          </Link>
        </div>

        {/* Total Histórico y Clientes */}
        <div className="bg-white p-6 rounded-2xl border-2 border-stone-200 shadow-xs space-y-3 relative overflow-hidden flex flex-col justify-between sm:col-span-2 lg:col-span-1">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-2xl">📊</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-2.5 py-1 rounded-full border border-emerald-300">
                Historial
              </span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 block mt-3">Órdenes Totales / Clientes</span>
            <div className="text-2xl font-black text-stone-900 mt-1">{totalOrders} Pedidos <span className="text-sm font-medium text-stone-400">({totalClients} clientes)</span></div>
          </div>
          <Link href="/admin/orders" className="text-[11px] font-bold text-[#B57C38] hover:underline block pt-2">
            Ver todas las órdenes &rarr;
          </Link>
        </div>

      </div>

      {/* SECCIÓN INFERIOR: ÚLTIMAS ÓRDENES DE COMPRADORES */}
      <div className="bg-white rounded-2xl border-2 border-stone-200 shadow-xs p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider text-stone-900">Últimos Pedidos en el Taller</h2>
            <p className="text-xs text-stone-500">Actividad reciente generada por los compradores.</p>
          </div>
          <Link href="/admin/orders" className="text-xs font-black uppercase tracking-wider text-[#B57C38] hover:underline">
            Ver todo &rarr;
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-8 text-center text-xs text-stone-400 font-medium">
            No hay órdenes registradas todavía en el taller.
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {recentOrders.map((order) => (
              <div key={order.id} className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <span className="text-xs font-black text-stone-900">Orden #{order.id.slice(-6).toUpperCase()}</span>
                  <p className="text-[11px] text-stone-500">{order.user?.name || order.user?.email || "Comprador Anónimo"}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                    order.status === 'PENDING' ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}>
                    {order.status}
                  </span>
                  <span className="text-xs font-black text-stone-900">${order.total.toLocaleString("es-AR")}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}