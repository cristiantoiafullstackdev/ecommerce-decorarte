// src/actions/order-messages-actions.ts
'use server';

import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

export type OrderMessageItem = {
  id: string;
  orderId: string;
  sender: string;
  content: string;
  read: boolean;
  createdAt: Date;
};

type ActionResult = 
  | { ok: false; error: string }
  | { ok: true; newMessage: OrderMessageItem };

export const addOrderMessage = async (orderId: string, userId: string, message: string, senderRole: Role): Promise<ActionResult> => {
  try {
    if (!message.trim()) {
      return { ok: false, error: "El mensaje no puede estar vacío." };
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { userId: true }
    });

    if (!order) {
      return { ok: false, error: "La orden especificada no existe." };
    }

    if (senderRole === 'USER' && order.userId !== userId) {
      return { ok: false, error: "No tienes permiso para escribir en esta orden." };
    }

    const newMessage = await prisma.message.create({
      data: {
        orderId,
        sender: senderRole,
        content: message.trim(),
        read: false, // Por defecto no leído
      }
    });

    // 🚀 Revalidación eficiente para refrescar listados y contadores de alertas al instante
    revalidatePath('/orders');
    revalidatePath('/admin/orders');
    revalidatePath(`/orders/${orderId}`);
    revalidatePath(`/admin/orders/${orderId}`);

    return { ok: true, newMessage };
  } catch (error) {
    console.error("❌ Error al enviar mensaje de orden:", error);
    return { ok: false, error: "No se pudo enviar el mensaje." };
  }
};

export const getOrderMessages = async (orderId: string) => {
  try {
    const messages = await prisma.message.findMany({
      where: { orderId },
      orderBy: { createdAt: 'asc' }
    });

    return { ok: true, messages };
  } catch (error) {
    console.error("❌ Error al obtener mensajes:", error);
    return { ok: false, messages: [], message: "Error al cargar la bitácora." };
  }
};

// Marca como leídos los mensajes del bando contrario y actualiza las rutas
export const markMessagesAsRead = async (orderId: string, readerRole: Role) => {
  try {
    const senderToMark = readerRole === 'ADMIN' ? 'USER' : 'ADMIN';

    await prisma.message.updateMany({
      where: {
        orderId,
        sender: senderToMark,
        read: false,
      },
      data: {
        read: true,
      },
    });

    // 🚀 Revalidamos también aquí para que al entrar a ver los mensajes las alertas desaparezcan limpio
    revalidatePath('/orders');
    revalidatePath('/admin/orders');
    revalidatePath(`/orders/${orderId}`);
    revalidatePath(`/admin/orders/${orderId}`);

    return { ok: true };
  } catch (error) {
    console.error("❌ Error al marcar mensajes como leídos:", error);
    return { ok: false };
  }
};