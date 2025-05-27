import LogoBase from "@/assets/images/logo_base.png";
import LINKS from "@/data/links";
import Image from "next/image";
import Link from "next/link";
import { FaFacebookSquare, FaInstagram, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="container pt-16 pb-8 sm:pt-24 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <Image className="mx-auto h-24 w-auto" src={LogoBase} alt="BASE Logo" />
            <p className="text-center text-gray-300 text-sm leading-6">
              AZ ELLENFÉL NEM ELLENSÉG!
              <br />
              Versenyezni, győzni csak a
              <br />
              felkészült, sikeres ellenféllel
              <br />
              szemben dicsőség!
            </p>
            <div className="flex justify-around">
              <Link href="https://www.facebook.com/akrobatikustorna" target="_blank" title="Facebook">
                <FaFacebookSquare className="h-6 w-6 text-gray-500 hover:fill-[#4267B2]" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="https://www.instagram.com/base_akrobatikus_torna/" target="_blank" title="Instagram">
                <FaInstagram className="h-6 w-6 text-gray-500 hover:fill-[#833ab4]" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="https://www.youtube.com/channel/UCVvzN2bTBlYqpjPkYgdMtog" target="_blank" title="Youtube">
                <FaYoutube className="h-6 w-6 text-gray-500 hover:fill-[#ff0000]" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="font-semibold text-sm text-white leading-6">Edzések</h3>
                <ul className="mt-6 space-y-4">
                  <li>
                    <Link href={LINKS.apply} className="text-gray-300 text-sm leading-6 hover:text-white">
                      Jelentkezés
                    </Link>
                  </li>
                  <li>
                    <Link href={LINKS.trainers} className="text-gray-300 text-sm leading-6 hover:text-white">
                      Edzők
                    </Link>
                  </li>
                  <li>
                    <Link href={LINKS.calendar} className="text-gray-300 text-sm leading-6 hover:text-white">
                      Edzéseink
                    </Link>
                  </li>
                  <li>
                    <Link href={LINKS.departments} className="text-gray-300 text-sm leading-6 hover:text-white">
                      Szakosztályok
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="font-semibold text-sm text-white leading-6">Gyűjtemény</h3>
                <ul className="mt-6 space-y-4">
                  <li>
                    <Link href={LINKS.news} className="text-gray-300 text-sm leading-6 hover:text-white">
                      Hírek
                    </Link>
                  </li>
                  <li>
                    <a
                      href={LINKS.store}
                      className="text-gray-300 text-sm leading-6 hover:text-white"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Piactér
                    </a>
                  </li>
                  <li>
                    <Link href={LINKS.gallery} className="text-gray-300 text-sm leading-6 hover:text-white">
                      Történelmi kitekintés
                    </Link>
                  </li>
                  <li>
                    <Link href={LINKS.recommendations} className="text-gray-300 text-sm leading-6 hover:text-white">
                      Ajánlott oldalak
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="font-semibold text-sm text-white leading-6">Egyesület</h3>
                <ul className="mt-6 space-y-4">
                  <li>
                    <Link href={LINKS.contact} className="text-gray-300 text-sm leading-6 hover:text-white">
                      Kapcsolat
                    </Link>
                  </li>
                  <li>
                    <Link href={LINKS.documents} className="text-gray-300 text-sm leading-6 hover:text-white">
                      Dokumentumok
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="font-semibold text-sm text-white leading-6">Bejelentkezés</h3>
                <ul className="mt-6 space-y-4">
                  <li>
                    <a
                      href="http://account.synology.com"
                      className="text-gray-300 text-sm leading-6 hover:text-white"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Tárhely
                    </a>
                  </li>
                  <li>
                    <Link href="/studio" className="text-gray-300 text-sm leading-6 hover:text-white">
                      Studio
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 space-y-2 border-white/10 border-t pt-8 sm:mt-20 lg:mt-24">
          <p className="text-gray-400 text-xs leading-5">
            &copy; {new Date().getFullYear()} Budai Akrobatikus Sport Egyesület. Minden jog fenntartva.
          </p>
          <p className="text-gray-400 text-xs leading-5" lang="en">
            Made with ❤️ by{" "}
            <a href="https://leventeotta.com" target="_blank" className="hover:underline" rel="noreferrer">
              Levente Otta
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
