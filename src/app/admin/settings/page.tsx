//src/app/admin/settings/page.tsx

import { getShippingCosts } from "@/actions/settings-actions";
import AdminSettingsForm from "@/app/components/admin/AdminSettingsForm";

export default async function AdminSettingsPage() {
  const currentShipping = await getShippingCosts();

  return (
    <div className="p-8 max-w-xl mx-auto bg-white rounded-2xl border-2 border-stone-200 shadow-sm mt-10">
      <h1 className="text-lg font-black text-[#1C1816] uppercase tracking-wider mb-6">
        ⚙️ Configuración de costos de Envíos
      </h1>
      <AdminSettingsForm initialData={currentShipping} />
    </div>
  );
}