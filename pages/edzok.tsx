import baucsek_monika from "@/public/images/trainers/baucsek_monika.jpg";
import berkes_kornelia from "@/public/images/trainers/berkes_kornelia.jpg";
import budai_tunde from "@/public/images/trainers/budai_tunde.jpg";
import csabai_balint from "@/public/images/trainers/csabai_balint.jpg";
import gal_borbala from "@/public/images/trainers/gal_borbala.jpg";
import hlavacs_ildiko from "@/public/images/trainers/hlavacs_ildiko.jpg";
import kovacs_luca from "@/public/images/trainers/kovacs_luca.jpg";
import lorinczi_krisztina from "@/public/images/trainers/lorinczi_krisztina.jpg";
import mester_gabor from "@/public/images/trainers/mester_gabor.jpg";
import szucsi_ildiko from "@/public/images/trainers/szucsi_ildiko.jpg";
import toth_vivien from "@/public/images/trainers/toth_vivien.jpg";
import cn from "classnames";
import Head from "next/head";
import Image from "next/image";

const TRAINERS = [
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

const Page = () => (
  <>
    <Head>
      <title>Edzőink - Budai Akrobatikus Sport Egyesület</title>
      <meta
        name="description"
        content="Edzők - Budai Akrobatikus Sport Egyesület"
      />
    </Head>
    <main className="lg:relative">
      <div className="mx-auto w-full max-w-7xl pt-16 pb-20 px-4 sm:px-6">
        <h1 className="text-5xl mb-16">Edzőink</h1>
        <div className="flex flex-wrap justify-center gap-4">
          {TRAINERS.map((trainer) => (
            <div
              key={trainer.name}
              className={cn(
                "shadow shadow-lg overflow-hidden sm:rounded-md flex-[0_0_100%] sm:flex-[0_0_calc(50%_-_16px)] md:flex-[0_0_calc(33%_-_16px)]",
                trainer.color
              )}
            >
              <div className="px-4 py-5 sm:px-6 text-center">
                <h3 className="text-xl leading-6 font-medium text-gray-900">
                  {trainer.name}
                </h3>
                <p className="my-1 max-w-2xl text-sm italic">{trainer.title}</p>
                <Image
                  className="sm:rounded-md mx-auto"
                  src={trainer.image}
                  alt={trainer.name}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  </>
);
export default Page;