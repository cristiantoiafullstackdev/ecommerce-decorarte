// src/app/components/admin/OrderItemsList.tsx
'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { DecorarteIsotype } from '@/app/components/iconos/DecorArteBrand';

interface OrderItemProduct {
  title: string;
  images: string[];
}

interface OrderItem {
  id: string;
  quantity: number;
  price: number | string;
  product: OrderItemProduct;
}

interface OrderItemsListProps {
  items: OrderItem[];
}

const ITEMS_PER_PAGE = 4;

export default function OrderItemsList({ items }: OrderItemsListProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const safeCurrentPage = Math.min(currentPage, totalPages || 1);

  const paginatedItems = useMemo(() => {
    const start = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return items.slice(start, start + ITEMS_PER_PAGE);
  }, [items, safeCurrentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border-2 border-stone-200 shadow-xs space-y-4">
      <h3 className="text-xs font-black text-[#1C1816] uppercase tracking-widest pb-3 border-b border-stone-100 flex items-center justify-between">
        <span>Piezas Solicitadas</span>
        <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Total ítems: {items.length}</span>
      </h3>

      <div className="divide-y divide-stone-100">
        {paginatedItems.map((item) => {
          const itemTotal = Number(item.price) * item.quantity;
          const imageUrl = item.product.images && item.product.images.length > 0
            ? (item.product.images[0].startsWith('http') ? item.product.images[0] : `/products/${item.product.images[0]}`)
            : null;

          return (
            <div key={item.id} className="py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-stone-200 bg-stone-50 shrink-0">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={item.product.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-stone-400">
                      <DecorarteIsotype size={20} />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-stone-900 truncate uppercase">{item.product.title}</h4>
                  <p className="text-[10px] text-stone-500 font-bold">Cantidad: {item.quantity}</p>
                </div>
              </div>
              <span className="text-xs font-black text-[#1C1816] shrink-0">
                ${itemTotal.toLocaleString('es-AR')}
              </span>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <nav 
          aria-label="Paginación de ítems del pedido" 
          className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider text-center sm:text-left">
            Página <span className="text-[#1C1816] font-black">{safeCurrentPage}</span> de <span className="text-[#1C1816] font-black">{totalPages}</span>
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto justify-between sm:justify-center">
            <button
              onClick={() => handlePageChange(safeCurrentPage - 1)}
              disabled={safeCurrentPage <= 1}
              className="flex-1 sm:flex-none px-3 py-2 rounded-xl border-2 border-stone-200 bg-white text-stone-700 hover:bg-stone-100 disabled:opacity-30 disabled:hover:bg-white text-[10px] font-black uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-1"
            >
              <span>Anterior</span>
            </button>

            <div className="flex items-center gap-1 mx-1 overflow-x-auto max-w-[180px] py-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                const isNearCurrent = Math.abs(page - safeCurrentPage) <= 1 || page === 1 || page === totalPages;
                
                if (!isNearCurrent) {
                  if (page === 2 || page === totalPages - 1) {
                    return <span key={page} className="px-1 text-stone-400 font-bold text-xs select-none">•••</span>;
                  }
                  return null;
                }

                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`min-w-[28px] h-7 px-2 rounded-lg text-[10px] font-black transition-all flex items-center justify-center shrink-0 ${
                      safeCurrentPage === page
                        ? "bg-[#1C1816] text-[#FFC107] shadow-sm scale-105"
                        : "border-2 border-stone-200 bg-white text-stone-600 hover:bg-stone-100"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(safeCurrentPage + 1)}
              disabled={safeCurrentPage >= totalPages}
              className="flex-1 sm:flex-none px-3 py-2 rounded-xl border-2 border-stone-200 bg-white text-stone-700 hover:bg-stone-100 disabled:opacity-30 disabled:hover:bg-white text-[10px] font-black uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-1"
            >
              <span>Siguiente</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}