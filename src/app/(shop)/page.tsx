import ProductList from "../components/product/ProductList";


export default async function Home() {


  return (
    <div className="flex flex-col min-h-screen w-full items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex-1 w-full max-w-6xl py-20 px-6 sm:px-16 bg-white dark:bg-black sm:items-start mx-auto">
        
        <div className="mb-12 text-center sm:text-left">
          <h1 className="text-6xl font-semibold">
            Hola, esto es: <span className="text-7xl font-bold text-amber-800">
              DecorArte
            </span> 
          </h1>
          <p className="mt-4 text-gray-500 text-lg">
            Muebles de madera con alma y diseño artesanal.
          </p>
        </div>
        <ProductList />
      </main>
    </div>
  );
}