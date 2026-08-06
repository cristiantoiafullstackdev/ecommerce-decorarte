'use server';

import prisma from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid'; // O crypto.randomUUID() nativo de Node
import bcryptjs from 'bcryptjs';

// 1. Solicitar el token de recuperación
export async function forgotPassword(email: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Por seguridad, a veces se retorna éxito igual para evitar que descubran qué emails están registrados,
      // pero aquí puedes manejarlo como prefieras.
      return { ok: true, message: 'Si el correo existe, recibirás instrucciones.' };
    }

    // Generar un token único y expiración a 1 hora
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    // Borrar tokens anteriores de este email si existen
    await prisma.passwordResetToken.deleteMany({ where: { email } });

    // Guardar el nuevo token
    await prisma.passwordResetToken.create({
      data: { email, token, expires }
    });

    // TODO: Aquí dispararemos el envío del correo con el link:
    // https://tu-dominio.com/auth/new-password?token=${token}
    console.log(`LINK DE RECUPERACIÓN: /auth/new-password?token=${token}`);

    return { ok: true, message: 'Correo enviado con éxito.' };
  } catch (error) {
    console.error(error);
    return { ok: false, message: 'Ocurrió un error al procesar la solicitud.' };
  }
}

// 2. Restablecer la contraseña con el token
export async function resetPassword(token: string, newPassword: string) {
  try {
    const existingToken = await prisma.passwordResetToken.findUnique({
      where: { token }
    });

    if (!existingToken) {
      return { ok: false, message: 'El token de recuperación es inválido.' };
    }

    const hasExpired = new Date() > existingToken.expires;
    if (hasExpired) {
      await prisma.passwordResetToken.delete({ where: { id: existingToken.id } });
      return { ok: false, message: 'El token ha expirado. Solicita uno nuevo.' };
    }

    const user = await prisma.user.findUnique({
      where: { email: existingToken.email }
    });

    if (!user) {
      return { ok: false, message: 'Usuario no encontrado.' };
    }

    // Encriptar la nueva contraseña
    const hashedPassword = bcryptjs.hashSync(newPassword, 10);

    // Actualizar la contraseña del usuario
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    // Eliminar el token usado
    await prisma.passwordResetToken.delete({
      where: { id: existingToken.id }
    });

    return { ok: true, message: 'Contraseña actualizada correctamente.' };
  } catch (error) {
    console.error(error);
    return { ok: false, message: 'Error al actualizar la contraseña.' };
  }
}