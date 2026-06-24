"use client";

import React, { useEffect, useState, useTransition } from "react";
import { getAdminOrders, updateOrderStatus, AdminOrder } from "@/actions/admin-actions";
import { DecorarteIsotype, GameStyles } from "@/app/components/iconos/DecorArteBrand";

export default function AdminPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // useTransition nos permite manejar mutaciones en el servidor de forma asíncrona y fluida
  const [isPending, startTransition] = useTransition();
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Cargamos las órdenes en el cliente al montar el componente
  useEffect(() => {
    async function loadOrders() {
      setLoading(true);
      const response = await getAdminOrders();
      if (response.ok) {
        setOrders(response.orders);
      } else {
        setErrorMessage(response.error || "No se pudieron cargar las órdenes de Neon.");
      }
      setLoading(false);
    }
    loadOrders();
  }, []);

  // Manejador para cambiar el estado de la orden mediante nuestro Server Action
  const handleStatusChange = (orderId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "PAID" ? "PENDING" : "PAID";
    setUpdatingOrderId(orderId);
    setSuccessMessage(null);
    setErrorMessage(null);

    startTransition(async () => {
      const response = await updateOrderStatus(orderId, nextStatus);
      if (response.ok) {
        // Actualizamos el estado local instantáneamente para una interfaz reactiva
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: nextStatus } : order
          )
        );
        setSuccessMessage(`Orden #${orderId.slice(0, 8)} actualizada con éxito.`);
        setTimeout(() => setSuccessMessage(null), 4000);
      } else {
        setErrorMessage(response.message);
      }
      setUpdatingOrderId(null);
    });
  };

  // Filtrado lógico de órdenes en tiempo de ejecución (en memoria)
  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === "ALL" || order.status === statusFilter;

    const fullName = `${order.firstName} ${order.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-[#F5F2EB] pt-36 pb-20 px-4 md:px-8">
      <GameStyles />

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Encabezado del Panel de Control */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border-2 border-stone-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <span className="text-[10px] text-[#B57C38] uppercase tracking-widest font-black bg-[#E2DCD0] px-2.5 py-1 rounded-md">
              Mesa de Control
            </span>
            <h1 className="text-xl md:text-2xl font-black text-[#1C1816] uppercase tracking-tight pt-2">
              Panel de Administración - DecorArte
            </h1>
            <p className="text-xs text-stone-500">
              Monitoreá pedidos, verificá transferencias y gestioná la fabricación de tus maderas.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#FCF9F5] p-3 rounded-xl border border-stone-150">
            <div className="text-[#B57C38]">
              <DecorarteIsotype size={28} />
            </div>
            <div>
              <span className="block text-[9px] text-stone-400 uppercase font-bold tracking-wider">Base de Datos</span>
              <span className="text-xs font-bold text-stone-700">Neon DB Conectada</span>
            </div>
          </div>
        </div>

        {/* Notificaciones flotantes de éxito/error */}
        {successMessage && (
          <div className="bg-emerald-50 border-2 border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider rounded-xl p-4 shadow-sm animate-fade-in">
            ✓ Éxito: {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="bg-red-50 border-2 border-red-200 text-red-800 text-xs font-bold uppercase tracking-wider rounded-xl p-4 shadow-sm animate-fade-in">
            ⚠️ Error: {errorMessage}
          </div>
        )}

        {/* Buscador y Filtros */}
        <div className="bg-white p-5 rounded-2xl border-2 border-stone-200 shadow-sm grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          <div className="sm:col-span-8 relative">
            <input
              type="text"
              placeholder="Buscar por nombre, correo o ID de orden..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-3 rounded-xl border-2 border-stone-200 focus:border-[#1C1816] bg-[#FCF9F5] text-xs text-stone-800 font-medium focus:outline-none transition-colors"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              title="Estado del pedido"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-[#1C1816] bg-[#FCF9F5] text-xs font-bold text-stone-700 focus:outline-none transition-colors h-11.5"
            >
              <option value="ALL">Todos los Estados</option>
              <option value="PAID">✓ Acreditado / En Fabricación</option>
              <option value="PENDING">⌛ Pendiente de Pago</option>
            </select>
          </div>
        </div>

        {/* Tabla de Órdenes */}
        <div className="bg-white rounded-2xl border-2 border-stone-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-20 text-center space-y-3">
              <div className="text-[#B57C38] animate-spin flex justify-center">
                <DecorarteIsotype size={40} />
              </div>
              <span className="text-xs font-black uppercase text-stone-500 tracking-widest block">
                Leyendo servidor de Neon...
              </span>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-20 text-center space-y-2">
              <span className="text-3xl">📦</span>
              <h3 className="text-sm font-black text-[#1C1816] uppercase tracking-wider">No se encontraron órdenes</h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                No hay registros que coincidan con la búsqueda o el filtro seleccionado en este momento.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FCF9F5] border-b-2 border-stone-200 text-stone-500 font-black uppercase tracking-wider">
                    <th className="p-4 pl-6">ID / Fecha</th>
                    <th className="p-4">Cliente / Contacto</th>
                    <th className="p-4">Método</th>
                    <th className="p-4">Monto Neto</th>
                    <th className="p-4 text-center">Estado de Pago</th>
                    <th className="p-4 pr-6 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-150 text-stone-700 font-medium">
                  {filteredOrders.map((order) => {
                    const isPaid = order.status === "PAID";
                    const isUpdating = updatingOrderId === order.id;

                    return (
                      <tr key={order.id} className="hover:bg-stone-50/50 transition-colors">
                        {/* ID y Fecha */}
                        <td className="p-4 pl-6 space-y-0.5">
                          <span className="font-mono font-black text-[#1C1816] block select-all">
                            #{order.id.slice(0, 8)}...
                          </span>
                          <span className="text-[10px] text-stone-400 block">
                            {new Date(order.createdAt).toLocaleDateString("es-AR")} -{" "}
                            {new Date(order.createdAt).toLocaleTimeString("es-AR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </td>

                        {/* Cliente */}
                        <td className="p-4 space-y-0.5">
                          <span className="font-bold text-stone-950 block">
                            {order.firstName} {order.lastName}
                          </span>
                          <span className="text-[10px] text-stone-500 block">
                            {order.email} | {order.phone}
                          </span>
                        </td>

                        {/* Método */}
                        <td className="p-4">
                          <span className="uppercase font-black text-[10px] bg-stone-100 border border-stone-200 px-2 py-1 rounded-md">
                            {order.paymentMethod === "mercadopago" ? "💳 MP" : "🏛️ Transfer"}
                          </span>
                        </td>

                        {/* Monto Neto */}
                        <td className="p-4 font-black text-stone-900">
                          ${order.total.toLocaleString("es-AR")}
                        </td>

                        {/* Estado */}
                        <td className="p-4 text-center">
                          {isPaid ? (
                            <span className="inline-block bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">
                              ✓ Aprobado
                            </span>
                          ) : (
                            <span className="inline-block bg-[#FFF9C4] text-[#F57F17] border border-[#FBC02D] text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">
                              ⌛ Pendiente
                            </span>
                          )}
                        </td>

                        {/* Acciones */}
                        <td className="p-4 pr-6 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleStatusChange(order.id, order.status)}
                              disabled={isUpdating || isPending}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border-2 ${
                                isPaid
                                  ? "border-red-200 bg-white text-red-700 hover:bg-red-50"
                                  : "border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50"
                              } disabled:opacity-50`}
                            >
                              {isUpdating ? (
                                <span className="animate-pulse">Cambiando...</span>
                              ) : isPaid ? (
                                "Desmarcar Pago"
                              ) : (
                                "Confirmar Pago"
                              )}
                            </button>
                            <a
                              href={`/checkout/orders/${order.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="border-2 border-stone-200 bg-white text-stone-600 hover:bg-stone-50 hover:text-stone-900 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all"
                            >
                              Ver Ficha
                            </a>
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

      </div>
    </main>
  );
}
