// src/app/admin/orders/[id]/page.tsx
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import { OrderStatus } from '@prisma/client';
import { sendOrderStatusEmail } from '@/lib/mail'; // <--- Importamos el servicio de correo

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  // 1. Resolvemos params
  const resolvedParams = await params;
  const orderId = resolvedParams.id;

  // 2. BUSQUEDA DE ORDEN
  const order = await prisma.order.findUnique({ 
    where: { id: orderId } 
  });

  if (!order) notFound();

  const discount = order.discount ?? 0;
  const finalTotal = Number(order.total ?? 0);

  // Server Action para actualizar el estado y enviar correo
  async function changeStatusAction(formData: FormData) {
    'use server';

    if (!order) return;

    const newStatus = formData.get('status') as OrderStatus;

    if (newStatus && Object.values(OrderStatus).includes(newStatus)) {
      // Verificamos si el estado cambió realmente para no enviar correos innecesarios
      if (order.status !== newStatus) {
        // 1. Actualizamos en la base de datos
        const updatedOrder = await prisma.order.update({
          where: { id: orderId },
          data: { status: newStatus },
        });

        // 2. Disparamos el correo electrónico si el usuario tiene un email registrado
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
    <div className="p-8 space-y-8 bg-[#FCF9F5] min-h-screen font-sans text-stone-900 max-w-7xl mx-auto">
      {/* Cabecera */}
      <div className="flex justify-between items-center border-b border-stone-200 pb-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#B57C38]">Hoja Técnica de Pedido</span>
          <h1 className="text-xl font-black uppercase tracking-wider text-stone-900">
            Pedido #{order.id.slice(-6)}
          </h1>
        </div>
        <Link
          href="/admin/orders"
          className="text-xs font-bold text-stone-600 hover:text-stone-900 underline"
        >
          &larr; Volver al Listado
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* COLUMNA IZQUIERDA: Detalle de Productos y Monetario */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border-2 border-stone-200 shadow-xs space-y-6">
          <h2 className="text-[11px] font-black uppercase tracking-wider text-[#1C1816] border-b pb-2 border-stone-100">
            🪵 Especificaciones del Pedido
          </h2>
          
          <div className="border-t-2 border-dashed border-stone-200 pt-4 space-y-2 max-w-xs ml-auto text-[11px] font-semibold text-stone-500 font-sans">
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

        {/* COLUMNA DERECHA: Control de estados */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#1C1816] text-[#FFF9F2] p-6 rounded-2xl border-2 border-stone-800 shadow-md space-y-4">
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
                  className="w-full bg-stone-900 border-2 border-stone-800 text-[#FFF9F2] font-bold text-xs uppercase p-3 rounded-xl focus:border-[#B57C38] focus:outline-none transition-colors h-11"
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
                className="w-full py-3 bg-[#B57C38] hover:bg-[#96632B] text-[#FFF9F2] rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-[0_4px_0px_#96632B]"
              >
                Actualizar Estado
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}