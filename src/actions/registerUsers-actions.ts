'use server';

import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

// 1. Definimos el tipo con campos 100% OBLIGATORIOS (sin '?')
interface RegisterUserFormData {
  name: string;
  email: string;
  password: string;
}

// 2. Tipamos el argumento de la función con nuestra interfaz estricta
export const registerUser = async (formData: RegisterUserFormData) => {
  try {
    const { name, email, password } = formData;

    // Validaciones de negocio defensivas (por si alguien salta el HTML del frontend)
    if (!name || !email || !password) {
      return { ok: false, message: "Todos los campos son obligatorios para el registro." };
    }

    if (password.length < 6) {
      return { ok: false, message: "La contraseña debe tener al menos 6 caracteres." };
    }

    // Verificar si el correo ya existe en DecorArte
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return { ok: false, message: "Este correo electrónico ya está registrado." };
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Guardar el nuevo cliente en Neon con el rol obligatorio
    await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'USER'
      }
    });

    return {
      ok: true,
      message: "Cuenta creada con éxito. Ya podés iniciar sesión."
    };

  } catch (error) {
    console.error("❌ Error en registerUser Action:", error);
    return {
      ok: false,
      message: "No se pudo crear la cuenta en este momento. Intentalo más tarde."
    };
  }
};