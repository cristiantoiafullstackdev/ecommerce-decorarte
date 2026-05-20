// src/app/(shop)/layout.tsx
import Footer from "../components/ui/Footer";
import Header from "../components/ui/header/Header";
import HeroShop from "../components/ui/Hero";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full flex flex-col min-h-screen"> 
      <Header cartCount={0} wishCount={0} />
      <main className="w-full grow bg-[var(--color-roble)]"> 
        <HeroShop />
        {children}
      </main>
      <Footer />
    </div>
  );
}
