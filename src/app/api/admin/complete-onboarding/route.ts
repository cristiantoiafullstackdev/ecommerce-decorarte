import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { storeName, contactEmail, newPassword } = await req.json();

    // Validaciones básicas
    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: "La contraseña debe tener al menos 6 caracteres" }, { status: 400 });
    }

    // 1. Hasheamos la nueva contraseña definitiva elegida por el admin
    const hashedPassword = await hash(newPassword, 10);

    // 2. Actualizamos al usuario: cambiamos clave y desactivamos el flag de primer login
    await prisma.user.update({
      where: { email: session.user.email! },
      data: {
        password: hashedPassword,
        isFirstLogin: false,
      },
    });

    // 3. Guardamos o actualizamos también los datos de la tienda en StoreSettings
    // (Buscamos si ya existe una configuración, si no, la creamos)
    const existingSettings = await prisma.storeSettings.findFirst();
    
    if (existingSettings) {
      await prisma.storeSettings.update({
        where: { id: existingSettings.id },
        data: { storeName, contactEmail },
      });
    } else {
      await prisma.storeSettings.create({
        data: { storeName, contactEmail },
      });
    }

    return NextResponse.json({ success: true, message: "Configuración guardada con éxito" });
  } catch (error) {
    
    console.error("Error en onboarding:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}