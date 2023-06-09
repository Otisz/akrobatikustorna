import "@/styles/globals.css";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="hu">
      <body>{children}</body>
    </html>
  );
}
