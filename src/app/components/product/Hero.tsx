import Image from 'next/image'
import React from 'react'

export default function HeroShop() {
  return (
    <section className="mt-24 relative w-full h-128 flex items-center justify-start overflow-hidden">
        <Image
          src="/imagen-hero.png"
          alt="Taller artesanal cálido y ordenado"
          fill
          className="w-full h-fullobject-cover opacity-70"
          priority
        />
      <div className="absolute inset-0 bg-black/20 z-50" aria-hidden="true" />

      <div className="relative z-10 max-w-xl px-8 md:px-16 text-white">

        <h1 className="text-5xl md:text-7xl font-bold leading-tight z-10">
          Diseño en <br />
          <span className="text-[var(--color-cedro)]">Madera & Hierro</span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-white max-w-md leading-relaxed">
          Muebles con alma artesanal de Córdoba, creados para durar toda la vida.
        </p>

      </div>
    </section>
  )
}
