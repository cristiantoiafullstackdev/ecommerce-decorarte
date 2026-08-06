//src/actions/order-actions.ts

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
  paymentMethod: 'mercadopago' | 'transferencia';
  items: OrderItemInput[];
}

export const createOrder = async (orderData: OrderInput) => {
  try {
    const { items, userId, paymentMethod, ...shippingData } = orderData;
    
    // 1. VALIDACIÓN DE NEGOCIO: ¿Tiene una orden pendiente de pago?
    const existingPendingOrder = await prisma.order.findFirst({
      where: {
        userId: userId,
        status: 'PENDING'
      },
      select: { id: true }
    });

    if (existingPendingOrder) {
      const shortId = existingPendingOrder.id.slice(0, 8).toUpperCase();
      throw new Error(`Tenés un pedido pendiente de pago (#${shortId}). Debés completarlo o cancelarlo antes de iniciar una nueva compra.`);
    }

    // 2. Validar productos y calcular precios reales desde el servidor
    let subTotal = 0;    
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: items.map(i => i.productId) } }
    });

    for (const item of items) {
      const dbProduct = dbProducts.find(p => p.id === item.productId);
      if (!dbProduct) {
        throw new Error(`La pieza artesanal con ID ${item.productId} ya no está disponible.`);
      }       
      // Nota: Validamos que exista stock general en taller, pero NO lo descontamos hasta que pague
      if (dbProduct.stock < item.quantity) {
        throw new Error(`Stock insuficiente en taller para: "${dbProduct.title}". Disponibles: ${dbProduct.stock}`);
      }
      subTotal += dbProduct.price * item.quantity;
    }

    const shipping = shippingData.province === 'cordoba' ? 4500 : 8500;
    
    // 3. CALCULAR DESCUENTO SEGÚN MÉTODO DE PAGO
    const discount = paymentMethod === 'transferencia' ? Math.round(subTotal * 0.10) : 0;
    const total = subTotal + shipping - discount;

    // 4. Transacción Atómica en Neon
    const order = await prisma.$transaction(async (tx) => {
      
      const newOrder = await tx.order.create({
        data: {
          userId: userId,
          subTotal: subTotal,
          shipping: shipping,
          discount: discount,
          total: total,
          status: 'PENDING', 
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

      // 5. VACIAR EL CARRITO DEL USUARIO PARA EVITAR DUPLICADOS
      const userCart = await tx.cart.findUnique({
        where: { userId: userId }
      });

      if (userCart) {
        await tx.cartItem.deleteMany({
          where: { cartId: userCart.id }
        });
      }

      return newOrder;
    });

    return {
      ok: true,
      orderId: order.id,
      message: "Orden de compra generada de forma exitosa."
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

export const getOrdersByUser = async (userId: string) => {
  try {
    if (!userId) {
      return { ok: false, orders: [], message: "Usuario no autenticado" };
    }
    const orders = await prisma.order.findMany({
      where: {
        userId: userId, // 👈 Blindaje estricto por ID de usuario en la base de datos
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                title: true,
                images: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { ok: true, orders };
  } catch (error) {
    console.error("❌ Error al obtener órdenes del usuario:", error);
    return { ok: false, message: 'No se pudieron cargar las compras' };
  }
};