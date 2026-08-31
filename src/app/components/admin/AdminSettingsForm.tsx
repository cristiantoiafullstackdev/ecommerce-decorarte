// src/app/components/admin/AdminSettingsForm.tsx
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
      className={`w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-[0_3px_0px_#B57C38] active:translate-y-px active:shadow-none ${
        pending ? "bg-stone-400 cursor-not-allowed shadow-none" : "bg-[#1C1816] hover:bg-[#B57C38] text-[#FFC107] hover:text-white"
      }`}
    >
      {pending ? "Guardando..." : "Guardar Nuevos Costos"}
    </button>
  );
}

export default function AdminSettingsForm({ initialData }: { initialData: { cordoba: number, nacional: number } }) {
  const [state, action] = useActionState(updateShippingCosts, null);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="block text-[10px] font-black uppercase tracking-wider text-stone-600 mb-1.5">Costo Local (Córdoba)</label>
        <input 
          type="number" 
          name="cordoba" 
          defaultValue={initialData.cordoba} 
          className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-[#1C1816] bg-[#FCF9F5] text-xs font-semibold focus:outline-none transition-colors text-stone-900" 
          required 
        />
      </div>
      <div>
        <label className="block text-[10px] font-black uppercase tracking-wider text-stone-600 mb-1.5">Costo Nacional</label>
        <input 
          type="number" 
          name="nacional" 
          defaultValue={initialData.nacional} 
          className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-[#1C1816] bg-[#FCF9F5] text-xs font-semibold focus:outline-none transition-colors text-stone-900" 
          required 
        />
      </div>
      <SubmitButton />
      {state?.ok && (
        <div className="bg-emerald-50 border-2 border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider rounded-xl p-3 shadow-xs text-center mt-2">
          ✓ {state.message}
        </div>
      )}
    </form>
  );
}