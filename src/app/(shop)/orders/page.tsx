// src/app/(shop)/orders/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { GameStyles } from '@/app/components/iconos/DecorArteBrand';
import { OrderStatus } from '@prisma/client';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

function getOrderStatusBadge(status: OrderStatus) {
  switch (status) {
    case OrderStatus.PAID:
      return <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">Pagado</span>;
    case OrderStatus.PREPARING:
      return <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">En Preparación</span>;
    case OrderStatus.SHIPPED:
      return <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-800 border border-indigo-200">Enviado</span>;
    case OrderStatus.DELIVERED:
      return <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-200">Entregado</span>;
    case OrderStatus.CANCELLED:
      return <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-red-100 text-red-800 border border-red-200">Cancelado</span>;
    case OrderStatus.PENDING:
    default:
      return <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">Pendiente de Pago</span>;
  }
}

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect('/auth/login');
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      messages: {
        where: { sender: 'ADMIN', read: false }, // 👈 Solo traemos mensajes no leídos del taller
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  });

  const hasOrders = orders.length > 0;

  const pendingMessagesCount = orders.filter(order => order.messages.length > 0).length;

  return (
    <main className="min-h-screen bg-[#F5F2EB] pt-36 pb-20 px-4 md:px-8">
      <GameStyles />
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Encabezado */}
        <div className="bg-[#FCF9F5] border-2 border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-black text-[#1C1816] uppercase tracking-wider">Mis Compras</h1>
              {pendingMessagesCount > 0 && (
                <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md animate-pulse">
                  {pendingMessagesCount} {pendingMessagesCount === 1 ? 'mensaje nuevo del taller' : 'mensajes nuevos del taller'}
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 uppercase tracking-widest mt-1">Historial y seguimiento de tus pedidos en taller</p>
          </div>
          <Link 
            href="/"
            className="px-5 py-2.5 bg-[#1C1816] hover:bg-[#B57C38] text-[#FFC107] hover:text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all"
          >
            Volver a la Tienda
          </Link>
        </div>

        {/* Listado de Órdenes */}
        {!hasOrders ? (
          <div className="bg-[#FCF9F5] border-2 border-stone-200 rounded-2xl p-12 text-center flex flex-col items-center gap-4 shadow-sm">
            <span className="text-4xl">📦</span>
            <p className="text-xs font-bold text-stone-700 uppercase tracking-wider">Aún no registras ninguna compra en DecorArte</p>
            <Link 
              href="/"
              className="px-6 py-3 bg-[#C84B31] text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-[#b03f27] transition-colors shadow-sm"
            >
              Explorar Catálogo
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const hasNewMessageFromAdmin = order.messages.length > 0;

              return (
                <div 
                  key={order.id} 
                  className={`relative bg-[#FCF9F5] border-2 rounded-2xl p-6 shadow-sm flex flex-col gap-5 transition-all ${
                    hasNewMessageFromAdmin ? 'border-red-500 bg-red-50/20' : 'border-stone-200'
                  }`}
                >
                  
                  {/* Aviso de mensaje nuevo flotante */}
                  {hasNewMessageFromAdmin && (
                    <div className="absolute -top-3 right-6 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-md uppercase tracking-wider animate-bounce flex items-center gap-1.5 border border-white">
                      <span>💬 ¡Nuevo mensaje del taller!</span>
                    </div>
                  )}

                  {/* Cabecera de la Orden */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4 border-b border-stone-200">
                    <div>
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">Pedido ID</span>
                      <span className="text-xs font-black text-[#1C1816]">#{order.id.split('-')[0].toUpperCase()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">Fecha</span>
                      <span className="text-xs font-bold text-stone-700">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-1">Estado Pedido</span>
                      {getOrderStatusBadge(order.status)}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">Total Abonado</span>
                      <span className="text-xs font-black text-[#C84B31]">${Number(order.total).toLocaleString('es-AR')}</span>
                    </div>
                  </div>

                  {/* Lista de Productos del Pedido */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest block">Piezas en este pedido:</span>
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 bg-white/70 p-3 rounded-xl border border-stone-200">
                        <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                          <Image 
                            src={item.product.images[0] ? (item.product.images[0].startsWith('http') ? item.product.images[0] : `/products/${item.product.images[0]}`) : '/placeholder.jpg'} 
                            alt={item.product.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-black text-stone-800 uppercase tracking-tight truncate">{item.product.title}</h4>
                          <p className="text-[10px] text-stone-500 font-bold mt-0.5">Cantidad: {item.quantity} × ${Number(item.price).toLocaleString('es-AR')}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Envío y Notas */}
                  <div className="bg-stone-100/60 p-3.5 rounded-xl border border-stone-200/80 text-[11px] text-stone-600 flex flex-col sm:flex-row justify-between gap-2">
                    <div>
                      <span className="font-bold text-stone-800 uppercase text-[9px] block">Envío a:</span>
                      <span>{order.address}, {order.city} ({order.province})</span>
                    </div>
                    <div>
                      <span className="font-bold text-stone-800 uppercase text-[9px] block">Método de Pago:</span>
                      <span className="uppercase font-semibold">{order.paymentMethod}</span>
                    </div>
                  </div>

                  {/* Botón de Acceso Directo */}
                  <div className="pt-2 flex justify-end">
                    <Link
                      href={`/checkout/orders/${order.id}`}
                      className={`w-full sm:w-auto text-center px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 ${
                        hasNewMessageFromAdmin 
                          ? 'bg-red-600 hover:bg-red-700 text-white shadow-md' 
                          : 'bg-[#1C1816] hover:bg-[#B57C38] text-[#FFC107] hover:text-white'
                      }`}
                    >
                      <span>{hasNewMessageFromAdmin ? '💬 Ver respuesta del taller' : '💬 Ver Detalle y Chatear con el Taller'}</span>
                    </Link>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </main>
  );
}