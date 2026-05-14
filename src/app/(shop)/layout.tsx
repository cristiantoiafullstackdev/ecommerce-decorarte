// src/app/(shop)/layout.tsx
import { TopMenu } from "@/app/components/ui/top-menu/TopMenu";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Solo el componente, sin HTML extra aquí */}
      <TopMenu />

      {/* 2. El contenido de las páginas */}
      <main className="flex-grow bg-zinc-50/50">
        {children}
      </main>

      {/* 3. Footer (Podríamos hacerlo componente luego, pero por ahora está bien aquí) */}
      <footer className="bg-white border-t border-gray-200 py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm italic">
            © {new Date().getFullYear()} DecorArte. Piezas únicas en madera.
          </p>
        </div>
      </footer>
    </div>
  );
}