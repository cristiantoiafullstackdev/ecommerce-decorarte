//src/actions/setting-actions.ts

'use server';

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Definimos la respuesta para que TypeScript no se queje
export interface ActionResponse {
  ok: boolean;
  message: string;
}

export async function getShippingCosts() {
  const cordobaSetting = await prisma.setting.findUnique({ where: { key: 'shipping_cordoba' } });
  const nacionalSetting = await prisma.setting.findUnique({ where: { key: 'shipping_nacional' } });

  return {
    cordoba: cordobaSetting ? Number(cordobaSetting.value) : 4500,
    nacional: nacionalSetting ? Number(nacionalSetting.value) : 8500,
  };
}

export async function updateShippingCosts(
  prevState: ActionResponse | null, 
  formData: FormData
): Promise<ActionResponse> {
  try {
    const cordoba = String(formData.get('cordoba'));
    const nacional = String(formData.get('nacional'));

    await prisma.setting.upsert({
      where: { key: 'shipping_cordoba' },
      update: { value: cordoba },
      create: { key: 'shipping_cordoba', value: cordoba },
    });

    await prisma.setting.upsert({
      where: { key: 'shipping_nacional' },
      update: { value: nacional },
      create: { key: 'shipping_nacional', value: nacional },
    });

    revalidatePath('/admin/settings');
    return { ok: true, message: "Costos de envío actualizados con éxito." };
  } catch (error) {
    console.log(error)
    return { ok: false, message: "Error al actualizar costos." };
  }
}