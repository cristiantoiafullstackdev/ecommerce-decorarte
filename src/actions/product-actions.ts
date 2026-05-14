'use server';

import prisma from "@/lib/prisma";
import { Product, Category } from "@prisma/client";

/**
 * Obtiene todos los productos de la base de datos
 */
export const getPaginatedProducts = async (): Promise<(Product & { category: Category })[]> => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return products;
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return [];
  }
};

/**
 * Obtiene todas las categorías para los filtros
 */
export const getCategories = async (): Promise<Category[]> => {
  try {
    return await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    return [];
  }
};

/**
 * Obtiene producto por Slug
 */
export const getProductBySlug = async (slug: string): Promise<(Product & { category: Category }) | null> => {
  try {
    console.log("Accediendo a la DB con slug:", slug);

    const product = await prisma.product.findFirst({
      where: { slug },
      include: { category: true },
    });

    if (!product) {
      console.log("⚠️ No se encontró nada en la DB para el slug:", slug);
    }

    return product;
  } catch (error) {
    console.error("Error en DB:", error);
    return null;
  }
};
