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
  categoryName: string;
}

export interface AdminProduct {
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
      where: { slug },
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
      orderBy: { createdAt: "desc" },
      include: { category: { select: { id: true, name: true } } }
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
    const generatedSlug = generateSlug(data.title);

    // 1. Obtener/Crear categoría
    const category = await prisma.category.upsert({
      where: { name: data.categoryName.trim().toLowerCase() },
      update: {},
      create: { 
        name: data.categoryName.trim().toLowerCase(),
        slug: generateSlug(data.categoryName),
      },
    });

    // 2. Estructurar el objeto para Prisma usando los tipos correctos
    const productData = {
      title: data.title,
      description: data.description,
      price: data.price,
      stock: data.stock,
      slug: generatedSlug,
      images: data.images,
      category: { connect: { id: category.id } } // La clave del éxito sin 'any'
    };

    if (data.id) {
      await prisma.product.update({
        where: { id: data.id },
        data: productData as Prisma.ProductUpdateInput,
      });
    } else {
      await prisma.product.create({
        data: productData as Prisma.ProductCreateInput,
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
    const itemsCount = await prisma.orderItem.count({ where: { productId: id } });
    if (itemsCount > 0) {
      return { ok: false, message: "No es posible eliminar el producto por estar en un pedido." };
    }

    await prisma.product.delete({ where: { id } });
    revalidatePath("/admin/products");
    revalidatePath("/");
    return { ok: true, message: "Producto eliminado." };
  } catch (error: unknown) {
    console.log(error)
    return { ok: false, message: "Error al eliminar." };
  }
}