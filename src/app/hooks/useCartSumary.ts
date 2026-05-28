// src/hooks/useCartSummary.ts
"use client";

import { useEffect, useState } from 'react';
import { useCartStore } from '@/store/cart/cart-store';

export const useCartSummary = () => {
  const [loaded, setLoaded] = useState(false);
  const cart = useCartStore((state) => state.cart);
  const { subTotal, totalItems } = useCartStore((state) => state.getSummary());

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoaded(true);
  }, []);

  return {
    loaded,
    cart,
    subTotal,
    totalItems,
  };
};