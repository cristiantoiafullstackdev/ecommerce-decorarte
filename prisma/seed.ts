import { PrismaClient, Role } from '@prisma/client';
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from 'bcryptjs';
import "dotenv/config";

// Importación de datos JSON
import categories from "./data/categories.json";
import users from "./data/users.json";
import products from "./data/products.json";

// 1. Configuración de la conexión manual (Pool)
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const adapter = new PrismaPg(pool as any);

// 2. Inicializamos Prisma con el adaptador
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🚀 Iniciando Seeding para DecorArte...");

  // 3. Limpieza de tablas (En orden de relaciones)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  console.log("Tablas limpias.");

// 4. Cargar Usuarios
  const hashedPassword = await bcrypt.hash('admin123', 10);
  for (const user of users) {
    await prisma.user.create({
      data: {
        ...user,
        password: hashedPassword,
        role: user.role as Role,
      }
    });
  }
  console.log("👤 Usuario Admin creado.");

  // 5. Crear Categorías
for (const cat of categories) {
    await prisma.category.create({
      data: cat
    });
  }
  console.log("📁 Categorías creadas.");

  // 6. Cargar Productos
  // Buscamos el ID de la categoría por su slug para vincularlos correctamente
  for (const prod of products) {
    const category = await prisma.category.findUnique({
      where: { slug: prod.categorySlug }
    });

    if (category) {
      await prisma.product.create({
        data: {
          title: prod.title,
          slug: prod.slug,
          description: prod.description,
          price: prod.price,
          stock: prod.stock,
          images: prod.images,
          categoryId: category.id
        }
      });
    }
  }
  console.log('✅ Seeding finalizado con éxito. 🌱 ¡DecorArte está listo para brillar! ');
}

main()
  .catch((e) => {
    console.error("❌ Error en el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end(); // Importante cerrar el pool de pg también
    console.log("🏁 Conexiones cerradas.");
  });