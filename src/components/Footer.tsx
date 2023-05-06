import LogoBase from "@/../public/images/logo_base.png";
import Image from "next/image";
import Link from "next/link";
import { FaFacebookSquare, FaInstagram, FaYoutube } from "react-icons/fa";

const navigation = {
  solutions: [
    { name: "Marketing", href: "#" },
    { name: "Analytics", href: "#" },
    { name: "Commerce", href: "#" },
    { name: "Insights", href: "#" },
  ],
  support: [
    { name: "Pricing", href: "#" },
    { name: "Documentation", href: "#" },
    { name: "Guides", href: "#" },
    { name: "API Status", href: "#" },
  ],
  company: [
    { name: "About", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Jobs", href: "#" },
    { name: "Press", href: "#" },
    { name: "Partners", href: "#" },
  ],
  logins: [
    { name: "Synology", href: "http://account.synology.com" },
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
              Making the world a better place through constructing elegant hierarchies.
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
                <h3 className="text-sm font-semibold leading-6 text-white">Solutions</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.solutions.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className="text-sm leading-6 text-gray-300 hover:text-white">
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">Support</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.support.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className="text-sm leading-6 text-gray-300 hover:text-white">
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">Company</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.company.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className="text-sm leading-6 text-gray-300 hover:text-white">
                        {item.name}
                      </a>
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
            <Link href="https://github.com/Otisz" target="_blank">
              Levente Otta
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
