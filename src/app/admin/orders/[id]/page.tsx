import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';
import { updateOrderStatus } from '@/actions/admin-actions';
import { DecorarteIsotype, GameStyles } from '@/app/components/iconos/DecorArteBrand';

// Forzamos que la página se renderice siempre en tiempo de ejecución para captar cambios frescos de base de datos
export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: Props) {
  // Resolvemos correctamente los parámetros asíncronos para cumplir con Next.js 15+
  const { id } = await params;

  if (!id || id === 'undefined' || id === '[id]') {
    notFound();
  }

  // Consultamos directamente tu base de datos Neon mediante Prisma con todas sus relaciones
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  const friendlyId = order.id.slice(0, 8).toUpperCase();
  const isTransfer = String(order.paymentMethod).toLowerCase() === 'transferencia';
  const discount = isTransfer ? Math.round(Number(order.total) * 0.10) : 0;
  const finalTotal = Number(order.total);

  // Mapeo estricto de badges alineados con el enum completo de tu base de datos
  const statusLabels: Record<OrderStatus, { text: string; color: string; bg: string }> = {
    PENDING: { text: 'Pendiente de Pago', color: 'text-amber-700 border-amber-300', bg: 'bg-amber-50' },
    PAID: { text: 'Pago Acreditado / Listo', color: 'text-emerald-700 border-emerald-300', bg: 'bg-emerald-50' },
    PREPARING: { text: 'En Preparación & Calidad', color: 'text-blue-700 border-blue-300', bg: 'bg-blue-50' },
    SHIPPED: { text: 'Despachado / En Viaje', color: 'text-indigo-700 border-indigo-300', bg: 'bg-indigo-50' },
    DELIVERED: { text: 'Entregado al Cliente', color: 'text-stone-700 border-stone-300', bg: 'bg-stone-100' },
    CANCELLED: { text: 'Pedido Cancelado', color: 'text-red-700 border-red-300', bg: 'bg-red-50' }
  };

  const currentStatus = statusLabels[order.status] || { 
    text: order.status, 
    color: 'text-stone-700 border-stone-300', 
    bg: 'bg-stone-50' 
  };

  // Definición secuencial para el Timeline Tracker (Stepper)
  const steps: { key: OrderStatus; label: string; desc: string }[] = [
    { key: 'PENDING', label: 'Pago Pendiente', desc: 'Esperando acreditación' },
    { key: 'PAID', label: 'Acreditado', desc: 'Listo para procesar' },
    { key: 'PREPARING', label: 'Preparación', desc: 'Control & herrajes' },
    { key: 'SHIPPED', label: 'Despachado', desc: 'En manos del transporte' },
    { key: 'DELIVERED', label: 'Entregado', desc: 'Finalizado' }
  ];

  // Encontrar el índice del paso actual para pintar el progreso
  const currentStepIndex = steps.findIndex(step => step.key === order.status);

  // Server Action inline para procesar el cambio de estado con recarga instantánea de Next.js
  const changeStatusAction = async (formData: FormData) => {
    "use server";
    const targetStatus = formData.get("status") as OrderStatus;
    if (targetStatus) {
      await updateOrderStatus(id, targetStatus);
    }
  };

  return (
    <div className="space-y-6">
      <GameStyles />
      
      {/* Encabezado Técnico integrado al Layout Administrativo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border-2 border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">
              Hoja de Ruta / Taller
            </span>
            <span className={`px-2.5 py-0.5 rounded-md border text-[9px] font-black uppercase tracking-wider ${currentStatus.bg} ${currentStatus.color}`}>
              {currentStatus.text}
            </span>
          </div>
          <h1 className="text-xl font-black text-[#1C1816] uppercase mt-1">
            Pedido #DA-{friendlyId} — {order.firstName} {order.lastName}
          </h1>
          <p className="text-[10px] text-stone-400 font-bold mt-0.5">
            Ingresado: {new Date(order.createdAt).toLocaleDateString('es-AR')} a las {new Date(order.createdAt).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}hs
          </p>
        </div>

        <Link
          href="/admin"
          className="px-4 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors text-stone-600 border border-stone-200 self-start md:self-auto"
        >
          🡐 Volver al Panel
        </Link>
      </div>

      {/* STEPPER VISUAL DE PROGRESO (UX PREMIUM) */}
      {order.status !== 'CANCELLED' && (
        <div className="bg-white p-6 rounded-2xl border-2 border-stone-200 shadow-xs">
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-4">
            {/* Línea de fondo decorativa para escritorio */}
            <div className="hidden md:block absolute left-4 right-4 top-1/2 h-0.5 bg-stone-100 -translate-y-1/2 z-0" />
            
            {steps.map((step, index) => {
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;

              return (
                <div key={step.key} className="flex md:flex-col items-center gap-4 md:text-center z-10 w-full md:w-1/5 relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 font-bold text-xs shrink-0
                    ${isCompleted 
                      ? 'bg-[#B57C38] border-[#B57C38] text-[#FFF9F2] shadow-sm shadow-[#B57C38]/25' 
                      : 'bg-white border-stone-200 text-stone-400'
                    }
                    ${isCurrent ? 'ring-4 ring-amber-100 scale-105' : ''}
                  `}>
                    {isCompleted ? '✓' : index + 1}
                  </div>
                  <div className="space-y-0.5 text-left md:text-center">
                    <h4 className={`text-[10px] font-black uppercase tracking-wider ${isCompleted ? 'text-[#1C1816]' : 'text-stone-400'}`}>
                      {step.label}
                    </h4>
                    <p className="text-[9px] font-bold text-stone-400 leading-none">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DETALLES DE DESPACHO Y CONTROL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* COLUMNA IZQUIERDA: Detalle de maderas y montos */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 rounded-2xl border-2 border-stone-200 shadow-xs space-y-4">
            <h2 className="text-[11px] font-black uppercase tracking-wider text-[#1C1816] border-b pb-2 border-stone-100">
              📦 Estructura de maderas solicitadas
            </h2>
            
            <div className="divide-y divide-stone-150">
              {order.items.map((item) => (
                <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-stone-200 bg-stone-50 shrink-0">
                      {item.product.images && item.product.images.length > 0 ? (
                        <Image src={item.product.images[0]} alt={item.product.title} fill className="object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-stone-400">
                          <DecorarteIsotype size={20} />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-stone-900 uppercase">{item.product.title}</h4>
                      <p className="text-[10px] text-stone-500 font-bold">Cantidad: {item.quantity} unidades</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-[#1C1816]">
                    ${(Number(item.price) * item.quantity).toLocaleString('es-AR')}
                  </span>
                </div>
              ))}
            </div>

            {/* Desglose Monetario del Pedido */}
            <div className="border-t-2 border-dashed border-stone-200 pt-4 space-y-2 max-w-xs ml-auto text-[11px] font-semibold text-stone-500 font-sans">
              <div className="flex justify-between">
                <span>Costo Logístico</span>
                <span className="font-bold text-stone-800">${Number(order.shipping).toLocaleString('es-AR')}</span>
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

        {/* COLUMNA DERECHA: Control de estados y Logística */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* PANEL DE CONTROL DE ESTADOS DIRECTO EN NEON */}
          <div className="bg-[#1C1816] text-[#FFF9F2] p-6 rounded-2xl border-2 border-stone-800 shadow-md space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#FFC107] border-b border-stone-800 pb-3">
              ⚡ Control de Hoja de Ruta
            </h3>
            
            <p className="text-[10px] text-stone-400 font-bold leading-relaxed">
              Selecciona el estado operativo correspondiente para actualizar los planos técnicos y la logística del pedido.
            </p>

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
                className="w-full py-3 bg-[#B57C38] hover:bg-[#96632B] text-[#FFF9F2] rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-[0_4px_0px_#96632B] active:translate-y-0.5 active:shadow-none"
              >
                Actualizar Estado
              </button>
            </form>
          </div>

          {/* Datos del Cliente y Despacho */}
          <div className="bg-white p-6 rounded-2xl border-2 border-stone-200 shadow-xs space-y-4">
            <h2 className="text-[11px] font-black uppercase tracking-wider text-[#1C1816] border-b pb-2 border-stone-100">
              🚚 Logística de Despacho
            </h2>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-stone-400 block text-[9px] uppercase font-bold">Destinatario</span>
                <span className="font-bold text-stone-800">{order.firstName} {order.lastName}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[9px] uppercase font-bold">Contacto Directo</span>
                <span className="font-medium text-stone-700 block select-all">{order.email}</span>
                <span className="font-medium text-stone-700 block">Tel: {order.phone}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[9px] uppercase font-bold">Destino</span>
                <p className="font-medium text-stone-800">{order.address}</p>
                <p className="text-stone-500 text-[11px]">
                  {order.city}, {order.province.toUpperCase()} (CP: {order.zipCode})
                </p>
              </div>
              {order.notes && (
                <div className="bg-[#FCF9F5] p-3 rounded-xl border border-stone-150 text-[10px] text-stone-600 italic">
                  &quot;{order.notes}&quot;
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}