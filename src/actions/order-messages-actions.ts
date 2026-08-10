'use server';

import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

// Definimos el tipo de mensaje para que TypeScript no titubee
export type OrderMessageItem = {
  id: string;
  orderId: string;
  sender: Role;
  message: string;
  createdAt: Date;
};

type ActionResult = 
  | { ok: false; error: string }
  | { ok: true; newMessage: OrderMessageItem };

// Enviar un mensaje nuevo (sirve tanto para el Admin como para el Usuario)
export const addOrderMessage = async (orderId: string, userId: string, message: string, senderRole: Role): Promise<ActionResult> => {
  try {
    if (!message.trim()) {
      return { ok: false, error: "El mensaje no puede estar vacío." };
    }

    // Validar que la orden pertenezca al usuario (si es cliente) o que exista (si es admin)
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

    const newMessage = await prisma.orderMessage.create({
      data: {
        orderId,
        sender: senderRole,
        message: message.trim(),
      }
    });

    return { ok: true, newMessage };
  } catch (error) {
    console.error("❌ Error al enviar mensaje de orden:", error);
    return { ok: false, error: "No se pudo enviar el mensaje." };
  }
};

// Obtener todos los mensajes de una orden específica
export const getOrderMessages = async (orderId: string) => {
  try {
    const messages = await prisma.orderMessage.findMany({
      where: { orderId },
      orderBy: { createdAt: 'asc' }
    });

    return { ok: true, messages };
  } catch (error) {
    console.error("❌ Error al obtener mensajes:", error);
    return { ok: false, messages: [], message: "Error al cargar la bitácora." };
  }
};