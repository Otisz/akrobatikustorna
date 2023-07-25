import { ReactNode } from "react";

interface IVideos {
  name: ReactNode;
  v: string;
  description?: ReactNode;
}

const VIDEOS: IVideos[] = [
  {
    name: "Junior Akrobatika Vb Katowice Statikus gyakorlatok Sajgál Ágnes-Boros Erika 1989",
    v: "4yYyxGU1ad8",
  },
  {
    name: "Sportakrobatika Hevesi Ált. Iskolában 1989.08.10. (KanizsaTV)",
    v: "sa5HaJtW96U",
  },
  {
    name: "Sportakrobatika Prága Gajcsi R./Kondor A. 1995.06.23. (KanizsaTV)",
    v: "DPVe9oOoH5U",
  },
  {
    name: "Sportakrobatika 2000.11.19. Budapest",
    v: "Rt7vKN-d37c",
  },
  {
    name: "Sportakrobatika 1995.05.24. Riesa",
    v: "AP48M4qX2ok",
  },
  {
    name: "Kossuth Kupa Akrobatika vers, riport/Sajgál,Boros,Váradi",
    v: "lMdv7vos72E",
  },
  {
    name: "2005 XXII. Váradi acro. Nemzetközi akrobatika fesztival Cegléd",
    v: "z8bj0OBsH8M",
  },
  {
    name: "XII.Varadi acro nemzetközi akrobatika fesztival 2005",
    v: "3hSG9bSn2bk",
  },
  {
    name: "Ifjúsági akrobatika ob",
    v: "e9sTXAGtcf8",
    description: (
      <>
        <p className="mt-3 text-base text-gray-500">1985 Női páros dinamikus Halmi K-Berla E</p>
        <p className="mt-3 text-base text-gray-500">Női hármas dinamikus NagyT-Miklós A,Csizmadi</p>
        <p className="mt-3 text-base text-gray-500">Ffi páros dinamikus. Stadler Zs-Süli B</p>
      </>
    ),
  },
  {
    name: "Máté Judith-Bessenyei Kinga hármas Építők (világok harca zene)",
    v: "MvqXy87BxKc",
  },
  {
    name: "Kiszely Krisztina,Boros Erika Négercsók Kupa 1987",
    v: "x-OCFUXNLvA",
  },
  {
    name: (
      <>
        I. Junior Akrobatika Világbajnokság Katowice,Sajgál Ágnes -Boros Erika <br /> összetett 2. hely <br /> 1989
        Világ élvonalában a ceglédi akrobatika
      </>
    ),
    v: "-6vvjuZl2ek",
  },
  {
    name: "Európa Bajnokság,Világkupa 1989",
    v: "x8xWY8qCjd4",
  },
  {
    name: "Bujáki Barbara-Novák Melinda 1989",
    v: "Dfbo2-HTy58",
  },
  {
    name: "Halmi Katalin-Berla Erika Felnőtt Magyar Bajnokság 2. hely 1985",
    v: "ZCUkSPlgmpo",
  },
];

export default VIDEOS;
