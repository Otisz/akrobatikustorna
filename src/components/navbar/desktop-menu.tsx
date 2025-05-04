import { LuCalendar, LuMedal, LuUsers } from "react-icons/lu";
import Link from "@/components/ui/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import LINKS from "@/data/links";

export default function DesktopMenu() {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Edzések</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[600px] lg:grid-cols-3">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="border-border from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md border p-6 no-underline outline-hidden transition-all select-none hover:border-transparent hover:bg-linear-to-b focus:shadow-md"
                    href={LINKS.trainers}
                  >
                    <LuUsers className="size-12" />
                    <div className="mt-4 mb-2 text-lg font-medium">Edzők</div>
                    <p className="text-muted-foreground text-sm leading-tight text-balance">
                      Ismerje meg az edzőinket és a vezetőséget.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="border-border from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md border p-6 no-underline outline-hidden transition-all select-none hover:border-transparent hover:bg-linear-to-b focus:shadow-md"
                    href={LINKS.departments}
                  >
                    <LuMedal className="size-12" />
                    <div className="mt-4 mb-2 text-lg font-medium">Szakosztályok</div>
                    <p className="text-muted-foreground text-sm leading-tight text-balance">
                      Tekintse meg a sportágakat és kategóriát.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="border-border from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md border p-6 no-underline outline-hidden transition-all select-none hover:border-transparent hover:bg-linear-to-b focus:shadow-md"
                    href={LINKS.calendar}
                  >
                    <LuCalendar className="size-12" />
                    <div className="mt-4 mb-2 text-lg font-medium">Edzéseink</div>
                    <p className="text-muted-foreground text-sm leading-tight">
                      Nézze meg, hogy mikor tartunk edzéseket.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Gyűjtemény</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4">
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline outline-hidden transition-colors select-none"
                    href={LINKS.news}
                  >
                    <div className="leading-none font-medium">Hírek</div>
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                      Legfrissebb hírek és információk.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline outline-hidden transition-colors select-none"
                    href={LINKS.store}
                    target="_blank"
                  >
                    <div className="leading-none font-medium">Piactér</div>
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                      BASE-s pulcsik, tollak és felszerelések.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline outline-hidden transition-colors select-none"
                    href={LINKS.gallery}
                  >
                    <div className="leading-none font-medium">Történelmy kitekintés</div>
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                      Videók az akrobatikus tornáról és történetéről.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline outline-hidden transition-colors select-none"
                    href={LINKS.recommendations}
                  >
                    <div className="leading-none font-medium">Ajánlott oldalak</div>
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                      Általunk ajánlott könyvek, cikkek és szövetségek.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
            <Link href={LINKS.documents}>Dokumentumok</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
            <Link href={LINKS.contact}>Kapcsolat</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
