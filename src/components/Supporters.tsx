import supporters from "@/data/supporters";
import Image from "next/image";
import Link from "next/link";

export default function Supporters() {
  return (
    <div className="bg-gray-700 py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl">Támogatóink</h2>
        </div>
        <div className="mx-auto mt-16 grid max-w-lg grid-cols-2 items-center gap-x-8 gap-y-12 sm:max-w-xl sm:grid-cols-4 sm:gap-x-10 sm:gap-y-14 lg:mx-0 lg:max-w-none lg:grid-cols-4">
          {supporters.map((supporter, i) => (
            <Link href={supporter.href} key={i} target="_blank">
              <Image
                className="col-span-2 mx-auto h-32 w-fit rounded border-4 object-contain lg:col-span-1"
                src={supporter.image}
                alt={supporter.name}
                title={supporter.name}
                width={158}
                height={48}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
