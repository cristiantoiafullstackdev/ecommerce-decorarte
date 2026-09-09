// src/app/admin/categories/page.tsx
'use client';

import React, { useEffect, useState, useMemo, useTransition } from 'react';
import { getCategories, upsertCategory, deleteCategory } from '@/actions/product-actions';
import { DecorarteIsotype } from '@/app/components/iconos/DecorArteBrand';
import { Category } from '@prisma/client';
import Link from 'next/link';

interface CategoryWithCount extends Category {
  _count?: {
    products: number;
  };
}

const CATEGORIES_PER_PAGE = 6; // Cantidad de categorías por página en la tabla

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<CategoryWithCount | null>(null);
  const [categoryName, setCategoryName] = useState<string>('');

  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isPending, startTransition] = useTransition();

  const refreshCategories = async () => {
    const res = await getCategories();
    setCategories(res as CategoryWithCount[]);
  };

  useEffect(() => {
    let isMounted = true;

    async function loadInitialData() {
      const res = await getCategories();
      if (isMounted) {
        setCategories(res as CategoryWithCount[]);
        setLoading(false);
      }
    }

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  const totalPages = Math.ceil(categories.length / CATEGORIES_PER_PAGE);
  const safeCurrentPage = Math.min(currentPage, totalPages || 1);

  const paginatedCategories = useMemo(() => {
    const start = (safeCurrentPage - 1) * CATEGORIES_PER_PAGE;
    return categories.slice(start, start + CATEGORIES_PER_PAGE);
  }, [categories, safeCurrentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setCategoryName('');
    setIsModalOpen(true);
  };

  const openEditModal = (cat: CategoryWithCount) => {
    setEditingCategory(cat);
    setCategoryName(cat.name);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    startTransition(async () => {
      const res = await upsertCategory({
        id: editingCategory?.id,
        name: categoryName,
      });

      if (res.ok) {
        setSuccessMsg(res.message);
        setIsModalOpen(false);
        await refreshCategories();
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        setErrorMsg(res.message);
      }
    });
  };

  const confirmDeleteWithMigration = (catId: string, newCatId?: string) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    startTransition(async () => {
      const res = await deleteCategory(catId, newCatId);
      if (res.ok) {
        setSuccessMsg(res.message);
        await refreshCategories();
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        setErrorMsg(res.message);
        setTimeout(() => setErrorMsg(null), 5000);
      }
      setCategoryToDelete(null);
    });
  };

  return (
    <main className="min-h-screen bg-[#F5F2EB] pt-28 pb-20 px-4 md:px-8 font-sans text-stone-900">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* ENCABEZADO unificado */}
        <div className="bg-[#FCF9F5] border-2 border-stone-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-stone-100 rounded-xl border border-stone-200 shrink-0">
              <DecorarteIsotype size={36} className="text-[#B57C38]" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#B57C38]">
                Organización del Taller
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-[#1C1816] uppercase tracking-tight mt-0.5">
                Gestión de Categorías ({categories.length})
              </h1>
              <p className="text-xs text-stone-600 mt-1 font-medium">
                Administrá las líneas de diseño y rubros disponibles para los productos.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link 
              href="/admin"
              className="px-4 py-3 bg-[#1C1816] hover:bg-[#B57C38] text-[#FFC107] hover:text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-[0_4px_0px_#B57C38] active:translate-y-0.5 text-center shrink-0"
            >
              ← Volver al Centro de Mando
            </Link>
            <button
              onClick={openAddModal}
              className="px-5 py-3 bg-[#1C1816] hover:bg-[#B57C38] text-[#FFC107] hover:text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-[0_4px_0px_#B57C38] active:translate-y-0.5 text-center shrink-0 cursor-pointer"
            >
              ➕ Nueva Categoría
            </button>
          </div>
        </div>

        {/* ALERTAS */}
        {successMsg && (
          <div className="bg-emerald-50 border-2 border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider rounded-xl p-4 shadow-xs">
            ✓ Éxito: {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="bg-red-50 border-2 border-red-200 text-red-800 text-xs font-bold uppercase tracking-wider rounded-xl p-4 shadow-xs">
            ⚠️ Alerta: {errorMsg}
          </div>
        )}

        {/* TABLA DE CATEGORÍAS */}
        <div className="bg-white rounded-2xl border-2 border-stone-200 shadow-xs overflow-hidden">
          {loading ? (
            <div className="p-16 text-center space-y-3">
              <div className="text-[#B57C38] animate-spin flex justify-center">
                <DecorarteIsotype size={32} />
              </div>
              <span className="text-xs font-black uppercase text-stone-500 tracking-widest block">
                Cargando líneas de producto...
              </span>
            </div>
          ) : categories.length === 0 ? (
            <div className="p-16 text-center space-y-2">
              <span className="text-2xl">🪵</span>
              <h3 className="text-xs font-black text-[#1C1816] uppercase tracking-wider">No hay categorías registradas</h3>
              <p className="text-xs text-stone-500">Comenzá añadiendo una línea como Maderas, Estantes o Percheros.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs min-w-125">
                  <thead>
                    <tr className="bg-[#E2DCD0] border-b-2 border-stone-300 text-[#1C1816] font-black uppercase tracking-widest">
                      <th className="p-4 pl-6">Nombre de Categoría</th>
                      <th className="p-4">Identificador (Slug)</th>
                      <th className="p-4 pr-6 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 text-stone-800 font-medium">
                    {paginatedCategories.map((cat) => (
                      <tr key={cat.id} className="hover:bg-[#FCF9F5] transition-colors">
                        <td className="p-4 pl-6 font-bold text-stone-900 uppercase">
                          {cat.name}
                        </td>
                        <td className="p-4 font-mono text-[11px] text-stone-400 select-all">
                          {cat.slug}
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => openEditModal(cat)}
                              className="border-2 border-stone-200 bg-white hover:bg-stone-100 text-stone-700 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer"
                            >
                              ✏️ Editar
                            </button>
                            <button
                              onClick={() => setCategoryToDelete(cat.id)}
                              className="border-2 border-red-200 bg-red-50/50 hover:bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer"
                            >
                              🗑️ Borrar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* BARRA DE PAGINACIÓN MOBILE-FIRST */}
              {totalPages > 1 && (
                <nav 
                  aria-label="Paginación de categorías" 
                  className="p-4 border-t-2 border-stone-200 bg-stone-50 flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                  <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider text-center sm:text-left">
                    Mostrando página <span className="text-[#1C1816] font-black">{safeCurrentPage}</span> de <span className="text-[#1C1816] font-black">{totalPages}</span> <span className="text-stone-400">({categories.length} categorías en total)</span>
                  </div>

                  <div className="flex items-center gap-1.5 w-full sm:w-auto justify-between sm:justify-center">
                    <button
                      onClick={() => handlePageChange(safeCurrentPage - 1)}
                      disabled={safeCurrentPage <= 1}
                      className="flex-1 sm:flex-none px-3 py-2 rounded-xl border-2 border-stone-200 bg-white text-stone-700 hover:bg-stone-100 disabled:opacity-30 disabled:hover:bg-white text-[10px] font-black uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
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
                            className={`min-w-[28px] h-7 px-2 rounded-lg text-[10px] font-black transition-all flex items-center justify-center shrink-0 cursor-pointer ${
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
                      className="flex-1 sm:flex-none px-3 py-2 rounded-xl border-2 border-stone-200 bg-white text-stone-700 hover:bg-stone-100 disabled:opacity-30 disabled:hover:bg-white text-[10px] font-black uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Siguiente</span>
                    </button>
                  </div>
                </nav>
              )}
            </>
          )}
        </div>

        {/* MODAL CREAR / EDITAR */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-[#1C1816]/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white max-w-md w-full rounded-2xl border-2 border-stone-300 p-6 space-y-6 shadow-xl relative">
              <div>
                <span className="text-[9px] text-[#B57C38] uppercase tracking-widest font-black bg-[#E2DCD0] px-2.5 py-1 rounded-md">
                  Gestión de Línea
                </span>
                <h2 className="text-base font-black text-stone-900 uppercase tracking-tight mt-3">
                  {editingCategory ? `Editar: ${editingCategory.name}` : "Nueva Categoría"}
                </h2>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-stone-600 mb-1.5">Nombre *</label>
                  <input
                    required
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="Ej: Mesas de Arrime"
                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-[#1C1816] bg-[#FCF9F5] text-xs font-semibold text-stone-900 placeholder-stone-400 focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 border-2 border-stone-200 hover:bg-stone-50 rounded-xl text-xs font-black uppercase tracking-wider transition-colors text-stone-500 text-center cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 py-3 bg-[#1C1816] hover:bg-[#B57C38] text-[#FFC107] hover:text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50 text-center shadow-[0_4px_0px_#B57C38] active:translate-y-0.5 cursor-pointer"
                  >
                    {isPending ? "Guardando..." : "Guardar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
        {categoryToDelete && (
          <div className="fixed inset-0 bg-[#1C1816]/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white max-w-md w-full rounded-2xl border-2 border-stone-300 p-6 space-y-4 shadow-xl">
              <span className="text-3xl block text-center">⚠️</span>
              <h3 className="text-sm font-black text-stone-900 uppercase tracking-tight text-center">¿Eliminar categoría?</h3>
              
              <p className="text-xs text-stone-500 font-medium leading-relaxed text-center">
                Si esta categoría contiene productos, el sistema te pedirá reasignarlos para no dejar productos huérfanos.
              </p>

              <div className="space-y-1 pt-2">
                <label className="block text-[10px] font-black uppercase tracking-wider text-stone-600">
                  Mover productos a (opcional si hay stock):
                </label>
                <select 
                  id="targetCategorySelect"
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-stone-200 bg-[#FCF9F5] text-xs font-semibold text-stone-900 focus:outline-none cursor-pointer"
                >
                  <option value="">-- Sin reasignar / Borrar directo si está vacía --</option>
                  {categories
                    .filter((c) => c.id !== categoryToDelete)
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setCategoryToDelete(null)}
                  className="flex-1 py-3 border-2 border-stone-200 hover:bg-stone-50 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors text-stone-500 text-center cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    const selectEl = document.getElementById('targetCategorySelect') as HTMLSelectElement;
                    const newCatId = selectEl?.value || undefined;
                    confirmDeleteWithMigration(categoryToDelete, newCatId);
                  }}
                  disabled={isPending}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors disabled:opacity-50 text-center shadow-[0_4px_0px_#991B1B] active:translate-y-0.5 cursor-pointer"
                >
                  {isPending ? "Procesando..." : "Confirmar y Borrar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}