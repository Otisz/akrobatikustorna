import Hero from "@/components/Hero";
import Head from "next/head";

const Page = () => (
  <>
    <Head>
      <title>Budai Akrobatikus Sport Egyesület</title>
      <meta name="description" content="Budai Akrobatikus Sport Egyesület" />
    </Head>
    <main className="lg:relative">
      <Hero />
    </main>
  </>
);
export default Page;
