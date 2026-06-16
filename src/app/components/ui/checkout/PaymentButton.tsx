"use client";

import { useEffect } from "react";

interface Props {
  preferenceId: string;
}

export default function PaymentButton({ preferenceId }: Props) {
  useEffect(() => {
    // 1. Cargamos dinámicamente el script de Mercado Pago en el navegador
    const script = document.createElement("script");
    script.src = "https://sdk.mercadopago.com/js/v2";
    script.type = "text/javascript";
    script.async = true;

    script.onload = () => {
      // 2. Una vez cargado, inicializamos Mercado Pago con tu clave pública
      // Podés usar una clave de prueba (Sandbox) que empieza con TEST-...
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mp = new (window as any).MercadoPago("PUBLIC_KEY", {
        locale: "es-AR",
      });

      // 3. Creamos el botón oficial de Checkout Pro (Modal/Redirect)
      mp.checkout({
        preference: {
          id: preferenceId,
        },
        render: {
          container: ".mp-button-container", // El contenedor donde se dibuja
          label: "Pagar con Mercado Pago", // El texto del botón celeste
        },
      });
    };

    document.body.appendChild(script);

    return () => {
      // Limpieza al desmontar el componente
      document.body.removeChild(script);
    };
  }, [preferenceId]);

  return (
    // Este contenedor vacío es donde Mercado Pago va a inyectar mágicamente su botón celeste
    <div className="mp-button-container w-full min-h-[48px]" />
  );
}