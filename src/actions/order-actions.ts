'use server';

import prisma from "@/lib/prisma";
import { PaymentMethod } from "@prisma/client";

interface OrderItemInput {
  productId: string;
  quantity: number;
  price: number;
}

interface OrderInput {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  zipCode: string;
  notes?: string;
  paymentMethod: 'mercadopago' | 'transferencia'; // 1. AGREGADO EN INPUT
  items: OrderItemInput[];
}

export const createOrder = async (orderData: OrderInput) => {
  try {
    const { items, userId, paymentMethod, ...shippingData } = orderData;
    
    // 1. Validar productos y calcular precios reales desde el servidor
    let subTotal = 0;    
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: items.map(i => i.productId) } }
    });

    for (const item of items) {
      const dbProduct = dbProducts.find(p => p.id === item.productId);
      if (!dbProduct) {
        throw new Error(`La pieza artesanal con ID ${item.productId} ya no está disponible.`);
      }      
      if (dbProduct.stock < item.quantity) {
        throw new Error(`Stock insuficiente en taller para: "${dbProduct.title}". Disponibles: ${dbProduct.stock}`);
      }
      subTotal += dbProduct.price * item.quantity;
    }

    const shipping = shippingData.province === 'cordoba' ? 4500 : 8500;
    
    // 2. CALCULAR DESCUENTO SEGÚN MÉTODO DE PAGO
    const discount = paymentMethod === 'transferencia' ? Math.round(subTotal * 0.10) : 0;
    const total = subTotal + shipping - discount;

    // 3. Transacción Atómica en Neon
    const order = await prisma.$transaction(async (tx) => {
      
      const newOrder = await tx.order.create({
        data: {
          userId: userId,
          subTotal: subTotal,
          shipping: shipping,
          discount: discount, // Enviamos el descuento a la base de datos
          total: total,
          status: 'PENDING', 
          
          // Mapeamos el Enum correspondiente para la BD
          paymentMethod: paymentMethod === 'transferencia' ? PaymentMethod.TRANSFERENCIA : PaymentMethod.MERCADOPAGO,
          
          firstName: shippingData.firstName,
          lastName: shippingData.lastName,
          email: shippingData.email,
          phone: shippingData.phone,
          address: shippingData.address,
          city: shippingData.city,
          province: shippingData.province,
          zipCode: shippingData.zipCode,
          notes: shippingData.notes,

          items: {
            create: items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: dbProducts.find(p => p.id === item.productId)!.price
            }))
          }
        }
      });

      // 4. Descontar stock real en el taller
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }

      return newOrder;
    });

    return {
      ok: true,
      orderId: order.id,
      message: "Orden de compra congelada en base de datos de forma exitosa."
    };

  } catch (error) {
    console.error("❌ Error crítico en createOrder Action:", error);
    const message = error instanceof Error ? error.message : String(error);
    return {
      ok: false,
      message: message || "Ocurrió un error interno en el servidor."
    };
  }
};