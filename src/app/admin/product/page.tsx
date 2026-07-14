"use client";

import React, { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { getAdminProducts, upsertProduct, deleteProduct, AdminProduct, ProductInput } from "@/actions/product-actions";
import { DecorarteIsotype, GameStyles } from "@/app/components/iconos/DecorArteBrand";
import FileUploader from "@/app/components/admin/FileUploader";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Estados de control para la ventana modal de Alta / Modificación
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);

  // Estados del Formulario
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    categoryName: "",
    imageUrl: "",
  });

  // Estado de confirmación de eliminación segura
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  // Cargamos productos en el cliente
  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      const res = await getAdminProducts();
      if (res.ok) {
        setProducts(res.products);
      } else {
        setErrorMsg(res.error || "Error al cargar catálogo de productos.");
      }
      setLoading(false);
    }
    loadProducts();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      title: "",
      description: "",
      price: "",
      stock: "",
      categoryName: "",
      imageUrl: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: AdminProduct) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      categoryName: product.category?.name || "maderas",
      imageUrl: product.images && product.images.length > 0 ? product.images[0] : "",
    });
    setIsModalOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const payload: ProductInput = {
      id: editingProduct?.id,
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      images: formData.imageUrl.trim() ? [formData.imageUrl.trim()] : [],
      categoryName: formData.categoryName,
    };

    startTransition(async () => {
      const res = await upsertProduct(payload);
      if (res.ok) {
        setSuccessMsg(res.message);
        setIsModalOpen(false);
        // Recargar el catálogo localmente tras el cambio exitoso
        const productsResponse = await getAdminProducts();
        if (productsResponse.ok) setProducts(productsResponse.products);
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        setErrorMsg(res.message);
      }
    });
  };

  const handleDeleteClick = (id: string) => {
    setProductToDelete(id);
  };

  const confirmDelete = () => {
    if (!productToDelete) return;
    setErrorMsg(null);
    setSuccessMsg(null);

    startTransition(async () => {
      const res = await deleteProduct(productToDelete);
      if (res.ok) {
        setSuccessMsg(res.message);
        setProducts((prev) => prev.filter((p) => p.id !== productToDelete));
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        setErrorMsg(res.message);
      }
      setProductToDelete(null);
    });
  };

  // Filtrado de productos en memoria
  const filteredProducts = products.filter((product) => {
    const nameMatch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    const categoryMatch = (product.category?.name || "").toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || categoryMatch;
  });

  return (
    <div className="space-y-6">
      <GameStyles />

      {/* ENCABEZADO DE SECCIÓN */}
      <div className="bg-white p-6 rounded-2xl border-2 border-stone-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-stone-100 rounded-xl border border-stone-200 shrink-0">
            <DecorarteIsotype size={40} className="text-[#B57C38]" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#B57C38]">
              Administración de Catálogo
            </span>
            <h1 className="text-xl font-black text-[#1C1816] uppercase mt-0.5">
              Gestión de Productos (ABM)
            </h1>
            <p className="text-xs text-stone-500">
              Añadí piezas de diseño rústico, modificá precios y controlá los niveles de stock del taller.
            </p>
          </div>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-[#1C1816] hover:bg-[#B57C38] text-[#FFC107] hover:text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-[0_4px_0px_#B57C38] active:translate-y-0.5 active:shadow-none shrink-0"
        >
          ➕ Agregar Pieza
        </button>
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

      {/* FILTROS Y BUSQUEDAS */}
      <div className="bg-white p-4 rounded-2xl border-2 border-stone-200 shadow-xs">
        <input
          type="text"
          placeholder="Buscar maderas por nombre o categoría..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border-2 border-stone-200 focus:border-[#1C1816] bg-[#FCF9F5] text-xs text-stone-800 font-medium focus:outline-none transition-colors"
        />
      </div>

      {/* TABLA DE PRODUCTOS */}
      <div className="bg-white rounded-2xl border-2 border-stone-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center space-y-3">
            <div className="text-[#B57C38] animate-spin flex justify-center">
              <DecorarteIsotype size={32} />
            </div>
            <span className="text-xs font-black uppercase text-stone-500 tracking-widest block">
              Sincronizando inventario de Neon DB...
            </span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-16 text-center space-y-2">
            <span className="text-2xl">🎨</span>
            <h3 className="text-xs font-black text-[#1C1816] uppercase tracking-wider">No se encontraron productos</h3>
            <p className="text-xs text-stone-500">Comenzá dando de alta tu primer estante o perchero.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FCF9F5] border-b-2 border-stone-200 text-stone-500 font-black uppercase tracking-wider">
                  <th className="p-4 pl-6">Pieza / Diseño</th>
                  <th className="p-4">Categoría</th>
                  <th className="p-4 text-right">Precio Neto</th>
                  <th className="p-4 text-center">Nivel de Stock</th>
                  <th className="p-4 pr-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-150 text-stone-700 font-medium">
                {filteredProducts.map((product) => {
                  const stock = product.stock;
                  let stockBadgeText = "Disponible";
                  let stockBadgeStyle = "bg-emerald-50 text-emerald-800 border-emerald-300";

                  if (stock === 0) {
                    stockBadgeText = "Sin Stock";
                    stockBadgeStyle = "bg-red-50 text-red-850 border-red-200";
                  } else if (stock <= 3) {
                    stockBadgeText = `Bajo (${stock})`;
                    stockBadgeStyle = "bg-amber-50 text-amber-850 border-amber-200";
                  } else {
                    stockBadgeText = `Stock: ${stock}`;
                    stockBadgeStyle = "bg-stone-50 text-stone-850 border-stone-200";
                  }

                  return (
                    <tr key={product.id} className="hover:bg-stone-50/50 transition-colors">
                      {/* Imagen y Título */}
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-4">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-stone-200 bg-stone-50 shrink-0">
                            {product.images && product.images.length > 0 ? (
                              <Image src={product.images[0]} alt={product.title} fill className="object-cover" />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center text-stone-400">🪵</div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-stone-900 uppercase">{product.title}</h4>
                            <p className="text-[10px] text-stone-400 font-mono select-all">ID: {product.id.slice(0, 8)}...</p>
                          </div>
                        </div>
                      </td>

                      {/* Categoría */}
                      <td className="p-4 uppercase tracking-wider text-[10px] font-black text-stone-500">
                        {product.category?.name || "maderas"}
                      </td>

                      {/* Precio */}
                      <td className="p-4 text-right font-black text-stone-900">
                        ${product.price.toLocaleString("es-AR")}
                      </td>

                      {/* Stock */}
                      <td className="p-4 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-lg border text-[9px] font-black uppercase tracking-wider ${stockBadgeStyle}`}>
                          {stockBadgeText}
                        </span>
                      </td>

                      {/* Acciones */}
                      <td className="p-4 pr-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(product)}
                            className="border border-stone-200 bg-white hover:bg-stone-50 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors"
                          >
                            ✏️ Editar
                          </button>
                          <button
                            onClick={() => handleDeleteClick(product.id)}
                            className="border border-red-200 bg-red-50/50 hover:bg-red-50 text-red-700 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors"
                          >
                            🗑️ Borrar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* VENTANA MODAL: FORMULARIO DE ALTA Y MODIFICACIÓN */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#1C1816]/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white max-w-lg w-full rounded-2xl border-2 border-stone-300 p-6 md:p-8 space-y-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
            <div>
              <span className="text-[9px] text-[#B57C38] uppercase tracking-widest font-black bg-[#E2DCD0] px-2.5 py-1 rounded-md">
                Ficha de Catálogo
              </span>
              <h2 className="text-lg font-black text-stone-900 uppercase tracking-tight mt-3">
                {editingProduct ? `Editar: ${editingProduct.title}` : "Agregar Nueva Pieza"}
              </h2>
              <p className="text-xs text-stone-400">Complete los datos para impactar en la base de datos Neon.</p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Título */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-stone-600 mb-1.5">Título del Producto *</label>
                <input required type="text" name="title" value={formData.title} onChange={handleFormChange} placeholder="Ej: Estante Flotante Roble Rústico" className="w-full px-4 py-2.5 rounded-xl border-2 border-stone-200 focus:border-[#1C1816] bg-[#FCF9F5] text-xs font-semibold focus:outline-none transition-colors" />
              </div>

              {/* Categoría */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-stone-600 mb-1.5">Categoría / Línea *</label>
                <input required type="text" name="categoryName" value={formData.categoryName} onChange={handleFormChange} placeholder="Ej: estantes, percheros, mesas" className="w-full px-4 py-2.5 rounded-xl border-2 border-stone-200 focus:border-[#1C1816] bg-[#FCF9F5] text-xs font-semibold focus:outline-none transition-colors" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Precio */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-stone-600 mb-1.5">Precio ($ Netos AR) *</label>
                  <input required type="number" step="0.01" name="price" value={formData.price} onChange={handleFormChange} placeholder="Ej: 34500" className="w-full px-4 py-2.5 rounded-xl border-2 border-stone-200 focus:border-[#1C1816] bg-[#FCF9F5] text-xs font-semibold focus:outline-none transition-colors" />
                </div>
                {/* Stock */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-stone-600 mb-1.5">Stock de Taller *</label>
                  <input required type="number" name="stock" value={formData.stock} onChange={handleFormChange} placeholder="Ej: 15" className="w-full px-4 py-2.5 rounded-xl border-2 border-stone-200 focus:border-[#1C1816] bg-[#FCF9F5] text-xs font-semibold focus:outline-none transition-colors" />
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-stone-600 mb-1.5">Descripción Técnica</label>
                <textarea rows={3} name="description" value={formData.description} onChange={handleFormChange} placeholder="Especificaciones de la madera, herrajes de hierro, tipo de pintura..." className="w-full p-4 rounded-xl border-2 border-stone-200 focus:border-[#1C1816] bg-[#FCF9F5] text-xs font-medium focus:outline-none transition-colors resize-none" />
              </div>

              {/* URL de Imagen */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-stone-600 mb-1.5">URL de Imagen Principal</label>
                <FileUploader 
                  currentUrl={formData.imageUrl} 
                  onUploadComplete={(url) => setFormData((prev) => ({ ...prev, imageUrl: url }))} 
                />
              </div>

              {/* Botonera del Modal */}
              <div className="flex gap-4 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 border-2 border-stone-200 hover:bg-stone-50 rounded-xl text-xs font-black uppercase tracking-wider transition-colors text-stone-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 py-3 bg-[#1C1816] hover:bg-[#B57C38] text-[#FFC107] hover:text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50"
                >
                  {isPending ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMACIÓN DE ELIMINACIÓN SEGURA (CUSTOM MODAL) */}
      {productToDelete && (
        <div className="fixed inset-0 bg-[#1C1816]/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white max-w-sm w-full rounded-2xl border-2 border-stone-300 p-6 space-y-4 shadow-xl text-center">
            <span className="text-3xl block">⚠️</span>
            <h3 className="text-sm font-black text-stone-900 uppercase tracking-tight">¿Confirmás la eliminación?</h3>
            <p className="text-xs text-stone-500 font-medium leading-relaxed">
              Esta acción no se puede deshacer y removerá la pieza de forma permanente del catálogo activo de Neon DB.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setProductToDelete(null)}
                className="grow py-2.5 border-2 border-stone-200 hover:bg-stone-50 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors text-stone-500"
              >
                No, Cancelar
              </button>
              <button
                onClick={confirmDelete}
                disabled={isPending}
                className="grow py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                {isPending ? "Eliminando..." : "Sí, Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}