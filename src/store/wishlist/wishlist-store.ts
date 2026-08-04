// src/app/store/wishlist/wishlist-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getUserFavorites, toggleUserFavorite } from '@/actions/wishlist-actions';

interface WishlistState {
  favorites: string[];
  toggleFavorite: (productId: string, userId?: string) => Promise<void>;
  setFavorites: (favorites: string[]) => void;
  isFavorite: (productId: string) => boolean;
  getWishCount: () => number;
  clearWishlist: () => void;
  loadUserFavorites: (userId: string) => Promise<void>;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      favorites: [],
      _hasHydrated: false,

      setHasHydrated: (state) => set({ _hasHydrated: state }),

      setFavorites: (favorites) => set({ favorites }),

      loadUserFavorites: async (userId: string) => {
        if (!userId) {
          set({ favorites: [] });
          return;
        }
        const serverFavorites = await getUserFavorites(userId);
        set({ favorites: serverFavorites });
      },

      toggleFavorite: async (productId: string, userId?: string) => {
        if (!userId) return; // Opcional: exigir login para favoritos

        const { favorites } = get();
        const exists = favorites.includes(productId);

        // Actualización optimista de la UI en el cliente
        if (exists) {
          set({ favorites: favorites.filter((id) => id !== productId) });
        } else {
          set({ favorites: [...favorites, productId] });
        }

        // Sincronizamos con la base de datos
        await toggleUserFavorite(userId, productId);
      },

      isFavorite: (productId: string) => get().favorites.includes(productId),

      getWishCount: () => get().favorites.length,

      clearWishlist: () => set({ favorites: [] }),
    }),
    {
      name: 'decorarte-wishlist-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);