// src/app/store/cart/cart-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, Category } from '@prisma/client';
import { getUserCart, upsertCartItem, removeCartItemAction, clearUserCart } from '@/actions/cart-actions';

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
  address: ShippingAddress | null;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  
  loadUserCart: (userId: string) => Promise<void>;
  addProductToCart: (product: Product & { category: Category }, quantity?: number, userId?: string) => Promise<void>;
  updateProductQuantity: (productId: string, quantity: number, userId?: string) => Promise<void>;
  removeProductFromCart: (productId: string, userId?: string) => Promise<void>;
  clearCart: (userId?: string) => Promise<void>;
  
  setShippingAddress: (address: ShippingAddress) => void;
  clearAddress: () => void;
  
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
      address: null,
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),

      loadUserCart: async (userId: string) => {
        if (!userId) {
          set({ cart: [] });
          return;
        }
        const serverCart = await getUserCart(userId);
        set({ cart: serverCart });
      },

      addProductToCart: async (product, quantity = 1, userId?: string) => {
        const { cart } = get();
        const productInCart = cart.find((item) => item.id === product.id);

        let finalQuantity = quantity;
        if (productInCart) {
          finalQuantity = Math.min(productInCart.quantity + quantity, product.stock);
        } else {
          finalQuantity = Math.min(quantity, product.stock);
        }

        if (finalQuantity <= 0) return;

        // Actualización optimista local
        if (!productInCart) {
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
        } else {
          set({
            cart: cart.map((item) => 
              item.id === product.id ? { ...item, quantity: finalQuantity } : item
            ),
          });
        }

        // Sincronizar con la BD si hay usuario
        if (userId) {
          await upsertCartItem(userId, product.id, finalQuantity);
        }
      },

      updateProductQuantity: async (productId, quantity, userId?: string) => {
        const { cart } = get();
        const itemToUpdate = cart.find((item) => item.id === productId);
        if (!itemToUpdate) return;

        const verifiedQuantity = Math.max(1, Math.min(quantity, itemToUpdate.stock));

        set({
          cart: cart.map((item) => {
            if (item.id !== productId) return item;
            return { ...item, quantity: verifiedQuantity };
          }),
        });

        if (userId) {
          await upsertCartItem(userId, productId, verifiedQuantity);
        }
      },

      removeProductFromCart: async (productId, userId?: string) => {
        const { cart } = get();
        set({ cart: cart.filter((item) => item.id !== productId) });

        if (userId) {
          await removeCartItemAction(userId, productId);
        }
      },

      clearCart: async (userId?: string) => {
        set({ cart: [], address: null });
        if (userId) {
          await clearUserCart(userId);
        }
      },

      setShippingAddress: (address) => set({ address }),
      clearAddress: () => set({ address: null }),

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