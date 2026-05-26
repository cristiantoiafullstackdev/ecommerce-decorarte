// src/app/(shop)/page.tsx
import HeroShop from '@/app/components/ui/hero/Hero';
import ProductList from '@/app/components/shop/ProductList';
import { getPaginatedProducts, getCategories } from '@/actions/product-actions';

export default async function ShopPage() {
  // Resolvemos ambas peticiones en paralelo en el servidor de forma eficiente
  const [products, categories] = await Promise.all([
    getPaginatedProducts(),
    getCategories() // Asegúrate de tener esta Action en tus product-actions que haga un prisma.category.findMany()
  ]);

  return (
    <main className="min-h-screen bg-[#3A2212]">
      <HeroShop />
      
      {/* Inyectamos los datos limpios de la DB al orquestador cliente */}
      <ProductList initialProducts={products} categories={categories} />
    </main>
  );
}