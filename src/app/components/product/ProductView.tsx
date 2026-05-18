import { Product } from '@prisma/client';
import { ProductSlideshow } from './ProductSlideShow';

interface Props {
  product: Product;
}

export const ProductView = ({ product }: Props) => {
  return (
    <div className="mt-5 mb-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 bg-[#FCF9F5]">
      
      {/* Columna de Imágenes (Galería Dinámica) */}
      <div className="col-span-1 md:col-span-2">
        {/* Reemplazamos la imagen fija por el Slideshow pasándole el array completo */}
        <ProductSlideshow images={product.images} title={product.title} />
      </div>

      {/* Columna de Detalles */}
      <div className="col-span-1 px-5">
        <h1 className="font-serif font-bold text-4xl text-[#263238] leading-tight">
          {product.title}
        </h1>
        
        <p className="text-2xl mb-6 font-mono font-bold text-[#8D6E63] mt-2">
          ${product.price.toLocaleString('es-AR')}
        </p>

        {/* Botón estilo Hierro */}
        <button className="w-full bg-[#263238] text-[#FCF9F5] py-4 rounded-none font-bold uppercase hover:bg-[#8D6E63] transition-all shadow-md active:scale-95 tracking-wider">
          Añadir al carrito
        </button>

        <div className="mt-10">
          <h3 className="font-bold text-sm text-[#795548] uppercase border-b border-[#EEEBE7] pb-2 mb-4 tracking-widest">
            Descripción
          </h3>
          <p className="text-[#5D4037] leading-relaxed font-medium">
            {product.description}
          </p>
        </div>
      </div>
    </div>
  );
};