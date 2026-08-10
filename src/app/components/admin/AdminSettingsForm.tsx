//src/app/components/admin/AdminSettingsForm.tsx

"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateShippingCosts } from "@/actions/settings-actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit"
      disabled={pending}
      className={`w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
        pending ? "bg-stone-400 cursor-not-allowed" : "bg-[#1C1816] hover:bg-[#B57C38] text-[#FFC107]"
      }`}
    >
      {pending ? "Guardando..." : "Guardar Nuevos Costos"}
    </button>
  );
}

export default function AdminSettingsForm({ initialData }: { initialData: { cordoba: number, nacional: number } }) {
  // Ahora updateShippingCosts es la acción directa
  const [state, action] = useActionState(updateShippingCosts, null);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Costo Local (Córdoba)</label>
        <input type="number" name="cordoba" defaultValue={initialData.cordoba} className="w-full p-3 rounded-xl border border-stone-300 text-xs font-bold" required />
      </div>
      <div>
        <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Costo Nacional</label>
        <input type="number" name="nacional" defaultValue={initialData.nacional} className="w-full p-3 rounded-xl border border-stone-300 text-xs font-bold" required />
      </div>
      <SubmitButton />
      {state?.ok && <p className="text-emerald-600 text-[11px] font-bold text-center mt-2">✅ {state.message}</p>}
    </form>
  );
}