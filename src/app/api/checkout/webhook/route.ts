import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('🔔 Webhook de Mercado Pago recibido:', body);

    // Verificamos si la notificación recibida corresponde a un evento de pago
    if (body.type === 'payment' || body.action === 'payment.created' || body.action === 'payment.updated') {
      const paymentId = body.data?.id || body.id;
      
      if (!paymentId) {
        return NextResponse.json({ error: 'No payment ID found in payload' }, { status: 400 });
      }

      // Consultamos a Mercado Pago para verificar la veracidad física de la transacción
      const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
        },
      });

      if (!mpResponse.ok) {
        console.log('❌ Error al consultar veracidad del pago en servidores de Mercado Pago');
        return NextResponse.json({ error: 'Failed to verify payment with MP API' }, { status: 400 });
      }

      const paymentData = await mpResponse.json();
      const orderId = paymentData.external_reference; // Recuperamos el ID de Neon que asociamos en la preferencia
      const status = paymentData.status;

      console.log(`📦 Datos del Webhook verificados - Orden: ${orderId}, Estado MP: ${status}`);

      // Si el pago fue aprobado de manera real, actualizamos de forma segura la orden en base Neon
      if (orderId && status === 'approved') {
        await prisma.order.update({
          where: { id: orderId },
          data: { status: 'PAID' },
        });
        console.log(`✅ ¡Felicidades! La orden ${orderId} fue actualizada a PAID en Neon exitosamente.`);
      }
    }

    // Mercado Pago exige un estado HTTP 200 para confirmar la recepción del aviso
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.log('❌ Error crítico procesando el webhook de Mercado Pago:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}



