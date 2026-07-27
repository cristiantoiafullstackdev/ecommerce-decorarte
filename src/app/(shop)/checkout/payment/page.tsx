//src/app/(shop)/checkout/payment/page.tsx
import PaymentButton from "@/app/components/ui/checkout/PaymentButton";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { DecorarteIsotype } from "@/app/components/iconos/DecorArteBrand";

// 🚀 Fuerza a Next.js a leer el .env en tiempo de ejecución (crucial para producción y dev)
export const dynamic = 'force-dynamic';

interface Props {
  searchParams: Promise<{ orderId?: string }>;
}

// 🌐 Función utilitaria para garantizar URLs absolutas perfectas sin dobles barras "https://dominio.com//ruta"
function buildAbsoluteUrl(path: string): string {
  const envUrl = process.env.NEXTAUTH_URL;
  // Si no está definida, está vacía o solo contiene espacios, usamos localhost de fallback seguro
  const baseUrl = (envUrl && envUrl.trim() !== "") ? envUrl.trim() : "http://localhost:3000";
  
  // Saneamos barras dobles para que Mercado Pago no rechace la URL
  const cleanBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  
  return `${cleanBase}${cleanPath}`;
}

export default async function PaymentPage({ searchParams }: Props) {
  const { orderId } = await searchParams;

  if (!orderId) {
    notFound(); 
  }

  // 1. Buscamos la orden fresca en Neon con todos sus productos vinculados
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
      <div className="min-h-screen bg-[#F5F2EB] flex flex-col items-center justify-center pt-24 text-center">
        <div className="text-emerald-600 mb-4">✓</div>
        <h1 className="text-xl font-black uppercase text-[#1C1816]">Esta orden ya fue abonada</h1>
        <p className="text-xs text-stone-600 mt-1">Podés seguir el estado desde tu perfil de usuario.</p>
      </div>
    );
  }

  let preferenceId = "";

  try {
    // 2. Inicializamos el SDK dentro del flujo dinámico para asegurar la lectura del Token fresco
    const mpClient = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || "",
    });

    // 3. Construimos y saneamos las URLs de redirección de retorno de forma inmutable y limpia
    const successUrl = buildAbsoluteUrl("/checkout/success-mp");
    const failureUrl = buildAbsoluteUrl(`/checkout/payment?orderId=${orderId}&status=failed`);
    const pendingUrl = buildAbsoluteUrl(`/checkout/payment?orderId=${orderId}&status=pending`);

    console.log("🔗 URLs de Retorno Sanitizadas que se enviarán a MP:", {
      success: successUrl,
      failure: failureUrl,
      pending: pendingUrl
    });

    // 💡 Detectamos si estamos probando localmente para evitar que Mercado Pago rompa por las reglas de auto_return
    const isLocalhost = successUrl.includes("localhost") || successUrl.includes("127.0.0.1");

    // 4. Estructuramos la Preferencia usando estrictamente camelCase
    const preference = new Preference(mpClient);
    
    // 🔥 Usamos un doble casteo seguro 'as unknown as Parameters<...>[0]' al final del objeto.
    // Esto limpia cualquier inconsistencia de tipado interna del SDK de Mercado Pago sin usar 'any' ni 'never'.
   const response = await preference.create({
  body: {
    items: order.items.map((item) => ({
      id: item.productId,
      title: item.product.title,
      quantity: item.quantity,
      unit_price: Number(item.price),   // ✅ snake_case correcto
      currency_id: "ARS",               // ✅ snake_case correcto
    })),
    shipments: {
      cost: Number(order.shipping),
      mode: "not_specified",
    },
    back_urls: {                        // ✅ snake_case correcto
      success: successUrl,
      failure: failureUrl,
      pending: pendingUrl,
    },
    ...(isLocalhost ? {} : { auto_return: "approved" }), // ✅ snake_case correcto
    external_reference: order.id,       // ✅ snake_case correcto
  },
} as unknown as Parameters<Preference["create"]>[0]);


    preferenceId = response.id || "";
  } catch (error) {
    console.log("❌ Error generando la preferencia de Mercado Pago:");
    
    if (error && typeof error === "object") {
      console.log("Causa del fallo:", JSON.stringify(error, null, 2));
    } else {
      console.log(error);
    }
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