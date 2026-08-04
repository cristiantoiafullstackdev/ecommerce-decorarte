//src/app/actions/wishlist/wishlist-actions.ts

'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getUserFavorites(userId: string) {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      select: { productId: true },
    });
    return favorites.map((fav) => fav.productId);
  } catch (error) {
    console.error('Error al obtener favoritos:', error);
    return [];
  }
}

export async function toggleUserFavorite(userId: string, productId: string) {
  try {
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    if (existingFavorite) {
      await prisma.favorite.delete({
        where: { id: existingFavorite.id },
      });
    } else {
      await prisma.favorite.create({
        data: { userId, productId },
      });
    }

    revalidatePath('/favorites');
    return { success: true };
  } catch (error) {
    console.error('Error al cambiar favorito:', error);
    return { success: false, error };
  }
}