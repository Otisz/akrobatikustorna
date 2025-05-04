import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { FaAlignRight, FaRegCircleXmark } from "react-icons/fa6";
import { SiFacebook, SiInstagram, SiYoutube } from "react-icons/si";
import Link from "@/components/ui/link";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import LINKS from "@/data/links";

export default function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger aria-label="Navigációs menü megnyitása" className="block md:hidden">
        <FaAlignRight className="h-8 w-8" />
      </SheetTrigger>
      <SheetContent noClose className="bg-background w-full border-none p-0">
        <SheetHeader className="divide-background m-4 flex h-20 flex-row divide-x">
          <SheetTitle className="flex flex-1 items-center px-4 text-2xl font-bold">Menü</SheetTitle>
          <SheetClose
            className="border-border bg-accent/30 hover:bg-accent m-0! inline-flex aspect-square h-full items-center justify-center rounded-xl border-2 transition-all hover:border-orange-500"
            aria-labelledby="close-navitaion-menu"
          >
            <FaRegCircleXmark className="h-8 w-8" />
            <span className="sr-only" id="close-navitaion-menu">
              Navigációs menü bezárása
            </span>
          </SheetClose>
          <VisuallyHidden asChild>
            <SheetDescription className="hidden">Navigációs menü</SheetDescription>
          </VisuallyHidden>
        </SheetHeader>
        <div className="h-full space-y-8 overflow-auto pb-32">
          <div className="divide-border grid grid-cols-1 divide-y">
            <SheetClose asChild>
              <Link href={LINKS.trainers} className="px-8 py-4" aria-label="Ugrás az edzők oldalra">
                Edzők
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link href={LINKS.departments} className="px-8 py-4" aria-label="Ugrás az szakosztályok oldalra">
                Szakosztályok
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link href={LINKS.calendar} className="px-8 py-4" aria-label="Ugrás az edzéseink oldalra">
                Edzéseink
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link href={LINKS.news} className="px-8 py-4" aria-label="Ugrás a hírek oldalra">
                Hírek
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <a href={LINKS.store} target="_blank" className="px-8 py-4" aria-label="Ugrás a piactér oldalra (új lap)">
                Piactér
              </a>
            </SheetClose>
            <SheetClose asChild>
              <Link href={LINKS.gallery} className="px-8 py-4" aria-label="Ugrás a történelmi kitekintés oldalra">
                Történelmi kitekintés
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link href={LINKS.recommendations} className="px-8 py-4" aria-label="Ugrás a ajánlott oldalak oldalra">
                Ajánlott oldalak
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link href={LINKS.documents} className="px-8 py-4" aria-label="Ugrás a dokumentumok oldalra">
                Dokumentumok
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link href={LINKS.contact} className="px-8 py-4" aria-label="Ugrás a kapcsolat oldalra">
                Kapcsolat
              </Link>
            </SheetClose>
          </div>
          <div className="grid grid-cols-3 gap-4 px-8">
            <a href={LINKS.facebook} target="_blank" aria-label="Tekintse meg a Facebook oldalunkat" title="Facebook">
              <SiFacebook className="mx-auto size-12 fill-[#4267b2]" />
            </a>
            <a
              href={LINKS.instagram}
              target="_blank"
              aria-label="Tekintse meg a Instagram oldalunkat"
              title="Instagram"
            >
              <SiInstagram className="mx-auto size-12" />
            </a>
            <a href={LINKS.youtube} target="_blank" aria-label="Tekintse meg a Youtube oldalunkat" title="Youtube">
              <SiYoutube className="mx-auto size-12 fill-[#ff0000]" />
            </a>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
