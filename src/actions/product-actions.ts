'use server';

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Configuramos el mismo adaptador que usamos en el seed para mantener consistencia
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

/**
 * Obtiene todos los productos de la base de datos
 */
export const getPaginatedProducts = async () => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true, // Esto nos trae la información de la categoría asociada
      },
      orderBy: {
        createdAt: 'desc', // Los más nuevos primero
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
export const getCategories = async () => {
  try {
    return await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    return [];
  }
};