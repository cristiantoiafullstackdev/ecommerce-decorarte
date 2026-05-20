// src/components/ui/top-menu/TopMenu.tsx
import Link from 'next/link';
import { robotoSlab } from '@/app/layout';
import { getCategories } from '@/actions/product-actions';

export const TopMenu = async () => {
  const categories = await getCategories();

  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* LADO IZQUIERDO: LOGO */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className={`${robotoSlab.className} text-2xl font-bold text-amber-900 tracking-tight transition-colors group-hover:text-amber-700`}>
            DecorArte
          </span>
        </Link>

        {/* CENTRO: CATEGORÍAS DINÁMICAS */}
        <nav className="hidden md:flex items-center gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] hover:text-amber-800 transition-all hover:-translate-y-px p-4"
            >
              {category.name}
            </Link>
          ))}
        </nav>

        {/* LADO DERECHO: UTILIDADES */}
        <div className="flex items-center gap-4">
          {/* Buscador - Futuro CU-C1 */}
          <button className="p-2 text-gray-400 hover:text-amber-800 transition-colors" aria-label='Buscar'>
            Buscar
          </button>

          {/* Carrito - Futuro CU-C2 */}
          <Link href="/cart" className="p-2 relative group text-gray-400 hover:text-amber-800 transition-colors">
           Carrito
          </Link>

          {/* Menú Hamburguesa (Solo Móvil) */}
          <button className="md:hidden p-2 text-gray-600" aria-label='Menu'>
            Menu
          </button>
        </div>
      </div>
    </header>
  );
};