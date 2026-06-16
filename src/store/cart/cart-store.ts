// src/app/store/cart/cart-store.ts
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

// Nueva interfaz para tipar la dirección en el Front
export interface ShippingAddress {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  province: string;
  zipCode: string;
  notes?: string;
}

interface CartState {
  cart: CartItem[];
  address: ShippingAddress | null; // <-- Estado de la dirección
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  
  addProductToCart: (product: Product & { category: Category }, quantity?: number) => void;
  updateProductQuantity: (productId: string, quantity: number) => void;
  removeProductFromCart: (productId: string) => void;
  clearCart: () => void;
  
  setShippingAddress: (address: ShippingAddress) => void; // <-- Acción para guardar la dirección
  
  getTotalItems: () => number;
  getSubTotal: () => number;
  getSummary: () => {
    totalItems: number;
    subTotal: number;
  };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      address: null, // <-- Inicializa vacía
      _hasHydrated: false,
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

      // Guarda la dirección capturada en el formulario
      setShippingAddress: (address) => set({ address }),

      // Métodos de cálculo
      getTotalItems: () => get().cart.reduce((total, item) => total + item.quantity, 0),
      getSubTotal: () => get().cart.reduce((sub, item) => sub + item.price * item.quantity, 0),
      getSummary: () => ({
        totalItems: get().getTotalItems(),
        subTotal: get().getSubTotal(),
      }),
    }),
    {
      name: 'decorarte-shopping-cart',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);