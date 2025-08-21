import { Head } from "@inertiajs/react";
import type { ReactNode } from "react";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Navbar from "@/components/navbar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Head>
        <meta head-key="description" name="description" content="Budai Akrobatikus Sport Egyesület" />
        <meta property="og:title" content="Budai Akrobatikus Sport Egyesület" />
        <meta property="og:description" content="Budai Akrobatikus Sport Egyesület" />
        <meta property="og:image" content="https://www.akrobatikustorna.hu/logo_base.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Budai Akrobatikus Sport Egyesület" />
        <meta name="twitter:description" content="Budai Akrobatikus Sport Egyesület" />
        <meta name="twitter:image" content="https://www.akrobatikustorna.hu/logo_base.png" />
      </Head>
      <div className="min-h-[calc(100dvh---spacing(38))]">
        <Header />
        <Navbar />
        {children}
        <Footer />
      </div>
    </>
  );
}
