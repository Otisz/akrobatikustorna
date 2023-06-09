import {
  AcademicCapIcon,
  ArrowTopRightOnSquareIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  IdentificationIcon,
  PaperAirplaneIcon,
  PhotoIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";

export const MAIN_NAVIGATIONS = [
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
    name: "Piactér",
    href: "https://docs.google.com/forms/d/e/1FAIpQLSfxqbN-Tqeu1bqkKUQ4vJ7jMvdqtB2fsZ2wip9MUHs3NiOA8Q/viewform?fbclid=IwAR1VH7xnhpJqUwz3vq2YDNZP-JWo_f43E8l7UyMTS7Yrtakfwyo8ATEeFo4",
    icon: ShoppingBagIcon,
    onlyOnMobile: true,
    newTab: true,
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
export const DROPDOWN_NAVIGATIONS = [
  {
    name: "Piactér",
    href: "https://docs.google.com/forms/d/e/1FAIpQLSfxqbN-Tqeu1bqkKUQ4vJ7jMvdqtB2fsZ2wip9MUHs3NiOA8Q/viewform?fbclid=IwAR1VH7xnhpJqUwz3vq2YDNZP-JWo_f43E8l7UyMTS7Yrtakfwyo8ATEeFo4",
    icon: ShoppingBagIcon,
    newTab: true,
  },
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
