import futofoto from "@/../public/images/supporters/futofoto.png";
import gravir_expressz from "@/../public/images/supporters/gravir_expressz.png";
import kiwi_sun from "@/../public/images/supporters/kiwi_sun.png";
import megepitelek from "@/../public/images/supporters/megepitelek.png";
import pesti_pipi from "@/../public/images/supporters/pesti_pipi.png";
import posh_trend from "@/../public/images/supporters/posh_trend.png";
import triliton from "@/../public/images/supporters/triliton.png";
import wall_division from "@/../public/images/supporters/wall_division.png";
import { StaticImageData } from "next/image";

interface Trainer {
  name: string;
  image: StaticImageData;
  href: string;
}

export default [
  {
    name: "Futófotó",
    image: futofoto,
    href: "https://www.futofoto.hu/",
  },
  {
    name: "Gravír Expressz",
    image: gravir_expressz,
    href: "https://gravirexpressz.hu/",
  },
  {
    name: "Kiwi Sun",
    image: kiwi_sun,
    href: "https://www.kiwisun.hu/",
  },
  {
    name: "Megépítelek",
    image: megepitelek,
    href: "https://nearfinderhu.com/hu/business/megepitelek-kft_345688+3.html/",
  },
  {
    name: "Pesti Pipi",
    image: pesti_pipi,
    href: "https://pestipipi.hu/",
  },
  {
    name: "Posh Trend",
    image: posh_trend,
    href: "http://www.posh-trend.hu/",
  },
  {
    name: "Triliton",
    image: triliton,
    href: "http://www.triliton.hu/",
  },
  {
    name: "Wall Division",
    image: wall_division,
    href: "http://wall-division.hu/",
  },
];
