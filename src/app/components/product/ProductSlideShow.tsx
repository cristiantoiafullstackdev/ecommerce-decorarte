'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Props {
  images: string[];
  title: string;
}

export const ProductSlideshow = ({ images, title }: Props) => {
  const [activeImage, setActiveImage] = useState(images[0] || '/placeholder.png');

  // Si el producto no tiene imágenes, mostramos un fallback
  if (!images || images.length === 0) {
    return (
      <div className="bg-[#F5F5F5] aspect-square w-full flex items-center justify-center border border-[#EEEBE7]">
        <p className="text-[#5D4037] italic">Sin imágenes disponibles</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* 1. IMAGEN PRINCIPAL (GRANDE) */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#F5F5F5] border border-[#EEEBE7] shadow-sm">
        <Image
          src={activeImage}
          alt={title}
          fill
          priority
          className="object-cover transition-all duration-300"
        />
      </div>

      {/* 2. MINIATURAS (CAROUSEL INFERIOR) */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2 md:gap-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveImage(image)}
              className={`relative aspect-square overflow-hidden bg-[#F5F5F5] border-2 transition-all ${
                activeImage === image 
                  ? 'border-[#8D6E63] opacity-100 scale-95' 
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
              aria-label={`Ver imagen ${index + 1} de ${title}`}
            >
              <Image
                src={image}
                alt={`${title} - Vista ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};