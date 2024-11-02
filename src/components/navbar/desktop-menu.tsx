import Link from "next/link";
import { LuCalendar, LuMedal, LuUsers2 } from "react-icons/lu";

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
                    className="from-muted/50 to-muted border-border flex h-full w-full select-none flex-col justify-end rounded-md border p-6 no-underline outline-none transition-all hover:border-transparent hover:bg-gradient-to-b focus:shadow-md"
                    href={LINKS.trainers}
                  >
                    <LuUsers2 className="size-12" />
                    <div className="mb-2 mt-4 text-lg font-medium">Edzők</div>
                    <p className="text-muted-foreground text-balance text-sm leading-tight">
                      Ismerje meg az edzőinket és a vezetőséget.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="from-muted/50 to-muted border-border flex h-full w-full select-none flex-col justify-end rounded-md border p-6 no-underline outline-none transition-all hover:border-transparent hover:bg-gradient-to-b focus:shadow-md"
                    href={LINKS.departments}
                  >
                    <LuMedal className="size-12" />
                    <div className="mb-2 mt-4 text-lg font-medium">Szakosztályok</div>
                    <p className="text-muted-foreground text-balance text-sm leading-tight">
                      Tekintse meg a sportágakat és kategóriát.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="from-muted/50 to-muted border-border flex h-full w-full select-none flex-col justify-end rounded-md border p-6 no-underline outline-none transition-all hover:border-transparent hover:bg-gradient-to-b focus:shadow-md"
                    href={LINKS.calendar}
                  >
                    <LuCalendar className="size-12" />
                    <div className="mb-2 mt-4 text-lg font-medium">Edzéseink</div>
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
                    className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors"
                    href={LINKS.news}
                  >
                    <div className="font-medium leading-none">Hírek</div>
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                      Legfrissebb hírek és információk.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors"
                    href={LINKS.store}
                    target="_blank"
                  >
                    <div className="font-medium leading-none">Piactér</div>
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                      BASE-s pulcsik, tollak és felszerelések.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors"
                    href={LINKS.gallery}
                  >
                    <div className="font-medium leading-none">Történelmy kitekintés</div>
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                      Videók az akrobatikus tornáról és történetéről.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors"
                    href={LINKS.recommendations}
                  >
                    <div className="font-medium leading-none">Ajánlott oldalak</div>
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
          <Link href={LINKS.documents} legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>Dokumentumok</NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href={LINKS.contact} legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>Kapcsolat</NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
