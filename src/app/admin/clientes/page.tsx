// src/app/admin/clients/page.tsx
import Link from 'next/link';
import prisma from '@/lib/prisma';

export default async function AdminClientsPage() {
  // Listado de clientes o compradores extraídos de las órdenes o tabla dedicada
  const clients = await prisma.order.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      city: true,
      province: true,
      createdAt: true,
    },
    distinct: ['email'],
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="p-8 space-y-6 bg-[#FCF9F5] min-h-screen font-sans text-stone-900">
      <div className="flex justify-between items-center border-b border-stone-200 pb-6">
        <div>
          <h1 className="text-xl font-black uppercase tracking-wider text-stone-900">
            👥 Directorio de Clientes DecorArte
          </h1>
          <p className="text-xs text-stone-500 font-medium">
            Información amigable de compradores, historial de contacto y ubicación de entrega.
          </p>
        </div>
        <Link
          href="/admin"
          className="text-xs font-bold text-stone-600 hover:text-stone-900 underline"
        >
          &larr; Volver al Dashboard
        </Link>
      </div>

      {/* Tabla del Directorio de Clientes */}
      <div className="bg-white rounded-2xl border-2 border-stone-200 overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-stone-100 border-b border-stone-200 text-stone-500 font-black uppercase text-[10px] tracking-wider">
              <th className="p-4">Comprador</th>
              <th className="p-4">Contacto Electrónico / Tel</th>
              <th className="p-4">Ubicación</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 font-medium text-stone-700">
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-stone-50 transition-colors">
                <td className="p-4 font-bold text-stone-900">
                  {client.firstName} {client.lastName}
                </td>
                <td className="p-4">
                  <span className="block font-medium text-stone-800 select-all">{client.email}</span>
                  <span className="block text-[11px] text-stone-500">{client.phone}</span>
                </td>
                <td className="p-4 text-stone-600">
                  {client.city}, {client.province?.toUpperCase()}
                </td>
                <td className="p-4 text-right">
                  <Link
                    href={`/admin/orders?query=${client.email}`}
                    className="px-3 py-1.5 bg-[#B57C38] text-white rounded-xl text-[10px] font-black uppercase hover:bg-[#96632B] transition-all"
                  >
                    Ver Pedidos
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}