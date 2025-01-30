import "@/styles/globals.css";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="hu" className="scroll-smooth">
      <body>{children}</body>
    </html>
  );
}
