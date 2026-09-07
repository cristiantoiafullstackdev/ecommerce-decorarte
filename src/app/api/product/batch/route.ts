//src/app/api/product/batch/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Asegúrate de que esta sea tu ruta de importación de Prisma

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get('ids');

    if (!idsParam) {
      return NextResponse.json([], { status: 200 });
    }

    const ids = idsParam.split(',');

    // Buscamos los productos en la base de datos que coincidan con los IDs de los favoritos
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      include: {
        category: true, // Incluimos la categoría para que CardProduct no falle
      },
    });

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error('Error fetching batch products:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}