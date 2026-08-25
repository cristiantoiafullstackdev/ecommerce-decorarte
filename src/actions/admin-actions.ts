//src/actions/admin-actions.ts
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { OrderStatus } from "@prisma/client";
import { sendOrderStatusEmail } from "@/lib/mail";

// Definimos interfaces estrictas para evitar el uso de 'any'
export interface AdminOrderProduct {
  id: string;
  title: string;
  images: string[];
}

export interface AdminOrderItem {
  id: string;
  quantity: number;
  price: number;
  product: AdminOrderProduct;
}

export interface AdminOrder {
  id: string;
  userId: string;
  subTotal: number;
  shipping: number;
  discount: number;
  total: number;
  status: string;
  paymentMethod: string;
  paymentId: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  zipCode: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  items: AdminOrderItem[];
}

/**
 * Trae todas las órdenes de la base de datos Neon ordenadas por fecha de creación descendente
 */
export async function getAdminOrders(): Promise<{ ok: boolean; orders: AdminOrder[]; error?: string }> {
  try {
    const rawOrders = await prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Mapeamos de forma segura para garantizar que los tipos coincidan con nuestra interfaz estricta
    const orders: AdminOrder[] = rawOrders.map((order) => ({
      ...order,
      subTotal: Number(order.subTotal),
      shipping: Number(order.shipping),
      discount: Number(order.discount),
      total: Number(order.total),
      items: order.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        price: Number(item.price),
        product: {
          id: item.product.id,
          title: item.product.title,
          images: item.product.images,
        },
      })),
    }));

    return { ok: true, orders };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Error desconocido al leer órdenes";
    console.error("❌ Error en getAdminOrders Server Action:", errorMessage);
    return { ok: false, orders: [], error: errorMessage };
  }
}

/**
 * Actualiza el estado de una orden específica de forma segura en Neon DB
 * y dispara la notificación por correo al cliente de forma síncrona/controlada.
 */
export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus
): Promise<{ ok: boolean; message: string }> {
  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: newStatus,
      },
      select: {
        email: true, 
      },
    });

    // Mapeo semántico de nombres legibles para la respuesta
    const statusNames: Record<OrderStatus, string> = {
      PENDING: "PENDIENTE",
      PAID: "PAGADA / LISTA",
      PREPARING: "EN PREPARACIÓN",
      SHIPPED: "DESPACHADA / EN VIAJE",
      DELIVERED: "ENTREGADA",
      CANCELLED: "CANCELADA"
    };

    // Disparamos el correo esperando el resultado para capturar cualquier error directamente en consola
    if (updatedOrder?.email) {
      console.log(`📤 [Admin Action] Intentando enviar mail a: ${updatedOrder.email} para la orden ${orderId}`);
      try {
        await sendOrderStatusEmail(updatedOrder.email, orderId, newStatus);
        console.log(`✅ [Admin Action] Correo procesado y enviado con éxito.`);
      } catch (mailError) {
        console.error("❌ [Admin Action] Error exacto al enviar el correo con Nodemailer:", mailError);
      }
    } else {
      console.log("⚠️ La orden no tiene un email asociado.");
    }

    // Revalidamos los datos de las rutas afectadas para refrescar el panel
    revalidatePath("/admin");
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath(`/checkout/orders/${orderId}`);

    return { 
      ok: true, 
      message: `El estado de la orden fue actualizado a "${statusNames[newStatus]}" con éxito.` 
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Error desconocido al actualizar";
    console.error(`❌ Error actualizando orden ${orderId}:`, errorMessage);
    return { ok: false, message: "No se pudo actualizar el estado de la orden en el servidor." };
  }
}