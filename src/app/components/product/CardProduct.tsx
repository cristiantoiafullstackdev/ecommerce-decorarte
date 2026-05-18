import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@prisma/client';

interface Props {
  product: Product;
}

export const CardProduct = ({ product }: Props) => {
  return (
    <div className="group p-10 flex flex-col justify-center bg-(--color-cedro)">
      
      <Link href={`/product/${product.slug}`}>
        <h3 className="text-2xl font-serif font-bold text-(--color-roble) mb-2">
          {product.title}
        </h3>
      </Link>
      <Link href={`/product/${product.slug}`} className="relative aspect-4/5 overflow-hidden my-4 mx-auto p-2">
        <Image
          src={product.images[0]}
          alt={product.title}
          width={300}
          height={240}
          className="group-hover:scale-105 transition-transform duration-700"
        />
      </Link>

      <div className="flex flex-col">
        
        <p className="text-(--color-roble) text-sm line-clamp-2 font-medium mb-4">
          {product.description}
        </p>

        <div className="flex items-center justify-between bg-(--color-roble) p-4 mt-auto">
          <span className="text-2xl font-mono font-bold text-[#263238]">
            ${product.price.toLocaleString('es-AR')}
          </span> 
        
          <button 
            className="bg-[#263238] text-[#FCF9F5] p-3 rounded-none hover:bg-[#8D6E63] transition-all duration-300 shadow-md"
            aria-label="Agregar al carrito"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};


