import React from 'react'
import DecorarteLogo, { DecorarteIsotype } from '../ui/iconos/DecorArteBrand';

export default function Header() {
return (
    <nav className="fixed top-0 w-full z-50 bg-[#f5f2eb] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* SECCIÓN DEL LOGO RESPONSIVO */}
        <div className="shrink-0">
          {/* 1. En móviles (xs y sm) se oculta el logo completo y solo se muestra en pantallas medianas o superiores (md+) */}
          <div className="hidden md:block">
            <DecorarteLogo height={52} />
          </div>

          {/* 2. En móviles se muestra el isotipo solo y se oculta automáticamente al llegar a pantallas medianas (md) */}
          <div className="block md:hidden">
            <DecorarteIsotype size={46} />
          </div>
        </div>

        {/* El resto de tus controles (Enlaces, Carrito, Buscar, etc.) */}
        <div className="flex items-center space-x-6">
          {/* Enlaces de navegación o iconos aquí */}
        </div>

      </div>
    </nav>
  );
}



