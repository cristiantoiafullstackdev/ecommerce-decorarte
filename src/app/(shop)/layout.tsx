// src/app/(shop)/layout.tsx
import Footer from "../components/product/Footer";
import Header from "../components/product/Header";
import HeroShop from "../components/product/Hero";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full flex flex-col min-h-screen"> 
      <Header />
      <main className="w-full grow bg-[var(--color-roble)]"> 
        <HeroShop />
        {children}
      </main>
      <Footer />
    </div>
  );
}
