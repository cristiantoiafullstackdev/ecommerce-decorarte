// src/app/(shop)/terminos/page.tsx
export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#F5F2EB] pt-36 pb-20 px-4 md:px-8 font-sans text-stone-900">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-3xl border-2 border-stone-200 shadow-xs space-y-6">
        <h1 className="text-2xl font-black uppercase tracking-tight text-[#1C1816] border-b pb-4 border-stone-100">
          Términos, Condiciones y Políticas de Taller
        </h1>
        
        <div className="space-y-4 text-xs md:text-sm text-stone-700 leading-relaxed font-medium">
          <h3 className="font-black text-stone-900 uppercase pt-2">1. Plazos de Fabricación Artesanal</h3>
          <p>Al tratarse de mobiliario y objetos de diseño elaborados de manera artesanal, los tiempos de producción estimados se detallan en cada pieza y comienzan a correr una vez acreditado el pago total o parcial del pedido.</p>

          <h3 className="font-black text-stone-900 uppercase pt-2">2. Envíos y Logística</h3>
          <p>Los envíos se realizan a través de transporte logístico especializado. Los costos se calculan según la zona de destino (Córdoba y Resto del País). Es responsabilidad del comprador verificar que las dimensiones de las piezas ingresen correctamente por ascensores o accesos al domicilio.</p>

          <h3 className="font-black text-stone-900 uppercase pt-2">3. Cambios y Devoluciones</h3>
          <p>Se aceptan cambios dentro de los 30 días corridos de recibida la compra, siempre y cuando el producto se encuentre en perfectas condiciones y en su embalaje original.</p>
        </div>
      </div>
    </main>
  );
}