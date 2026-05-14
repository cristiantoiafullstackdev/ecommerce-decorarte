import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@prisma/client';

interface Props {
  product: Product;
}

export const CardProduct = ({ product }: Props) => {
  return (
    <div className="group bg-white flex flex-col">      
      {/* Imagen con link correcto */}
      <Link href={`/product/${product.slug}`} className="relative aspect-square w-full overflow-hidden bg-gray-100">
        <Image
          src={product.images[0]}
          alt={product.title}
          width={400}
          height={300}
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </Link>        

      <span className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-2">
        {product.categoryId}
      </span>        

      <Link href={`/product/${product.slug}`}>
        <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-amber-800 transition-colors">
          {product.title}
        </h3>
      </Link>

      <div className="p-5 flex flex-col grow">
        <p className="text-gray-600 text-sm line-clamp-2 mb-4 grow">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <span className="text-2xl font-black text-gray-900">
            ${product.price.toLocaleString('es-AR')}
          </span> 
          <button className="bg-amber-800 text-white p-2 rounded-lg hover:bg-amber-900 transition-colors" aria-label={`Agregar ${product.title} al carrito`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
