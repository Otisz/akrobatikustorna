import FilterPages from "@/app/(user)/ajanlott-oldalak/_FilterPages";

export const revalidate = 3600;

export const metadata = {
  title: "Ajánlott oldalak",
  description: "Ajánlott oldalak - Budai Akrobatikus Sport Egyesület",
};

export default function Page() {
  return (
    <main>
      <div className="mx-auto w-full max-w-7xl space-y-8 px-4 pb-20 pt-8 sm:px-6">
        <h1 className="text-5xl">Ajánlott oldalak</h1>
        <FilterPages />
      </div>
    </main>
  );
}
