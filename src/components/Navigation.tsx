"use client";

import LogoBase from "@/../public/images/logo_base.png";
import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import {
  AcademicCapIcon,
  ArrowTopRightOnSquareIcon,
  Bars3BottomRightIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  IdentificationIcon,
  PaperAirplaneIcon,
  PhotoIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import cn from "classnames";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

const MAIN_NAVIGATIONS = [
  {
    name: "Edzők",
    href: "/edzok",
    icon: IdentificationIcon,
    onlyOnMobile: false,
  },
  {
    name: "Szakosztályok",
    href: "/szakosztalyok",
    icon: AcademicCapIcon,
    onlyOnMobile: false,
  },
  {
    name: "Edzéseink",
    href: "/edzeseink",
    icon: CalendarDaysIcon,
    onlyOnMobile: false,
  },
  {
    name: "Dokumentumok",
    href: "/dokumentumok",
    icon: DocumentTextIcon,
    onlyOnMobile: true,
  },
  {
    name: "Ajánlott oldalak",
    href: "/ajanlott-oldalak",
    icon: ArrowTopRightOnSquareIcon,
    onlyOnMobile: true,
  },
  {
    name: "Galéria",
    href: "/galeria",
    icon: PhotoIcon,
    onlyOnMobile: true,
  },
  {
    name: "Kapcsolat",
    href: "/kapcsolat",
    icon: PaperAirplaneIcon,
    onlyOnMobile: false,
  },
];
const DROPDOWN_NAVIGATIONS = [
  {
    name: "Galéria",
    href: "/galeria",
    icon: PhotoIcon,
  },
  {
    name: "Dokumentumok",
    href: "/dokumentumok",
    icon: DocumentTextIcon,
  },
  {
    name: "Ajánlott oldalak",
    href: "/ajanlott-oldalak",
    icon: ArrowTopRightOnSquareIcon,
  },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <Popover className="relative bg-gray-900 shadow">
      {({ close: closeMainMenu }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex items-center justify-between py-4 md:justify-start md:space-x-10">
              <div className="flex justify-start lg:w-0 lg:flex-1">
                <Link href="/" className="shrink-0">
                  <span className="sr-only">Budai Akrobatikus Sport Egyesület</span>
                  <Image className="h-14 w-auto" src={LogoBase} alt="BASE Logo" />
                </Link>
              </div>
              <div className="-my-2 -mr-2 md:hidden">
                <Popover.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-50 hover:bg-gray-700 hover:text-orange-primary focus:outline-none focus:ring-2 focus:ring-inset">
                  <span className="sr-only">Menü megnyitása</span>
                  <Bars3BottomRightIcon className="h-8 w-8" aria-hidden="true" />
                </Popover.Button>
              </div>
              <Popover.Group as="nav" className="hidden space-x-10 md:flex">
                {MAIN_NAVIGATIONS.filter((item) => !item.onlyOnMobile).map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn("text-base font-medium hover:text-orange-accent", {
                      "text-orange-primary": pathname === item.href,
                      "text-gray-50": pathname !== item.href,
                    })}
                  >
                    {item.name}
                  </Link>
                ))}

                <Popover className="relative">
                  {({ open, close }) => (
                    <>
                      <Popover.Button
                        className={cn(
                          "group inline-flex items-center rounded-sm text-base font-medium hover:text-orange-accent focus:outline-none focus:ring-2 focus:ring-offset-2",
                          {
                            "text-orange-primary": open,
                            "text-gray-50": !open,
                          },
                        )}
                      >
                        <span>Továbbiak</span>
                        <ChevronDownIcon
                          className={cn("ml-2 h-5 w-5 group-hover:text-orange-accent", {
                            "text-orange-accent": open,
                            "text-orange-primary": !open,
                          })}
                          aria-hidden="true"
                        />
                      </Popover.Button>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                      >
                        <Popover.Panel className="absolute z-10 -ml-4 mt-3 w-screen max-w-sm transform px-2 sm:px-0 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2">
                          <div className="overflow-hidden rounded-lg bg-gray-900 text-gray-50 shadow-lg ring-1 ring-orange-primary ring-opacity-5">
                            <div className="relative grid gap-6 px-5 py-6 sm:gap-8 sm:p-8">
                              {DROPDOWN_NAVIGATIONS.map((item) => (
                                <Link
                                  onClick={close}
                                  key={item.name}
                                  href={item.href}
                                  className="-m-3 flex items-center gap-4 rounded-md p-3 text-gray-100 hover:text-orange-primary"
                                >
                                  <item.icon className="h-6 w-6 flex-shrink-0 text-orange-primary" aria-hidden="true" />
                                  <p className="text-base font-medium">{item.name}</p>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </Popover.Panel>
                      </Transition>
                    </>
                  )}
                </Popover>
              </Popover.Group>

              <div className="hidden items-center justify-end md:flex md:flex-1 lg:w-0">
                <Link
                  href="https://forms.gle/gFjANWnUzEeeQAyn7"
                  target="_blank"
                  className="ml-8 inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-orange-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-orange-accent"
                >
                  Jelentkezés
                </Link>
              </div>
            </div>
          </div>

          <Transition
            as={Fragment}
            enter="duration-200 ease-out"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="duration-100 ease-in"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Popover.Panel
              focus
              className="absolute inset-x-0 top-0 z-10 origin-top-right transform transition md:hidden"
            >
              <div className="divide-y-2 divide-gray-700 rounded-lg bg-gray-900 shadow-lg ring-1 ring-orange-primary ring-opacity-5">
                <div className="px-4 pb-6 pt-4">
                  <div className="flex items-center justify-between">
                    <Link href="/" onClick={closeMainMenu}>
                      <Image className="h-14 w-auto" src={LogoBase} alt="BASE Logo" />
                    </Link>
                    <div className="-mr-2">
                      <Popover.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-50 hover:bg-gray-700 hover:text-orange-primary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                        <span className="sr-only">Menü bezárás</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </Popover.Button>
                    </div>
                  </div>
                  <div className="mt-6">
                    <nav className="grid grid-cols-2 gap-8">
                      {MAIN_NAVIGATIONS.map((item) => (
                        <Link
                          onClick={closeMainMenu}
                          key={item.name}
                          href={item.href}
                          className="flex flex-col items-center gap-4 rounded-md p-3 hover:bg-gray-700"
                        >
                          <item.icon className="h-6 w-6 flex-shrink-0 text-orange-primary" aria-hidden="true" />
                          <span className="text-base font-medium text-gray-50">{item.name}</span>
                        </Link>
                      ))}
                    </nav>
                  </div>
                </div>
                <div className="space-y-6 px-5 py-6">
                  <div>
                    <Link
                      onClick={closeMainMenu}
                      href="https://forms.gle/gFjANWnUzEeeQAyn7"
                      target="_blank"
                      className="flex w-full items-center justify-center rounded-md border border-transparent bg-orange-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-orange-accent"
                    >
                      Jelentkezés
                    </Link>
                  </div>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}
