import Hero from "@/components/Hero";
import Head from "next/head";

const Page = () => (
  <>
    <Head>
      <title>Budai Akrobatikus Sport Egyesület</title>
      <meta name="description" content="Budai Akrobatikus Sport Egyesület" />
    </Head>
    <main className="lg:relative">
      <div className="bg-orange-primary">
        <div className="mx-auto max-w-7xl py-3 px-3 sm:px-6 lg:px-8">
          <div className="pr-16 sm:px-16 sm:text-center">
            <p className="font-medium text-white">
              <span className="md:hidden">Támogass minket!</span>
              <span className="hidden md:inline">
                Támogass minket {"<"}Szolgátatónál!{">"}
              </span>
              <span className="ml-2">
                <a href="#" className="font-bold text-white underline">
                  Adományozás
                  <span aria-hidden="true"> &rarr;</span>
                </a>
              </span>
            </p>
          </div>
        </div>
      </div>
      <Hero />
    </main>
  </>
);
export default Page;
