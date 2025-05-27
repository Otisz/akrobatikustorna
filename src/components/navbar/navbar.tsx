import BaseLogo from "@/assets/images/logo_base.png";
import DesktopMenu from "@/components/navbar/desktop-menu";
import MobileMenu from "@/components/navbar/mobile-menu";
import Link from "@/components/ui/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="h-24 bg-secondary text-secondary-foreground">
      <div className="container flex h-full items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2">
          <Image src={BaseLogo} alt="Budai Akrobatikus Sport Egyesület" className="h-14 w-auto" />
          <span className="font-bold text-3xl text-primary tracking-wider">BASE</span>
        </Link>
        <DesktopMenu />
        <MobileMenu />
      </div>
    </nav>
  );
}
