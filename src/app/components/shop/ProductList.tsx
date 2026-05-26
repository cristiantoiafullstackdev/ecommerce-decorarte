import { getPaginatedProducts } from "@/actions/product-actions";
import { CardProduct } from "@/app/components/shop/CardProduct"; 

export default async function ProductList() {
  const products = await getPaginatedProducts();

  return (
    <>
      <div className="p-8 mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        {products.map((product) => (
          <CardProduct key={product.id} product={product} />
        ))}
      </div>
      {products.length === 0 && (
        <p className="text-gray-500">No se encontraron productos en el catálogo.</p>
      )}
    </>
  );
}
