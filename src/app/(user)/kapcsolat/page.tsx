import { AtSymbolIcon, EnvelopeIcon, MapPinIcon, PhoneIcon } from "@heroicons/react/24/outline";
import type { Metadata } from "next";
import Link from "next/link";
import { FaFacebookSquare, FaInstagram, FaYoutube } from "react-icons/fa";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Kapcsolat",
  description: "Kapcsolat - Budai Akrobatikus Sport Egyesület",
};

export default function Page() {
  return (
    <main>
      <div className="mx-auto w-full max-w-7xl space-y-8 px-4 pb-20 pt-8 sm:px-6">
        <h1 className="mb-16 text-5xl">Kapcsolat</h1>
        <div className="flex flex-col gap-4">
          <div className="flex w-full flex-col items-center justify-center gap-4 rounded-md bg-white p-4 shadow-md md:flex-row">
            <div className="w-auto md:w-24">
              <EnvelopeIcon className="mx-auto h-8 w-8 text-gray-500" />
            </div>
            <div className="flex-grow">
              <span>1038 Budapest Határ út 15.</span>
            </div>
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-4 rounded-md bg-white p-4 shadow-md md:flex-row">
            <div className="w-auto md:w-24">
              <PhoneIcon className="mx-auto h-8 w-8 text-gray-500" />
            </div>
            <div className="flex flex-grow flex-col gap-4">
              <div className="flex flex-col gap-1 text-center md:flex-row">
                <Link href="tel:+36 20 311 1919" className="text-orange-primary underline">
                  +36 20 311 1919
                </Link>
                <span>(Mester Gábor elnök)</span>
              </div>
              <div className="flex flex-col gap-1 text-center md:flex-row">
                <Link href="tel:+36 20 983 1741" className="text-orange-primary underline">
                  +36 20 983 1741
                </Link>
                <span>(Szücsi Ildikó alelnök)</span>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-4 rounded-md bg-white p-4 shadow-md md:flex-row">
            <div className="w-auto md:w-24">
              <AtSymbolIcon className="mx-auto h-8 w-8 text-gray-500" />
            </div>
            <div className="flex flex-grow flex-col gap-4">
              <span>
                <Link href="mailto:akrobatikustorna@gmail.com" className="text-orange-primary underline">
                  akrobatikustorna@gmail.com
                </Link>
              </span>
              <span>
                <Link href="mailto:info@akrobatikustorna.hu" className="text-orange-primary underline">
                  info@akrobatikustorna.hu
                </Link>
              </span>
            </div>
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-4 rounded-md bg-white p-4 shadow-md md:flex-row">
            <div className="w-auto md:w-24">
              <MapPinIcon className="mx-auto h-8 w-8 text-gray-500" />
            </div>
            <div className="flex flex-grow flex-col gap-4">
              <div className="flex flex-col gap-1 text-center md:flex-row">
                <Link href="https://goo.gl/maps/BxvvHhFyhV3GWPcS9" className="text-orange-primary underline">
                  1032 Budapest, Bécsi út 134
                </Link>
                <span>(BMSZC Bláthy Ottó Titusz Informatikai Technikum)</span>
              </div>
              <div className="flex flex-col gap-1 text-center md:flex-row">
                <Link href="https://goo.gl/maps/UkcACG5V98Q6KXab7" className="text-orange-primary underline">
                  2016 Leányfalu, Móricz Zsigmond út 124/a
                </Link>
                <span>(Faluház)</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4">
            <Link href="https://www.facebook.com/akrobatikustorna" target="_blank" title="Facebook">
              <FaFacebookSquare className="h-16 w-16 hover:fill-[#4267B2]" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link href="https://www.instagram.com/base_akrobatikus_torna/" target="_blank" title="Instagram">
              <FaInstagram className="h-16 w-16 hover:fill-[#833ab4]" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link href="https://www.youtube.com/channel/UCVvzN2bTBlYqpjPkYgdMtog" target="_blank" title="Youtube">
              <FaYoutube className="h-16 w-16 hover:fill-[#ff0000]" />
              <span className="sr-only">YouTube</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
