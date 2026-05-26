import ProductList from "../components/shop/ProductList";

export default async function Home() {
  return (
    <section className="min-h-screen w-full">
      <main className="max-w-6xl py-20 px-10 mx-auto">    
        <ProductList />
      </main>
    </section>
  );
}