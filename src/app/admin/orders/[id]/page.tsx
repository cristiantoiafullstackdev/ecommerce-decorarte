// src/app/admin/orders/[id]/page.tsx
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import { OrderStatus } from '@prisma/client';
import { sendOrderStatusEmail } from '@/lib/mail';
import { DecorarteIsotype } from '@/app/components/iconos/DecorArteBrand';
import OrderItemsList from '@/app/components/admin/OrderItemsList';

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const resolvedParams = await params;
  const orderId = resolvedParams.id;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) notFound();

  const discount = order.discount ?? 0;
  const finalTotal = Number(order.total ?? 0);

  async function changeStatusAction(formData: FormData) {
    'use server';

    const newStatus = formData.get('status') as OrderStatus;

    if (newStatus && Object.values(OrderStatus).includes(newStatus)) {
      if (order?.status !== newStatus) {
        const updatedOrder = await prisma.order.update({
          where: { id: orderId },
          data: { status: newStatus },
        });

        if (updatedOrder?.email) {
          await sendOrderStatusEmail(
            updatedOrder.email,
            updatedOrder.id,
            updatedOrder.status
          );
        }
      }
    }

    redirect(`/admin/orders/${orderId}`);
  }

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
              <span className="text-[10px] font-black uppercase tracking-widest text-[#B57C38]">Hoja Técnica de Pedido</span>
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-stone-900 mt-0.5">
                Pedido #{order.id.split('-')[0].toUpperCase()}
              </h1>
            </div>
          </div>
          <Link
            href="/admin/orders"
            className="w-full sm:w-auto px-4 py-3 bg-[#1C1816] hover:bg-[#B57C38] text-[#FFC107] hover:text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-[0_4px_0px_#B57C38] active:translate-y-0.5 text-center shrink-0"
          >
            ← Volver al Listado
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* COLUMNA IZQUIERDA: DETALLE DE LOS PRODUCTOS Y DATOS */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Piezas Solicitadas con Paginación Integrada (Renderizado desde el componente cliente) */}
            <OrderItemsList items={order.items} />

            {/* Datos de Envío y Contacto */}
            <div className="bg-white p-6 rounded-2xl border-2 border-stone-200 shadow-xs space-y-4">
              <h2 className="text-[11px] font-black uppercase tracking-wider text-[#1C1816] border-b pb-2 border-stone-100">
                📦 Información de Despacho y Comprador
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-stone-700 font-medium">
                <div>
                  <p><strong className="text-stone-900 font-bold">Nombre:</strong> {order.firstName} {order.lastName}</p>
                  <p><strong className="text-stone-900 font-bold">Email:</strong> <span className="select-all">{order.email}</span></p>
                  <p><strong className="text-stone-900 font-bold">Teléfono:</strong> {order.phone}</p>
                </div>
                <div>
                  <p><strong className="text-stone-900 font-bold">Dirección:</strong> {order.address}</p>
                  <p><strong className="text-stone-900 font-bold">Ciudad / Prov:</strong> {order.city}, {order.province}</p>
                  <p><strong className="text-stone-900 font-bold">C.P.:</strong> {order.zipCode}</p>
                </div>
              </div>
              {order.notes && (
                <div className="mt-2 p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                  <strong className="text-stone-900 font-bold block mb-1">Notas del cliente:</strong> 
                  <span className="text-stone-600">{order.notes}</span>
                </div>
              )}
            </div>

            {/* Método de Pago y Resumen Monetario */}
            <div className="bg-white p-6 rounded-2xl border-2 border-stone-200 shadow-xs space-y-4">
              <h2 className="text-[11px] font-black uppercase tracking-wider text-[#1C1816] border-b pb-2 border-stone-100">
                💳 Método de Pago y Resumen Monetario
              </h2>
              <p className="text-xs">
                <strong className="text-stone-900 font-bold">Método de Pago: </strong>
                <span className="uppercase font-black text-[#B57C38]">
                  {order.paymentMethod}
                </span>
              </p>

              <div className="border-t-2 border-dashed border-stone-200 pt-4 space-y-2 max-w-xs ml-auto text-[11px] font-semibold text-stone-500">
                <div className="flex justify-between">
                  <span>Costo Logístico</span>
                  <span className="font-bold text-stone-800">${Number(order.shipping ?? 0).toLocaleString('es-AR')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200 font-bold text-[10px]">
                    <span>Bonificación Transferencia</span>
                    <span>-${discount.toLocaleString('es-AR')}</span>
                  </div>
                )}
                <div className="border-t border-stone-200 pt-2 flex justify-between text-xs font-black text-stone-900">
                  <span>Total Facturado</span>
                  <span className="text-sm font-black text-[#B57C38]">${finalTotal.toLocaleString('es-AR')}</span>
                </div>
              </div>
            </div>

          </div>

          {/* COLUMNA DERECHA: Control de estados */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#1C1816] text-[#FFF9F2] p-6 rounded-2xl border-2 border-stone-800 shadow-md space-y-4 sticky top-28">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#FFC107] border-b border-stone-800 pb-3">
                ⚡ Control de Hoja de Ruta
              </h3>
              
              <form action={changeStatusAction} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="status-select" className="block text-[9px] font-black uppercase tracking-widest text-stone-400">
                    Estado Operativo
                  </label>
                  <select
                    id="status-select"
                    name="status"
                    defaultValue={order.status}
                    className="w-full bg-stone-900 border-2 border-stone-800 text-[#FFF9F2] font-bold text-xs uppercase p-3 rounded-xl focus:border-[#B57C38] focus:outline-none transition-colors h-11 cursor-pointer"
                  >
                    <option value="PENDING">⌛ Pendiente de Pago</option>
                    <option value="PAID">✓ Pago Acreditado</option>
                    <option value="PREPARING">🪵 En Preparación &amp; Calidad</option>
                    <option value="SHIPPED">🚚 Despachado / En Viaje</option>
                    <option value="DELIVERED">🏡 Entregado</option>
                    <option value="CANCELLED">❌ Cancelado / Dado de baja</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#B57C38] hover:bg-[#96632B] text-[#FFF9F2] rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-[0_4px_0px_#96632B] active:translate-y-0.5 text-center cursor-pointer"
                >
                  Actualizar Estado
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}