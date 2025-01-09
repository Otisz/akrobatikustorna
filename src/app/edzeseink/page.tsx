import type { Metadata } from "next";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Edzéseink",
  description: "Edzéseink - Budai Akrobatikus Sport Egyesület",
};

export default async function Page() {
  return (
    <main className="container pt-8">
      <h1 className="text-4xl font-bold">Edzéseink</h1>
      <section className="mt-8">
        <div className="prose prose-lg relative w-full max-w-none overflow-auto prose-table:text-nowrap hover:prose-tr:bg-primary/5 prose-th:h-12 prose-th:px-4 prose-th:text-left prose-th:align-middle prose-th:font-medium prose-td:p-4 prose-td:align-middle" />
      </section>
    </main>
  );
}
