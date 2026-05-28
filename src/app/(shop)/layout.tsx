// src/app/(shop)/layout.tsx
import Footer from "../components/ui/footer/Footer";
import Header from "../components/ui/header/Header";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full flex flex-col min-h-screen"> 
      <Header wishCount={0} />
      <main className="w-full grow bg-(--color-roble)"> 
        {children}
      </main>
      <Footer />
    </div>
  );
}
