import { getProductBySlug } from '@/actions/product-actions';
import { ProductView } from '@/app/components/shop/ProductView';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params; 

  const product = await getProductBySlug(slug);

  if (!product) {
    console.log(`Producto con slug "${slug}" no encontrado en la DB.`);
    notFound();
  }

  return <ProductView product={product} />;
}
