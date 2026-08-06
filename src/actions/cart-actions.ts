//src/actions/cart-actions.ts
'use server';

import prisma from '@/lib/prisma'; // Asegúrate de que esta sea la ruta de tu cliente de prisma

// 1. Obtener el carrito actual del usuario desde la BD
export const getUserCart = async (userId: string) => {
  try {
    if (!userId) return [];

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    if (!cart) return [];

    // Mapeamos al formato que usa tu CartItem del frontend
    return cart.items.map((item) => ({
      id: item.product.id,
      slug: item.product.slug,
      title: item.product.title,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.images[0] || '',
      stock: item.product.stock,
      categoryName: item.product.category.name,
    }));
  } catch (error) {
    console.log(error);
    return [];
  }
};

// 2. Agregar o actualizar un producto en el carrito del usuario (BD)
export const upsertCartItem = async (userId: string, productId: string, quantity: number) => {
  try {
    if (!userId) return;

    // Buscamos o creamos el carrito del usuario
    let cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    // Verificamos si el producto ya existe en los items del carrito
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (existingItem) {
      // Si ya existe, actualizamos la cantidad
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity },
      });
    } else {
      // Si no existe, lo creamos
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// 3. Remover un producto del carrito en la BD
export const removeCartItemAction = async (userId: string, productId: string) => {
  try {
    if (!userId) return;

    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) return;

    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        productId,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

// 4. Vaciar completamente el carrito en la BD (útil al confirmar compra)
export const clearUserCart = async (userId: string) => {
  try {
    if (!userId) return;

    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) return;

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
  } catch (error) {
    console.log(error);
  }
};