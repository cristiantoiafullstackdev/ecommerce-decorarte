import Link from 'next/link'
import React from 'react'

export default function Header() {
  return (
    <section className="fixed w-full h-24 z-50 bg-[var(--color-nogal)]">
      <div className='max-w-6xl mt-6 mx-auto flex items-center justify-between text-white'>
        <Link href="/" className='text-5xl font-bold'>
          DecorArte
        </Link>
        <nav className='hidden md:flex space-x-8'>
          <Link href="/" >Inicio</Link>
          <Link href="/productos">Productos</Link>
          <Link href="/sobre-nosotros">Sobre Nosotros</Link>
          <Link href="/contacto">Contacto</Link>
        </nav>
      </div>
    </section>
  )
}
