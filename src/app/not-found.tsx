import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-gray-100">
      <Navigation />
      <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold text-orange-primary">404</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Az oldal nem található</h1>
          <p className="mt-6 text-base leading-7 text-gray-600">Sajnáljuk, de az oldal, amit keresel nem található</p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/"
              className="rounded-md bg-orange-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-primary"
            >
              Vissza a főoldalra
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
