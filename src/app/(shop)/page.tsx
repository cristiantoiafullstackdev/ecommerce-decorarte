// src/app/(shop)/page.tsx
import HeroShop from '@/app/components/ui/hero/Hero';
import ProductList from '@/app/components/shop/ProductList';
import { getPaginatedProducts, getCategories } from '@/actions/product-actions';

export default async function ShopPage() {
  
  // Ejecutamos ambas peticiones en paralelo en el servidor para máxima velocidad de carga
  const [products, categories] = await Promise.all([
    getPaginatedProducts(),
    getCategories()
  ]);

  return (
    <div className="w-full flex flex-col">
      
      {/* Sección visual principal de bienvenida (Banners / Slider artesanal) */}
      <HeroShop />
      
      {/* 
        Contenedor estructurado con máximos anchos y paddings adaptativos 
        (más estrecho en celulares, más amplio en pantallas grandes).
      */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <ProductList initialProducts={products} categories={categories} />
      </div>

    </div>
  );
}