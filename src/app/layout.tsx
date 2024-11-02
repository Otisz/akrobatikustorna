import type { Metadata } from "next";
import React from "react";

import "@/styles/globals.css";
import Header from "@/components/header/header";

export const metadata: Metadata = {
  title: {
    default: "Budai Akrobatikus Sport Egyesület",
    template: "%s - Budai Akrobatikus Sport Egyesület",
  },
  description: "Budai Akrobatikus Sport Egyesület",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hu">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
