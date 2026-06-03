import type { DefaultSession, DefaultUser } from "next-auth";
// Importamos el tipo JWT de forma segura si es necesario

// Extendemos el comportamiento del módulo principal "next-auth"
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser { 
    role: string;
  }
}

// Extendemos el comportamiento del módulo de tokens "next-auth/jwt"
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}