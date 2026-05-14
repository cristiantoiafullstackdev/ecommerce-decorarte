import Image from 'next/image';
import { Product } from '@prisma/client';
import { robotoSlab } from '@/app/layout'; // O la fuente que uses en tu config

interface Props {
  product: Product;
}

export const ProductView = ({ product }: Props) => {
  return (
    <div className="mt-5 mb-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
      
      {/* Columna de Imágenes (Galería) */}
      <div className="col-span-1 md:col-span-2">
        <div className="bg-gray-100 aspect-square rounded-2xl flex items-center justify-center overflow-hidden">
          {/* Por ahora mostramos la primera imagen, luego haremos el Slideshow aquí */}
          <Image 
            src={product.images[0]} 
            alt={product.title}
            width={60}
            height={60}
            className="object-cover w-full h-full"
            priority 
          />
        </div>
      </div>

      {/* Columna de Detalles */}
      <div className="col-span-1 px-5">
        <h1 className={`${robotoSlab.className} antialiased font-bold text-3xl text-gray-900`}>
          {product.title}
        </h1>
        
        <p className="text-2xl mb-5 font-light mt-2">
          ${product.price.toLocaleString('es-AR')}
        </p>

        <button className="w-full bg-amber-800 text-white py-4 rounded-xl font-bold uppercase hover:bg-amber-900 transition-all shadow-lg active:scale-95">
          Añadir al carrito
        </button>

        <div className="mt-10">
          <h3 className="font-bold text-sm text-gray-400 uppercase border-b pb-2 mb-4">
            Descripción
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>
    </div>
  );
};