import baucsek_monika from "@/../public/images/trainers/baucsek_monika.jpg";
import berkes_kornelia from "@/../public/images/trainers/berkes_kornelia.jpg";
import budai_tunde from "@/../public/images/trainers/budai_tunde.jpg";
import csabai_balint from "@/../public/images/trainers/csabai_balint.jpg";
import gal_borbala from "@/../public/images/trainers/gal_borbala.jpg";
import hlavacs_ildiko from "@/../public/images/trainers/hlavacs_ildiko.jpg";
import kovacs_luca from "@/../public/images/trainers/kovacs_luca.jpg";
import lorinczi_krisztina from "@/../public/images/trainers/lorinczi_krisztina.jpg";
import mester_gabor from "@/../public/images/trainers/mester_gabor.jpg";
import szucsi_ildiko from "@/../public/images/trainers/szucsi_ildiko.jpg";
import toth_vivien from "@/../public/images/trainers/toth_vivien.jpg";
import { StaticImageData } from "next/image";

export interface Trainer {
  name: string;
  title: string;
  image: StaticImageData;
  color: string;
}

const TRAINERS: Array<Trainer> = [
  {
    name: "Szücsi Ildikó",
    title: "Vezető szakedző",
    image: szucsi_ildiko,
    color: "bg-[#ffc107]",
  },
  {
    name: "Mester Gábor",
    title: "Edző",
    image: mester_gabor,
    color: "bg-[#778899]",
  },
  {
    name: "Hlavács Ildikó",
    title: "Edző",
    image: hlavacs_ildiko,
    color: "bg-[#00bfff]",
  },
  {
    name: "Gál Borbála",
    title: "Edző",
    image: gal_borbala,
    color: "bg-[#fffacd]",
  },
  {
    name: "Kovács Luca",
    title: "Edző",
    image: kovacs_luca,
    color: "bg-[#d2691e]",
  },
  {
    name: "Tóth Vivien",
    title: "Edző",
    image: toth_vivien,
    color: "bg-[#00ced1]",
  },
  {
    name: "Csabai Bálint",
    title: "Ugróedző",
    image: csabai_balint,
    color: "bg-[#87cefa]",
  },
  {
    name: "Berkes Kornélia",
    title: "Balett oktató, koreográfus",
    image: berkes_kornelia,
    color: "bg-[#fff8dc]",
  },
  {
    name: "Lőrinczi Krisztina",
    title: "Coach/aerobik oktató",
    image: lorinczi_krisztina,
    color: "bg-[#da70d6]",
  },
  {
    name: "Baucsek Mónika",
    title: "Edző",
    image: baucsek_monika,
    color: "bg-[#ff1493]",
  },
  {
    name: "Budai Tünde",
    title: "Tánctanár",
    image: budai_tunde,
    color: "bg-[#f0e68c]",
  },
];

export default TRAINERS;
