import TRAINERS from "@/data/trainers";
import cn from "classnames";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Edzőink - Budai Akrobatikus Sport Egyesület",
  description: "Edzőink - Budai Akrobatikus Sport Egyesület",
};

export default () => (
  <main>
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 pb-20 pt-8 sm:px-6">
      <h1 className="mb-16 text-5xl">Edzőink</h1>
      <div className="flex flex-wrap justify-center gap-4">
        {TRAINERS.map((trainer) => (
          <div
            key={trainer.name}
            className={cn(
              "flex-[0_0_100%] overflow-hidden shadow shadow-lg sm:flex-[0_0_calc(50%_-_16px)] sm:rounded-md md:flex-[0_0_calc(33%_-_16px)]",
              trainer.color,
            )}
          >
            <div className="px-4 py-5 text-center sm:px-6">
              <h3 className="text-xl font-medium leading-6 text-gray-900">{trainer.name}</h3>
              <p className="my-1 max-w-2xl text-sm italic">{trainer.title}</p>
              <Image className="mx-auto sm:rounded-md" src={trainer.image} alt={trainer.name} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </main>
);
