import PaymentButton from "@/app/components/ui/checkout/PaymentButton";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { DecorarteIsotype } from "@/app/components/iconos/DecorArteBrand";

// 1. Inicializamos el SDK oficial de Mercado Pago con tu Token seguro del .env
const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || "",
});

interface Props {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function PaymentPage({ searchParams }: Props) {
  console.log("🚀 ¡LLEGAMOS A LA PÁGINA DE PAGO! searchParams:", await searchParams);
  // En Next.js 15+ los searchParams se manejan de forma asíncrona
  const { orderId } = await searchParams;

  if (!orderId) {
    notFound(); // Si entran sin ID, Next.js tira un 404 limpio
  }

  // 2. Buscamos la orden fresca en Neon con todos sus productos vinculados
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

  // Si la orden no existe en tu base de datos, mostramos 404
  if (!order) {
    notFound();
  }

  // Si la orden ya fue pagada previamente, no dejamos que vuelvan a pagar
  if (order.status === "PAID") {
    return (
      <div className="min-h-screen bg-[#F5F2EB] flex flex-col items-center justify-center pt-24 text-center">
        <div className="text-emerald-600 mb-4">✓</div>
        <h1 className="text-xl font-black uppercase text-[#1C1816]">Esta orden ya fue abonada</h1>
        <p className="text-xs text-stone-600 mt-1">Podés seguir el estado desde tu perfil de usuario.</p>
      </div>
    );
  }

  let preferenceId = "";

  try {
    // 3. Estructuramos la Preferencia de Pago para Mercado Pago
    const preference = new Preference(mpClient);
    
    const response = await preference.create({
      body: {
        // Mapeamos los productos artesanales reales que están en la orden de Neon
        items: order.items.map((item) => ({
          id: item.productId,
          title: item.product.title,
          quantity: item.quantity,
          unit_price: Number(item.price), // Mercado Pago exige formato numérico plano
          currency_id: "ARS",
        })),
        // Sumamos el costo de envío como un ítem de servicio adicional
        shipments: {
          cost: Number(order.shipping),
          mode: "not_specified",
        },
        // Configuramos a dónde vuelve el cliente al terminar de pagar
        back_urls: {
          success: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/checkout/success-mp`,
          failure: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/checkout/payment?orderId=${orderId}&status=failed`,
          pending: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/checkout/payment?orderId=${orderId}&status=pending`,
        },
        auto_return: "approved",
        external_reference: order.id, // Guardamos el ID de Neon para reconocer el pago después
      },
    });

    preferenceId = response.id || "";
  } catch (error) {
    console.error("❌ Error generando la preferencia de Mercado Pago:", error);
  }

  return (
    <main className="min-h-screen bg-[#F5F2EB] pt-36 pb-20 px-4">
      <div className="max-w-md mx-auto bg-white border-2 border-stone-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
        
        <div className="text-center">
          <div className="text-[#B57C38] flex justify-center mb-3">
            <DecorarteIsotype size={40} />
          </div>
          <span className="text-[10px] text-[#B57C38] uppercase tracking-widest font-black bg-[#E2DCD0] px-2.5 py-1 rounded-md">
            Paso Final
          </span>
          <h1 className="text-xl font-black text-[#1C1816] uppercase tracking-tight mt-3">
            Procesar Pago Seguro
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Estás por abonar la orden de compra en el taller de DecorArte.
          </p>
        </div>

        <div className="bg-[#FCF9F5] p-4 rounded-xl border border-stone-150 space-y-2 text-xs">
          <div className="flex justify-between font-medium text-stone-600">
            <span>ID de Orden:</span>
            <span className="font-mono text-stone-900 select-all">{order.id.slice(0, 8)}...</span>
          </div>
          <div className="flex justify-between font-medium text-stone-600">
            <span>Destinatario:</span>
            <span className="font-bold text-stone-900">{order.firstName} {order.lastName}</span>
          </div>
          <div className="border-t border-stone-200 my-2 pt-2 flex justify-between text-sm font-black text-[#1C1816]">
            <span>Monto Total:</span>
            <span className="text-base text-[#B57C38]">${order.total.toLocaleString("es-AR")}</span>
          </div>
        </div>

        <div className="pt-2">
          {preferenceId ? (
            <div className="text-center space-y-3">
              <p className="text-[11px] text-stone-500 italic">
                Acá abajo va a aparecer el botón oficial en el siguiente paso...
              </p>
              <div className="text-center space-y-3">
                <PaymentButton preferenceId={preferenceId} />
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 text-red-800 text-xs font-bold rounded-xl p-4 text-center">
              ⚠️ No se pudo conectar con Mercado Pago. Por favor, reintentá en unos minutos.
            </div>
          )}
        </div>

      </div>
    </main>
  );
}