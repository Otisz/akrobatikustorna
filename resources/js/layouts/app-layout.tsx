import type { ReactNode } from "react";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Navbar from "@/components/navbar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[calc(100dvh---spacing(38))]">
      <Header />
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
