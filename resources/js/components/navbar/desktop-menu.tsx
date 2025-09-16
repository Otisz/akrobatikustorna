import { Link } from "@inertiajs/react";
import { CircleCheckIcon, CircleHelpIcon, CircleIcon } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";
import type { IconType } from "react-icons";
import {
  LuBookmarkCheck,
  LuCalendar,
  LuMedal,
  LuNewspaper,
  LuShoppingCart,
  LuUsers,
  LuVideotape,
} from "react-icons/lu";
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
            <ul className="grid gap-2 p-4 w-120">
              <ListItem href={LINKS.trainers} icon={LuUsers} title="Edzők">
                Ismerje meg az edzőinket és a vezetőséget.
              </ListItem>
              <ListItem href={LINKS.departments} icon={LuMedal} title="Szakosztályok">
                Tekintse meg a sportágakat és kategóriát.
              </ListItem>
              <ListItem href={LINKS.calendar} icon={LuCalendar} title="Edzéseink">
                Nézze meg, hogy mikor tartunk edzéseket.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Gyűjtemény</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 p-4 w-120">
              <ListItem href={LINKS.news} icon={LuNewspaper} title="Hírek">
                Legfrissebb hírek és információk.
              </ListItem>
              <ListItem href={LINKS.store} icon={LuShoppingCart} title="Piactér">
                BASE-s pulcsik, tollak és felszerelések.
              </ListItem>
              <ListItem href={LINKS.gallery} icon={LuVideotape} title="Történelmy kitekintés">
                Videók az akrobatikus tornáról és történetéről.
              </ListItem>
              <ListItem href={LINKS.recommendations} icon={LuBookmarkCheck} title="Ajánlott oldalak">
                Általunk ajánlott könyvek, cikkek és szövetségek.
              </ListItem>
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

function ListItem({
  title,
  children,
  href,
  icon: Icon,
  ...props
}: ComponentPropsWithoutRef<"li"> & { href: string; icon: IconType }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link
          className="flex h-full gap-4 items-center select-none rounded-md border border-border from-muted/50 to-muted px-4 py-2 outline-hidden transition-all hover:border-transparent hover:bg-linear-to-b focus:shadow-md"
          href={href}
        >
          <Icon className="size-12 stroke-muted-foreground" />
          <div className="flex flex-col gap-1">
            <p className="font-medium text-lg">{title}</p>
            <p className="text-balance text-muted-foreground leading-tight">{children}</p>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
