import LogoBase from "@/../public/images/logo_base.png";
import Image from "next/image";
import Link from "next/link";
import { FaFacebookSquare, FaInstagram, FaYoutube } from "react-icons/fa";

const navigation = {
  association: [
    { name: "Jelentkezés", href: "https://forms.gle/gFjANWnUzEeeQAyn7" },
    { name: "Edzők", href: "/edzok" },
    { name: "Edzéseink", href: "/edzeseink" },
    { name: "Szakosztályok", href: "/szakosztalyok" },
    { name: "Kapcsolat", href: "/kapcsolat" },
  ],
  collection: [
    { name: "Történelmi kitekintés", href: "/galeria" },
    { name: "Dokumentumok", href: "/dokumentumok" },
    { name: "Ajánlott oldalak", href: "/ajanlott-oldalak" },
    {
      name: "Piactér",
      href: "https://docs.google.com/forms/d/e/1FAIpQLSfxqbN-Tqeu1bqkKUQ4vJ7jMvdqtB2fsZ2wip9MUHs3NiOA8Q/viewform?fbclid=IwAR1VH7xnhpJqUwz3vq2YDNZP-JWo_f43E8l7UyMTS7Yrtakfwyo8ATEeFo4",
    },
  ],
  posts: [{ name: "Hírek", href: "/hirek" }],
  logins: [
    { name: "Tárhely", href: "http://account.synology.com" },
    { name: "Studio", href: "/studio" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-900" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <Image className="mx-auto h-14 w-auto" src={LogoBase} alt="BASE Logo" />
            <p className="text-center text-sm leading-6 text-gray-300">
              <q>Nem mindig lehet megtenni, amit kell, de mindig meg kell tenni, amit lehet.</q>
              <span>- (Bethlen Gábor)</span>
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
                <h3 className="text-sm font-semibold leading-6 text-white">Egyesület</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.association.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm leading-6 text-gray-300 hover:text-white">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">Gyűjtemény</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.collection.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm leading-6 text-gray-300 hover:text-white">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">Tartalmak</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.posts.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm leading-6 text-gray-300 hover:text-white">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">Bejelentkezés</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.logins.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm leading-6 text-gray-300 hover:text-white">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 space-y-2 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24">
          <p className="text-xs leading-5 text-gray-400">
            &copy; {new Date().getFullYear()} Budai Akrobatikus Sport Egyesület. Minden jog fenntartva.
          </p>
          <p className="text-xs leading-5 text-gray-400" lang="en">
            Made with ❤️ by{" "}
            <Link href="https://leventeotta.com" target="_blank" className="hover:underline">
              Levente Otta
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
