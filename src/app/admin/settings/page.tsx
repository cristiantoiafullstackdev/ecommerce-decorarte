import { getShippingCosts } from "@/actions/settings-actions";
import AdminSettingsForm from "@/app/components/admin/AdminSettingsForm";
import { DecorarteIsotype, GameStyles } from "@/app/components/iconos/DecorArteBrand";
import Link from 'next/link';

export default async function AdminSettingsPage() {
  const currentShipping = await getShippingCosts(); 

  return (
    <div className="space-y-6 font-sans text-stone-900">
      <GameStyles />

      {/* CABECERA UNIFICADA */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border-2 border-stone-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-stone-100 rounded-xl border border-stone-200 shrink-0">
            <DecorarteIsotype size={36} className="text-[#B57C38]" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#B57C38]">
              Configuración de Envíos
            </span>
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-stone-900 mt-0.5">
              Costos y Logística
            </h1>
            <p className="text-xs text-stone-500 font-medium mt-0.5">
              Configura los costos de envíos locales y nacionales para los compradores.
            </p>
          </div>
        </div>
        <div className="w-full sm:w-auto">
          <Link 
            href="/admin"
            className="w-full sm:w-auto px-5 py-3 bg-[#1C1816] hover:bg-[#B57C38] text-[#FFC107] hover:text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-[0_4px_0px_#B57C38] active:translate-y-0.5 active:shadow-none inline-flex items-center justify-center gap-2"
          >
            <span>&larr; Volver al Centro de Mando</span>
          </Link>
        </div>
      </div>

      {/* FORMULARIO DE CONFIGURACIÓN */}
      <div className="bg-white p-6 rounded-2xl border-2 border-stone-200 shadow-xs">
        <AdminSettingsForm initialData={currentShipping} />
      </div>
    </div>
  );
}