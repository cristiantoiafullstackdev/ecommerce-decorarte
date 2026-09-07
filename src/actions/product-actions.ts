"use server";

import prisma from "@/lib/prisma";
import { Product, Category, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export interface ProductInput {
  id?: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  categoryId: string;
}

export interface AdminProduct {
  categoryId: string;
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  slug: string;
  createdAt: Date;
  category?: { id: string; name: string } | null;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export const getPaginatedProducts = async (): Promise<(Product & { category: Category })[]> => {
  try {
    return await prisma.product.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return [];
  }
};

export const getCategories = async (): Promise<Category[]> => {
  try {
    return await prisma.category.findMany({ orderBy: { name: 'asc' } });
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    return [];
  }
};

export const getProductBySlug = async (slug: string): Promise<(Product & { category: Category }) | null> => {
  try {
    return await prisma.product.findFirst({
      where: { 
        slug,
        isActive: true, // <--- Evita que se vea si está inactivo
      },
      include: { category: true },
    });
  } catch (error) {
    console.error("Error en DB:", error);
    return null;
  }
};

export async function getAdminProducts(): Promise<{ ok: boolean; products: AdminProduct[]; error?: string }> {
  try {
    const rawProducts = await prisma.product.findMany({
      where: { isActive: true }, // <--- Vital para que los dados de baja no se listen en el panel
      orderBy: { createdAt: "desc" },
      include: { category: true }
    });

    const products: AdminProduct[] = rawProducts.map((p) => ({
      ...p,
      price: Number(p.price),
      stock: Number(p.stock),
    }));

    return { ok: true, products };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Error al leer productos";
    return { ok: false, products: [], error: errorMessage };
  }
}

export async function upsertProduct(data: ProductInput): Promise<{ ok: boolean; message: string }> {
  try {
// Validamos que la categoría exista en la base de datos
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId }
    });

    if (!category) {
      return { ok: false, message: "La categoría seleccionada no es válida." };
    }

// 2. Estructurar el objeto para Prisma...
    const productData = {
      title: data.title,
      description: data.description,
      price: data.price,
      stock: data.stock,
      slug: generateSlug(data.title),
      images: data.images,
      categoryId: data.categoryId
    };

    if (data.id) {
      await prisma.product.update({
        where: { id: data.id },
        data: productData as Prisma.ProductUpdateInput,
      });
    } else {
      await prisma.product.create({
        data: productData,
      });
    }

    revalidatePath("/admin/products");
    revalidatePath("/");

    return { ok: true, message: `El producto "${data.title}" se guardó correctamente.` };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";
    return { ok: false, message: `Error en base de datos: ${errorMessage}` };
  }
}

export async function deleteProduct(id: string): Promise<{ ok: boolean; message: string }> {
  try {
    // 1. Verificamos si tiene pedidos activos en curso
    const activeOrdersCount = await prisma.orderItem.count({
      where: {
        productId: id,
        order: {
          status: {
            in: ["PENDING", "PAID", "PREPARING"],
          },
        },
      },
    });

    if (activeOrdersCount > 0) {
      return { 
        ok: false, 
        message: "No se puede dar de baja: el producto pertenece a pedidos activos en curso." 
      };
    }

    // 2. BORRADO LÓGICO: En lugar de borrarlo, lo desactivamos
    await prisma.product.update({
      where: { id },
      data: { 
        isActive: false,
        stock: 0 // Opcional: dejamos el stock en 0 por seguridad
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/");
    return { ok: true, message: "Producto dado de baja correctamente." };
  } catch (error: unknown) {
    console.error("Error al dar de baja el producto:", error);
    return { ok: false, message: "Error al intentar procesar la baja del producto." };
  }
}
export async function searchProducts(query: string) {
  if (!query || !query.trim()) return [];
  try {
    return await prisma.product.findMany({
      where: {
        isActive: true, // <--- Solo busca entre los activos
        title: {
          contains: query.trim(),
          mode: 'insensitive',
        },
      },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        images: true,
        price: true,
      },
    });
  } catch (error) {
    console.error("Error al buscar productos:", error);
    return [];
  }
}

// ==========================================
// ACCIONES DE CATEGORÍAS
// ==========================================

export async function upsertCategory(data: { id?: string; name: string }): Promise<{ ok: boolean; message: string }> {
  try {
    const slug = generateSlug(data.name);

    // Validar si ya existe otra categoría con el mismo slug o nombre
    const existing = await prisma.category.findFirst({
      where: {
        OR: [{ name: data.name }, { slug }],
        NOT: data.id ? { id: data.id } : undefined,
      },
    });

    if (existing) {
      return { ok: false, message: "Ya existe una categoría con ese nombre." };
    }

    if (data.id) {
      await prisma.category.update({
        where: { id: data.id },
        data: { name: data.name, slug },
      });
    } else {
      await prisma.category.create({
        data: { name: data.name, slug },
      });
    }

    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    revalidatePath("/");

    return { ok: true, message: `La categoría "${data.name}" se guardó correctamente.` };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";
    return { ok: false, message: `Error en base de datos: ${errorMessage}` };
  }
}

export async function deleteCategory(categoryId: string, newCategoryId?: string) {
  try {
    // 1. Verificamos si tiene productos asociados
    const productsCount = await prisma.product.count({
      where: { categoryId: categoryId }
    });

    if (productsCount > 0) {
      if (!newCategoryId) {
        return { 
          ok: false, 
          hasProducts: true, 
          count: productsCount,
          message: `La categoría tiene ${productsCount} productos asociados. Debes reasignarlos antes de borrarla.` 
        };
      }

      // Si se especificó una nueva categoría, movemos los productos primero
      await prisma.product.updateMany({
        where: { categoryId: categoryId },
        data: { categoryId: newCategoryId }
      });
    }

    // 2. Eliminamos la categoría
    await prisma.category.delete({
      where: { id: categoryId }
    });

    revalidatePath('/admin/categories');
    revalidatePath('/admin/products');
    return { ok: true, message: "Categoría eliminada correctamente." };
  } catch (error) {
    console.log(error)
    return { ok: false, message: "Error al intentar eliminar la categoría." };
  }
}