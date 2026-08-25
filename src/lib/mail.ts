import nodemailer from 'nodemailer';

// Configuración del transportador con los datos del .env
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT) || 465,
  secure: Number(process.env.MAIL_PORT) === 465, // true para puerto 465, false para otros
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    // Esto evita el error de "self-signed certificate in certificate chain" en entorno local
    rejectUnauthorized: false,
  },
});

export const sendOrderStatusEmail = async (email: string, orderId: string, status: string) => {
  // Opcional: Traducir los estados de Prisma a un texto más amigable para el cliente
  const statusMapping: Record<string, string> = {
    PENDING: 'Pendiente de pago',
    PAID: 'Pagado',
    PREPARING: 'En preparación en el taller',
    SHIPPED: 'En camino / Enviado',
    DELIVERED: 'Entregado',
    CANCELLED: 'Cancelado',
  };

  const friendlyStatus = statusMapping[status] || status;
  const shortId = orderId.slice(-8).toUpperCase();

  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: email,
      subject: `Actualización de tu pedido #${shortId} - DecorArte`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #F5F2EB; padding: 30px; border-radius: 12px; color: #1C1816;">
          <h2 style="color: #1C1816; border-bottom: 2px solid #B57C38; padding-bottom: 10px;">¡Hola desde el taller de DecorArte! 🎨</h2>
          <p style="font-size: 16px;">Te escribimos para contarte que el estado de tu pedido <strong>#${shortId}</strong> ha cambiado.</p>
          
          <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #B57C38;">
            <p style="margin: 0; font-size: 14px; color: #666;">Nuevo estado:</p>
            <p style="margin: 5px 0 0 0; font-size: 20px; font-weight: bold; color: #B57C38;">${friendlyStatus}</p>
          </div>

          <p style="font-size: 14px; color: #555;">Puedes ingresar a tu cuenta en nuestra tienda para ver más detalles sobre tus piezas artesanales.</p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />
          <p style="font-size: 12px; color: #888; text-align: center;">DecorArte - Hecho a mano con dedicación.<br>Este es un correo automático, por favor no respondas a este mensaje.</p>
        </div>
      `,
    });
    console.log(`Correo de actualización enviado exitosamente a: ${email}`);
  } catch (error) {
    console.error('Error al enviar el correo con Nodemailer:', error);
  }
};