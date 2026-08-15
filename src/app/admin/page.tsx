// src/app/admin/page.tsx
import Link from 'next/link';
import prisma from '@/lib/prisma';

async function getPendingChatsCount(): Promise<number> {
  try {
    // Buscamos mensajes que no han sido leídos y fueron enviados por un USER
    const unreadMessagesCount = await prisma.message.count({
      where: {
        sender: 'USER',
        read: false,
      },
    });

    return unreadMessagesCount;
  } catch (error) {
    console.error("Error al calcular chats pendientes:", error);
    return 0;
  }
}


export default async function AdminDashboard() {
  const totalOrders = await prisma.order.count();
  const pendingOrders = await prisma.order.count({ where: { status: 'PENDING' } });
  const pendingChatsCount = await getPendingChatsCount();

  const chatLabel = pendingChatsCount === 1 ? 'mensaje nuevo' : 'mensajes nuevos';

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
            className="relative px-5 py-3 bg-stone-900 text-[#FFF9F2] rounded-xl text-xs font-black uppercase tracking-wider hover:bg-stone-800 transition-all shadow-sm inline-flex items-center gap-3"
          >
            <span>Ver Órdenes y Chats</span>
            
            {pendingChatsCount > 0 && (
              <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md animate-pulse">
                {pendingChatsCount} {chatLabel}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Tarjetas de Métricas Macro */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        {/* 💬 TARJETA DE CONVERSACIONES PENDIENTES */}
        <div className="bg-white p-6 rounded-2xl border-2 border-stone-200 shadow-xs space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Atención al Cliente</span>
              {pendingChatsCount > 0 && (
                <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
                  {pendingChatsCount} por responder
                </span>
              )}
            </div>
            <div className="text-lg font-black text-stone-900 mt-1">Chats por Responder</div>
          </div>
          <Link href="/admin/orders" className="text-[11px] font-bold text-[#B57C38] hover:underline block pt-1">
            Revisar bandeja de chat &rarr;
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