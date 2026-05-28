// src/store/cart/cart-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, Category } from '@prisma/client';

export interface CartItem {
  id: string;
  slug: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  stock: number;
  categoryName: string;
}

interface CartState {
  getSummary: () => {
    totalItems: number;
    subTotal: number;
  };
  cart: CartItem[];
  _hasHydrated: boolean; // Control interno de hidratación nativa
  setHasHydrated: (state: boolean) => void;
  
  addProductToCart: (product: Product & { category: Category }, quantity?: number) => void;
  updateProductQuantity: (productId: string, quantity: number) => void;
  removeProductFromCart: (productId: string) => void;
  clearCart: () => void;
  
  // SELECTORES SEPARADOS (Devuelven números primitivos, evitando bucles infinitos)
  getTotalItems: () => number;
  getSubTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      _hasHydrated: false, // Inicia en falso
      setHasHydrated: (state) => set({ _hasHydrated: state }),

      addProductToCart: (product, quantity = 1) => {
        const { cart } = get();
        const productInCart = cart.find((item) => item.id === product.id);

        if (!productInCart) {
          const finalQuantity = Math.min(quantity, product.stock);
          if (finalQuantity <= 0) return;

          set({
            cart: [...cart, {
              id: product.id,
              slug: product.slug,
              title: product.title,
              price: product.price,
              quantity: finalQuantity,
              image: product.images[0] || '',
              stock: product.stock,
              categoryName: product.category.name,
            }],
          });
          return;
        }

        const newQuantity = Math.min(productInCart.quantity + quantity, product.stock);
        set({
          cart: cart.map((item) => 
            item.id === product.id ? { ...item, quantity: newQuantity } : item
          ),
        });
      },

      updateProductQuantity: (productId, quantity) => {
        const { cart } = get();
        set({
          cart: cart.map((item) => {
            if (item.id !== productId) return item;
            const verifiedQuantity = Math.max(1, Math.min(quantity, item.stock));
            return { ...item, quantity: verifiedQuantity };
          }),
        });
      },

      removeProductFromCart: (productId) => {
        const { cart } = get();
        set({ cart: cart.filter((item) => item.id !== productId) });
      },

      clearCart: () => set({ cart: [] }),

      // Métodos de cálculo limpios
      getTotalItems: () => get().cart.reduce((total, item) => total + item.quantity, 0),
      getSubTotal: () => get().cart.reduce((sub, item) => sub + item.price * item.quantity, 0),
      getSummary: () => ({
        totalItems: get().getTotalItems(),
        subTotal: get().getSubTotal(),
      }),
    }),
    {
      name: 'decorarte-shopping-cart',
      // Esto le avisa a Zustand que ejecute la función cuando termine de leer el localStorage
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);