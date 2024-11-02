import Image from "next/image";
import Link from "next/link";

import BaseLogo from "@/assets/images/logo_base.png";
import DesktopMenu from "@/components/navbar/desktop-menu";
import MobileMenu from "@/components/navbar/mobile-menu";

export default function Navbar() {
  return (
    <nav className="bg-secondary text-secondary-foreground h-24">
      <div className="container flex h-full items-center justify-between">
        <Link href="/">
          <Image src={BaseLogo} alt="Budai Akrobatikus Sport Egyesület" className="h-14 w-auto" />
        </Link>
        <DesktopMenu />
        <MobileMenu />
      </div>
    </nav>
  );
}
