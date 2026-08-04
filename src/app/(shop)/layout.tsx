// src/app/(shop)/layout.tsx
import AuthProvider from "@/providers/AuthProvider";
import IconWhatsApp from "../components/iconos/IconWhatsApp";
import Footer from "../components/ui/footer/Footer";
import { Navbar } from "../components/ui/header/Navbar";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full flex flex-col min-h-screen"> 
      <AuthProvider>
        <Navbar />
        <main className="w-full grow bg-(--color-roble)"> 
          {children}
        </main>
        <IconWhatsApp />
        <Footer />
      </AuthProvider>
    </div>
  );
}