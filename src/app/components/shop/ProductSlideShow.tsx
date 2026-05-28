// src/app/components/shop/ProductSlideShow.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { DecorarteIsotype } from '@/app/components/iconos/DecorArteBrand';

interface ProductSlideshowProps {
  images: string[];
  title: string;
}

export const ProductSlideshow = ({ images, title }: ProductSlideshowProps) => {
  const [activeImage, setActiveImage] = useState('/placeholder.png');
  const [imgError, setImgError] = useState(false);

  // Sincroniza la imagen activa inicial si cambia el array de imágenes
  useEffect(() => {
    if (images && images.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveImage(images[0]);
      setImgError(false);
    }
  }, [images]);

  // Si no hay imágenes válidas o fallaron, renderizamos un fallback de marca premium
  if (!images || images.length === 0 || imgError) {
    return (
      <div className="relative aspect-square w-full rounded-2xl bg-linear-to-br from-[#EFECE4] to-[#E5E1D5] flex flex-col items-center justify-center p-8 text-center select-none border-2 border-stone-200">
        <div className="text-[#1C1816]/10">
          <DecorarteIsotype size={96} />
        </div>
        <p className="text-stone-400 text-xs uppercase tracking-[0.2em] font-black mt-4">
          Visualización en Taller
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* 1. IMAGEN PRINCIPAL (GRANDE) */}
      <div className="relative aspect-square w-full overflow-hidden bg-(--bgWoodLight) rounded-2xl border-2 border-stone-200/80 shadow-sm">
        <Image
          src={activeImage}
          alt={title}
          fill
          priority
          sizes="(max-w-1024px) 100vw, 60vw"
          className="object-cover transition-all duration-300"
          onError={() => setImgError(true)}
        />
      </div>

      {/* 2. MINIATURAS (CAROUSEL INFERIOR) */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2 md:gap-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveImage(image)}
              className={`relative game-bounce aspect-square overflow-hidden rounded-xl bg-white border-2 transition-all focus:outline-none ${
                activeImage === image 
                  ? 'border-[#B57C38] opacity-100 scale-95 shadow-inner' 
                  : 'border-stone-200 opacity-60 hover:opacity-100'
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