import React from 'react'

export default function Footer() {
  return (
    <section className="w-full bg-[#1E1A17] py-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:justify-between items-center ">
        <p className="text-sm text-[#FFE699] opacity-80 mb-4 md:mb-0">
          © {new Date().getFullYear()} DecorArte. Piezas únicas en madera.
        </p>
        <div className="text-sm">
          <span className="opacity-80 text-[#FFE699]">Creado por:</span>
          <a 
            href="#" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block font-medium hover:scale-105 transition-transform"
          >
            <span className="ml-2 bg-linear-to-r from-[#FF00FF] via-[#d69bd6] to-[#FF00FF] bg-clip-text text-transparent animate-gradient-text">
              Agencia de Software <span className="text-lg ml-1 font-bold">ViiViX</span>
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
