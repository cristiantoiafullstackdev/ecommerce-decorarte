// src/components/ui/whatsapp/WhatsAppFlotante.tsx
"use client";

import React from 'react';

export default function IconWhatsApp() {
  const telefono = "5493510000000"; // Reemplazar por tu número real de Córdoba
  const mensaje = encodeURIComponent("¡Hola DecorArte! Me interesa conocer más sobre sus muebles de autor.");
  const url = `https://wa.me/${telefono}?text=${mensaje}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 game-bounce flex items-center justify-center bg-[#1E4620] hover:bg-[#27592A] text-[#F5F2EB] w-14 h-14 rounded-xl shadow-[0_6px_16px_rgba(0,0,0,0.35)] border-2 border-[#1C1816] transition-colors duration-200"
      aria-label="Contactar por WhatsApp"
    >
      {/* Icono de WhatsApp optimizado en SVG plano con estética sólida */}
      <svg
        className="w-7 h-7 fill-current"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.503-5.714-1.458L0 24zm6.59-4.846c1.657.983 3.3 1.499 5.36 1.5c5.375 0 9.75-4.331 9.753-9.655.002-2.578-1.002-5-2.825-6.822C17.053 2.354 14.63 1.35 12.01 1.35c-5.38 0-9.753 4.332-9.756 9.658-.001 2.11.56 4.166 1.625 5.988L2.84 20.91l4.475-1.168zM17.76 14.78c-.315-.158-1.86-.92-2.15-1.025-.289-.105-.5-.158-.71.158-.21.315-.813 1.025-.996 1.235-.183.21-.367.237-.682.079-.315-.158-1.33-.49-2.53-1.562-.935-.833-1.566-1.862-1.75-2.178-.183-.315-.02-.485.138-.642.142-.142.315-.368.473-.553.158-.184.21-.316.315-.527.105-.21.053-.395-.026-.553-.079-.158-.71-1.71-.973-2.34-.256-.617-.517-.534-.71-.544l-.604-.01c-.21 0-.552.079-.841.395-.29.315-1.104 1.079-1.104 2.63 0 1.553 1.13 3.053 1.288 3.264.158.21 2.221 3.39 5.38 4.754.752.325 1.34.52 1.799.665.756.24 1.444.207 1.988.125.606-.092 1.861-.763 2.124-1.46.263-.697.263-1.29.184-1.418-.079-.127-.289-.21-.604-.368z"/>
      </svg>
    </a>
  );
}