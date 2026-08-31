//src/app/(shop)/checkout/payment/page.tsx
import PaymentButton from "@/app/components/ui/checkout/PaymentButton";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { DecorarteIsotype } from "@/app/components/iconos/DecorArteBrand";

export const dynamic = 'force-dynamic';

interface Props {
  searchParams: Promise<{ orderId?: string }>;
}

function buildAbsoluteUrl(path: string): string {
  const envUrl = process.env.NEXTAUTH_URL;
  const baseUrl = (envUrl && envUrl.trim() !== "") ? envUrl.trim() : "http://localhost:3000";
  
  const cleanBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  
  return `${cleanBase}${cleanPath}`;
}

export default async function PaymentPage({ searchParams }: Props) {
  const { orderId } = await searchParams;

  if (!orderId) {
    notFound(); 
  }

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

  if (!order) {
    notFound();
  }

  if (order.status === "PAID") {
    return (
      <div className="min-h-screen bg-[#F5F2EB] flex flex-col items-center justify-center pt-24 px-4 text-center">
        <div className="text-emerald-600 text-2xl mb-4 font-bold">✓</div>
        <h1 className="text-lg sm:text-xl font-black uppercase text-[#1C1816]">Esta orden ya fue abonada</h1>
        <p className="text-xs text-stone-600 mt-1">Podés seguir el estado desde tu perfil de usuario.</p>
      </div>
    );
  }

  let preferenceId = "";

  try {
    const mpClient = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || "",
    });

    const successUrl = buildAbsoluteUrl("/checkout/success-mp");
    const failureUrl = buildAbsoluteUrl(`/checkout/payment?orderId=${orderId}&status=failed`);
    const pendingUrl = buildAbsoluteUrl(`/checkout/payment?orderId=${orderId}&status=pending`);

    const isLocalhost = successUrl.includes("localhost") || successUrl.includes("127.0.0.1");

    const preference = new Preference(mpClient);
    
    const response = await preference.create({
      body: {
        items: order.items.map((item) => ({
          id: item.productId,
          title: item.product.title,
          quantity: item.quantity,
          unit_price: Number(item.price),
          currency_id: "ARS",
        })),
        shipments: {
          cost: Number(order.shipping),
          mode: "not_specified",
        },
        back_urls: {
          success: successUrl,
          failure: failureUrl,
          pending: pendingUrl,
        },
        ...(isLocalhost ? {} : { auto_return: "approved" }),
        external_reference: order.id,
      },
    } as unknown as Parameters<Preference["create"]>[0]);

    preferenceId = response.id || "";
  } catch (error) {
    console.log("❌ Error generando la preferencia de Mercado Pago:", error);
  }

  return (
    <main className="min-h-screen bg-[#F5F2EB] pt-32 sm:pt-36 pb-20 px-4">
      <div className="max-w-md mx-auto bg-white border-2 border-stone-200 rounded-2xl p-5 sm:p-8 shadow-sm space-y-6">
        
        <div className="text-center">
          <div className="text-[#B57C38] flex justify-center mb-3">
            <DecorarteIsotype size={40} />
          </div>
          <span className="text-[10px] text-[#B57C38] uppercase tracking-widest font-black bg-[#E2DCD0] px-2.5 py-1 rounded-md">
            Paso Final
          </span>
          <h1 className="text-lg sm:text-xl font-black text-[#1C1816] uppercase tracking-tight mt-3">
            Procesar Pago Seguro
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Estás por abonar la orden de compra en el taller de DecorArte.
          </p>
        </div>

        <div className="bg-[#FCF9F5] p-4 rounded-xl border border-stone-200 space-y-2 text-xs">
          <div className="flex justify-between font-medium text-stone-600 gap-2">
            <span>ID de Orden:</span>
            <span className="font-mono text-stone-900 select-all truncate">{order.id.slice(0, 8)}...</span>
          </div>
          <div className="flex justify-between font-medium text-stone-600 gap-2">
            <span>Destinatario:</span>
            <span className="font-bold text-stone-900 truncate">{order.firstName} {order.lastName}</span>
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
                Hacé clic en el botón oficial para continuar en la plataforma de Mercado Pago:
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