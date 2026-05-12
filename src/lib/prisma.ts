/* CONFIGURACIÓN CENTRAL DE PRISMA ORM
   Este archivo gestiona cómo tu aplicación de Next.js se comunica con la base de datos (Neon).
   Está diseñado para ser eficiente en entornos "Serverless" y evitar errores de conexión.
*/
/* IMPORTACIONES DE DEPENDENCIAS
   - PrismaClient: El motor que genera las consultas a la base de datos.
   - PrismaPg: El adaptador oficial para que Prisma se entienda con PostgreSQL.
   - Pool: Un gestor de conexiones de la librería 'pg' que mantiene un grupo de 
     conexiones abiertas para reutilizarlas y no saturar el servidor.
*/
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

// 1. OBTENCIÓN DE LA URL: 
// Trae la dirección secreta de tu base de datos desde el archivo .env.

/* CONFIGURACIÓN DEL POOL DE CONEXIONES
   - connectionString: Toma la URL de conexión (de Neon, por ejemplo) desde las variables de entorno.
   - pool: Crea el grupo de conexiones usando esa URL.
   - adapter: Envuelve el pool en el formato que Prisma necesita. El 'any' evita errores 
     estrictos de tipos entre versiones de librerías.
*/
const connectionString = `${process.env.DATABASE_URL}`;
// 2. CREACIÓN DEL POOL:
// En lugar de abrir una conexión por cada clic del usuario, el 'Pool' mantiene 
// un grupo de conexiones listas para ser usadas, lo que ahorra mucho tiempo y recursos.
const pool = new Pool({ connectionString });
// 3. ADAPTADOR DE CONTROLADOR:
// Prisma usa este adaptador para hablar el mismo "idioma" que el driver de Postgres (pg).
// El 'as any' es un pequeño ajuste para que TypeScript no bloquee la compilación por tipos internos.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const adapter = new PrismaPg(pool as any); 

/* 4. PATRÓN SINGLETON (EVITAR COLAPSOS):
   En Next.js, cuando guardas un cambio (Hot Reload), el servidor se reinicia.
   Sin este bloque, cada vez que guardas un archivo, se crearía una NUEVA conexión a Neon.
   En 10 minutos podrías agotar las conexiones permitidas por tu plan de base de datos.
*/
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

/* 5. INSTANCIACIÓN INTELIGENTE:
   Aquí definimos la variable 'prisma' que exportaremos.
   - 'globalForPrisma.prisma ?? ...': Si ya existe una instancia creada, úsala.
   - 'new PrismaClient({...})': Si es la primera vez (o estamos en producción), crea una nueva.
*/
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter, // Le pasamos el adaptador que configuramos arriba.
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

/* 6. GUARDADO PARA REUTILIZACIÓN:
   Si no estamos en producción, guardamos la instancia en el objeto 'global'.
   Esto garantiza que en la siguiente recarga de código, Prisma sepa que ya hay 
   una conexión activa y no intente abrir otra.
*/
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;