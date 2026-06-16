// src/app/components/cart/SlidebarCart.tsx
"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation'; // <-- Importamos el enrutador de Next
import { useSession } from 'next-auth/react'; // <-- Importamos las sesiones de NextAuth
import { DecorarteIsotype } from '@/app/components/iconos/DecorArteBrand';
import { useCartStore } from '@/store/cart/cart-store';

interface SidebarCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SidebarCart({ isOpen, onClose }: SidebarCartProps) {
  const router = useRouter(); // Instanciamos el router para navegar
  const { status } = useSession(); // Evaluamos si está autenticado en el Front
  
  // 1. Conectamos las acciones y estados del motor de Zustand
  const cart = useCartStore((state) => state.cart);
  const updateQuantity = useCartStore((state) => state.updateProductQuantity);
  const removeItem = useCartStore((state) => state.removeProductFromCart);
  const hasHydrated = useCartStore((state) => state._hasHydrated);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const subTotal = useCartStore((state) => state.getSubTotal());

  // 2. Control de renderizado basado en hidratación de Zustand
  const activeCart = hasHydrated ? cart : [];
  const activeTotalItems = hasHydrated ? totalItems : 0;
  const activeSubTotal = hasHydrated ? subTotal : 0;

  // Lógica del botón de Checkout
  const handleCheckoutClick = () => {
    // Cerramos el panel lateral para una transición limpia
    onClose();

    if (status === "authenticated") {
      // Caso Logueado: Va directo a cargar sus datos de envío
      router.push('/checkout');
    } else {
      // Caso Visitante: Lo mandamos al login, pero guardamos en la URL que quiere ir a /checkout
      router.push('/auth/login?callbackUrl=/checkout');
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 overflow-hidden transition-all duration-300 ${
        isOpen ? "visible" : "invisible pointer-events-none"
      }`}
    >
      
      {/* BACKDROP */}
      <div 
        className={`absolute inset-0 bg-[#1C1816]/50 backdrop-blur-xs transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* PANEL DESLIZANTE */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div 
          className={`w-screen max-w-md bg-[#EAE6DC] border-l-4 border-[#1C1816] flex flex-col shadow-2xl h-full transition-transform duration-300 ease-out transform ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          
          {/* CABECERA DEL CARRITO */}
          <div className="px-6 py-5 bg-[#E2DCD0] border-b-2 border-stone-300/80 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#1C1816]">
              <DecorarteIsotype size={20} />
              <h2 className="text-sm font-black uppercase tracking-[0.2em]">Tu Bolsa de Compra</h2>
              {activeTotalItems > 0 && (
                <span className="bg-[#B57C38] text-white font-bold text-[10px] px-2 py-0.5 rounded-md">
                  {activeTotalItems}
                </span>
              )}
            </div>
            
            <button 
              onClick={onClose}
              className="p-2 border-2 border-stone-400/60 hover:border-[#1C1816] hover:bg-stone-100 text-stone-600 hover:text-[#1C1816] rounded-xl transition-all active:translate-y-px focus:outline-none"
              aria-label="Cerrar carrito"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* CUERPO DEL CARRITO */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-none">
            
            {/* ESTADO VACÍO */}
            {activeCart.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center pb-12">
                <div className="text-stone-400 mb-4 animate-pulse">
                  <DecorarteIsotype size={64} />
                </div>
                <h3 className="text-base font-black text-[#1C1816] uppercase tracking-wider">Tu bolsa está vacía</h3>
                <p className="text-xs text-stone-600 mt-2 max-w-xs">
                  Parece que aún no has sumado ninguna pieza artesanal a tu orden. ¡Explorá nuestro catálogo!
                </p>
                <button 
                  onClick={onClose}
                  className="mt-6 border-2 border-[#1C1816] px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-[#1C1816] hover:bg-[#1C1816] hover:text-white transition-all"
                >
                  Volver al Catálogo
                </button>
              </div>
            )}

            {/* RENDER DINÁMICO DE PRODUCTOS REALES */}
            {activeCart.map((item) => (
              <div 
                key={item.id} 
                className="flex gap-4 bg-white p-4 rounded-xl border-2 border-stone-300/60 shadow-[0_4px_12px_rgba(28,24,22,0.03)] relative group"
              >
                {/* Imagen del Producto */}
                <div className="relative w-20 h-20 bg-[#F5F2EB] rounded-lg overflow-hidden border border-stone-200 shrink-0">
                  {item.image ? (
                    <Image 
                      src={item.image} 
                      alt={item.title} 
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-stone-300 bg-linear-to-br from-[#EFECE4] to-[#E5E1D5]">
                      <DecorarteIsotype size={36} />
                    </div>
                  )}
                </div>

                {/* Detalles y Controles */}
                <div className="flex flex-col justify-between w-full">
                  <div>
                    <h3 className="text-sm font-bold text-[#1C1816] line-clamp-1 tracking-tight pr-6">
                      {item.title}
                    </h3>
                    <p className="text-[10px] text-[#B57C38] uppercase tracking-wider font-semibold">
                      {item.categoryName}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border-2 border-stone-200 rounded-lg overflow-hidden bg-[#F5F2EB]">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 text-stone-500 hover:bg-stone-200 font-bold transition-colors text-xs"
                      >
                        -
                      </button>
                      <span className="px-3 text-xs font-bold text-[#1C1816]">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="px-2 py-1 text-stone-500 hover:bg-stone-200 disabled:opacity-30 disabled:hover:bg-transparent font-bold transition-colors text-xs"
                      >
                        +
                      </button>
                    </div>
                    
                    <span className="text-sm font-black text-[#1C1816]">
                      ${item.price.toLocaleString('es-AR')}
                    </span>
                  </div>
                </div>

                {/* Botón de Remover Ítem */}
                <button 
                  onClick={() => removeItem(item.id)}
                  className="absolute top-3 right-3 text-stone-300 hover:text-rose-600 transition-colors"
                  aria-label="Eliminar producto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </div>
            ))}

          </div>

          {/* TOTALES Y ACCIONES FIJAS ABAJO */}
          {activeCart.length > 0 && (
            <div className="p-6 bg-[#E2DCD0] border-t-2 border-stone-300/80 space-y-4">
              <div className="space-y-1.5 text-xs font-semibold text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#1C1816]">
                    ${activeSubTotal.toLocaleString('es-AR')}
                  </span>
                </div>
                <div className="flex justify-between text-[#B57C38] text-[11px]">
                  <span>Envío (Córdoba y Resto del País)</span>
                  <span>Calculado en Checkout</span>
                </div>
                <div className="border-t border-stone-300/60 pt-3 flex justify-between text-base font-black text-[#1C1816]">
                  <span>Total Estimado</span>
                  <span className="text-lg font-black">
                    ${activeSubTotal.toLocaleString('es-AR')}
                  </span>
                </div>
              </div>

              {/* Botón de Checkout Conectado a handleCheckoutClick */}
              <button 
                onClick={handleCheckoutClick}
                className="w-full game-bounce bg-[#1C1816] hover:bg-[#B57C38] text-[#FFC107] hover:text-white py-4 rounded-xl font-bold uppercase text-xs tracking-[0.2em] transition-all duration-150 border-2 border-[#1C1816] shadow-[0_4px_0px_#B57C38] active:translate-y-1 active:shadow-none focus:outline-none flex items-center justify-center gap-2"
              >
                Iniciar Orden de Compra
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}