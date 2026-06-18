"use client";

import { useEffect } from "react";

interface Props {
  preferenceId: string;
}

export default function PaymentButton({ preferenceId }: Props) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.mercadopago.com/js/v2";
    script.type = "text/javascript";
    script.async = true;

    script.onload = () => {
      // ✅ Usamos la variable de entorno pública
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mp = new (window as any).MercadoPago(
        process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY,
        { locale: "es-AR" }
      );

      mp.checkout({
        preference: {
          id: preferenceId,
        },
        render: {
          container: ".mp-button-container",
          label: "Pagar con Mercado Pago",
        },
      });
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [preferenceId]);

  return <div className="mp-button-container w-full min-h-12" />;
}
