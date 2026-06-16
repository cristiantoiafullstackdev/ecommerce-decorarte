"use client";

import React from 'react';

export type PaymentMethod = 'mercadopago' | 'transferencia';

interface Props {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
}

export const PaymentMethodSelector = ({ selectedMethod, onMethodChange }: Props) => {
  return (
    <div className="bg-white p-6 md:p-10 rounded-2xl border-2 border-stone-200 shadow-sm space-y-6">
      <div>
        <h2 className="text-base font-black text-[#1C1816] uppercase tracking-wider">
          Seleccioná el Método de Pago
        </h2>
        <p className="text-xs text-stone-500 mt-1">
          Todas nuestras transacciones están protegidas de punta a punta.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Opción Mercado Pago */}
        <button
          type="button"
          onClick={() => onMethodChange('mercadopago')}
          className={`p-5 rounded-xl border-2 text-left transition-all flex flex-col justify-between h-32 focus:outline-none ${
            selectedMethod === 'mercadopago'
              ? 'border-[#1C1816] bg-[#FCF9F5] shadow-xs'
              : 'border-stone-200 hover:border-stone-300 bg-white'
          }`}
        >
          <div className="flex justify-between items-center w-full">
            <span className="text-xs font-black uppercase tracking-wider text-[#1C1816]">Mercado Pago</span>
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'mercadopago' ? 'border-[#1C1816]' : 'border-stone-300'}`}>
              {selectedMethod === 'mercadopago' && <div className="w-2 h-2 rounded-full bg-[#1C1816]" />}
            </div>
          </div>
          <p className="text-[11px] text-stone-500 leading-normal">
            Tarjetas de crédito/débito, dinero en cuenta o Mercado Crédito. Acreditación inmediata.
          </p>
        </button>

        {/* Opción Transferencia Bancaria Directa */}
        <button
          type="button"
          onClick={() => onMethodChange('transferencia')}
          className={`p-5 rounded-xl border-2 text-left transition-all flex flex-col justify-between h-32 focus:outline-none relative overflow-hidden ${
            selectedMethod === 'transferencia'
              ? 'border-[#1C1816] bg-[#FCF9F5] shadow-xs'
              : 'border-stone-200 hover:border-stone-300 bg-white'
          }`}
        >
          {/* Badge de Descuento */}
          <span className="absolute top-0 right-0 bg-[#B57C38] text-white text-[9px] font-black uppercase px-2.5 py-1 rounded-bl-lg tracking-wider">
            10% OFF
          </span>

          <div className="flex justify-between items-center w-full">
            <span className="text-xs font-black uppercase tracking-wider text-[#1C1816]">Transferencia</span>
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'transferencia' ? 'border-[#1C1816]' : 'border-stone-300'} mr-14`}>
              {selectedMethod === 'transferencia' && <div className="w-2 h-2 rounded-full bg-[#1C1816]" />}
            </div>
          </div>
          <p className="text-[11px] text-stone-500 leading-normal">
            Te mostramos el CBU al confirmar. Ideal para pagos manuales directos con el taller.
          </p>
        </button>

      </div>
    </div>
  );
};