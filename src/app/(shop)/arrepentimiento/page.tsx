// src/app/(shop)/arrepentimiento/page.tsx
export default function ArrepentimientoPage() {
  return (
    <main className="min-h-screen bg-[#F5F2EB] pt-36 pb-20 px-4 md:px-8 font-sans text-stone-900">
      <div className="max-w-2xl mx-auto bg-white p-8 md:p-12 rounded-3xl border-2 border-stone-200 shadow-xs space-y-6">
        <div className="border-b pb-4 border-stone-100">
          <span className="text-[10px] text-amber-700 uppercase tracking-widest font-black">Ley 24.240 - Art. 34</span>
          <h1 className="text-2xl font-black uppercase tracking-tight text-[#1C1816] mt-1">
            Botón de Arrepentimiento
          </h1>
        </div>
        
        <p className="text-xs md:text-sm text-stone-600 font-medium leading-relaxed">
          Conforme a las normativas vigentes, tenés derecho a revocar la aceptación de tu compra dentro de los **10 (diez) días corridos** contados a partir de la fecha de entrega del producto.
        </p>

        <form className="space-y-4 pt-2" onSubmit={(e) => { e.preventDefault(); alert('Solicitud de arrepentimiento registrada. Nos comunicaremos a la brevedad para coordinar la devolución.'); }}>
          <div>
            <label className="block text-xs font-black text-stone-700 uppercase mb-1">Número de Orden o Pedido *</label>
            <input required type="text" placeholder="Ej: #123456" className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 bg-[#FCF9F5] text-sm font-medium focus:outline-none focus:border-stone-900" />
          </div>
          <div>
            <label className="block text-xs font-black text-stone-700 uppercase mb-1">Email Asociado a la Compra *</label>
            <input required type="email" placeholder="tu@email.com" className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 bg-[#FCF9F5] text-sm font-medium focus:outline-none focus:border-stone-900" />
          </div>
          <div>
            <label className="block text-xs font-black text-stone-700 uppercase mb-1">Motivo (Opcional)</label>
            <textarea rows={3} placeholder="Contanos brevemente el motivo..." className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 bg-[#FCF9F5] text-sm font-medium focus:outline-none focus:border-stone-900 resize-none" />
          </div>
          <button type="submit" className="w-full py-4 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-sm">
            Enviar Solicitud de Revocación
          </button>
        </form>
      </div>
    </main>
  );
}