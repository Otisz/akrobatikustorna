import Image from "next/image";

import BaseLogo from "@/assets/images/logo_base.png";
import DesktopMenu from "@/components/navbar/desktop-menu";
import MobileMenu from "@/components/navbar/mobile-menu";
import Link from "@/components/ui/link";

export default function Navbar() {
  return (
    <nav className="h-24 bg-secondary text-secondary-foreground">
      <div className="container flex h-full items-center justify-between">
        <Link href="/" className="group inline-flex items-center gap-2">
          <Image src={BaseLogo} alt="Budai Akrobatikus Sport Egyesület" className="h-14 w-auto" />
          <span className="group text-3xl font-bold tracking-wider transition-colors group-hover:text-primary">
            BASE
          </span>
        </Link>
        <DesktopMenu />
        <MobileMenu />
      </div>
    </nav>
  );
}
