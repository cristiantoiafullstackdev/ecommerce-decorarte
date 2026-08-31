// src/app/(shop)/checkout/orders/[id]/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { DecorarteIsotype, GameStyles } from '@/app/components/iconos/DecorArteBrand';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailsPage({ params }: Props) {
  const { id } = await params;

  if (!id || id === 'undefined') {
    notFound();
  }

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

  const productsSubtotal = order.items.reduce(
    (acc, item) => acc + Number(item.price) * item.quantity, 
    0
  );

  const isTransfer = String(order.paymentMethod).toLowerCase() === 'transferencia';
  const discount = isTransfer ? Math.round(productsSubtotal * 0.10) : 0;
  const shippingCost = Number(order.shipping) || 0;
  const verifiedTotal = (productsSubtotal - discount) + shippingCost;

  return (
    <main className="min-h-screen bg-[#F5F2EB] pt-32 sm:pt-36 pb-20 px-4 sm:px-6 md:px-8">
      <GameStyles />
      
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Encabezado Principal de la Orden */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 sm:p-6 rounded-2xl border-2 border-stone-200 shadow-sm">
          <div>
            <span className="text-[10px] text-[#B57C38] uppercase tracking-widest font-black bg-[#E2DCD0] px-2.5 py-1 rounded-md">
              Seguimiento del Taller
            </span>
            <h1 className="text-lg sm:text-2xl font-black text-[#1C1816] uppercase tracking-tight mt-3">
              Orden #{order.id.slice(0, 8)}...
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Registrada el {new Date(order.createdAt).toLocaleDateString('es-AR')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end gap-3 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-stone-100">
            <Link 
              href="/orders"
              className="w-full sm:w-auto text-center px-5 py-2.5 bg-[#1C1816] hover:bg-[#B57C38] text-[#FFC107] hover:text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all"
            >
              Volver a Mis Compras
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase text-stone-400 tracking-wider">Estado:</span>
              {order.status === 'PAID' ? (
                <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] sm:text-xs font-black px-3.5 py-1.5 rounded-xl uppercase tracking-wider">
                  ✓ Acreditado
                </span>
              ) : (
                <span className="bg-[#FFF9C4] text-[#F57F17] border border-[#FBC02D] text-[11px] sm:text-xs font-black px-3.5 py-1.5 rounded-xl uppercase tracking-wider">
                  ⌛ Pendiente
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
          
          {/* COLUMNA IZQUIERDA: DETALLE DE LOS PRODUCTOS Y PRECIOS */}
          <div className="md:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border-2 border-stone-200 shadow-sm space-y-6">
            <h3 className="text-xs font-black text-[#1C1816] uppercase tracking-widest pb-3 border-b border-stone-200">
              Piezas Solicitadas
            </h3>

            <div className="divide-y divide-stone-200 max-h-60 overflow-y-auto pr-1">
              {order.items.map((item) => (
                <div key={item.id} className="py-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-stone-200 bg-stone-50 shrink-0">
                      {item.product.images && item.product.images.length > 0 ? (
                        <Image src={item.product.images[0]} alt={item.product.title} fill sizes="48px" className="object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-stone-400">
                          <DecorarteIsotype size={20} />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-stone-900 line-clamp-1">{item.product.title}</h4>
                      <p className="text-[10px] text-stone-500 font-bold">Cantidad: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-[#1C1816] shrink-0">
                    ${(Number(item.price) * item.quantity).toLocaleString('es-AR')}
                  </span>
                </div>
              ))}
            </div>

            {/* Desglose de precios */}
            <div className="border-t-2 border-stone-200 pt-4 space-y-2.5 text-xs font-semibold text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal de Piezas</span>
                <span className="font-bold text-[#1C1816]">${productsSubtotal.toLocaleString('es-AR')}</span>
              </div>

              <div className="flex justify-between">
                <span>Costo de Envío Logístico</span>
                <span className="font-bold text-[#1C1816]">
                  {shippingCost === 0 ? "Gratis" : `$${shippingCost.toLocaleString('es-AR')}`}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 font-bold text-[11px]">
                  <span>Beneficio 10% Transferencia Bancaria</span>
                  <span>-${discount.toLocaleString('es-AR')}</span>
                </div>
              )}

              <div className="border-t border-stone-200 pt-3 flex justify-between text-base font-black text-[#1C1816]">
                <span>Total de la Orden</span>
                <span className="text-base sm:text-lg font-black text-[#B57C38]">${verifiedTotal.toLocaleString('es-AR')}</span>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: DIRECCIÓN DE DESPACHO Y CONTACTO */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-white p-5 sm:p-6 rounded-2xl border-2 border-stone-200 shadow-sm space-y-4">
              <h3 className="text-xs font-black text-[#1C1816] uppercase tracking-widest pb-3 border-b border-stone-200">
                Información de Entrega
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase tracking-wider">Destinatario</span>
                  <span className="font-bold text-stone-800">{order.firstName} {order.lastName}</span>
                </div>

                <div>
                  <span className="text-stone-400 block text-[10px] uppercase tracking-wider">Contacto</span>
                  <span className="font-medium text-stone-800 break-all">{order.email}</span>
                  <span className="block text-stone-500 mt-0.5">Tel/WA: {order.phone}</span>
                </div>

                <div>
                  <span className="text-stone-400 block text-[10px] uppercase tracking-wider">Dirección de Despacho</span>
                  <p className="font-medium text-stone-800">{order.address}</p>
                  <p className="text-stone-500">
                    {order.city}, {order.province.toUpperCase()} (CP: {order.zipCode})
                  </p>
                </div>

                {order.notes && (
                  <div className="bg-[#FCF9F5] p-3 rounded-lg border border-stone-200 text-[11px] text-stone-600 italic">
                    &quot;{order.notes}&quot;
                  </div>
                )}
              </div>
            </div>

            <Link 
              href="/"
              className="block text-center bg-[#1C1816] hover:bg-[#B57C38] text-[#FFC107] hover:text-white py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm"
            >
              Volver a la Tienda
            </Link>
          </div>
        </div>
      </div>    
    </main>
  );
}