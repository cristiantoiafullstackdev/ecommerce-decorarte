// src/app/(shop)/layout.tsx
import { robotoSlab } from "../layout"; // Importamos la fuente que ya definiste

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Toda esta sección será reemplazada luego por un componente <Navbar /> 
        en la Tarea 1.2
      */}
      <header className="w-full bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className={`${robotoSlab.className} text-2xl font-bold text-amber-900 tracking-tight`}>
              DecorArte
            </h1>
          </div>
          
          <nav className="hidden md:flex space-x-8 text-sm font-medium text-gray-700">
            <span className="hover:text-amber-800 cursor-pointer">Inicio</span>
            <span className="hover:text-amber-800 cursor-pointer">Muebles</span>
            <span className="hover:text-amber-800 cursor-pointer">Decoración</span>
          </nav>

          <div className="flex items-center space-x-4">
             {/* Aquí irá el icono del Carrito del CU-C2 */}
             <div className="p-2 text-gray-600 hover:text-amber-800 cursor-pointer">
                🛒
             </div>
          </div>
        </div>
      </header>

      {/* Contenido dinámico de las páginas (Home, Productos, etc.) */}
      <main className="flex-grow bg-zinc-50/50">
        {children}
      </main>

      {/* Footer básico para cerrar el layout */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} DecorArte. Hecho con madera y código.
          </p>
        </div>
      </footer>
    </div>
  );
}