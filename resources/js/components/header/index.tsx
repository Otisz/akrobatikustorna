/** biome-ignore-all lint/correctness/useUniqueElementIds: <explanation> */
import { Link } from "@inertiajs/react";
import { LuPhone } from "react-icons/lu";
import { SiFacebook, SiInstagram, SiYoutube } from "react-icons/si";
import { buttonVariants } from "@/components/ui/button";
import LINKS from "@/data/links";

export default function Header() {
  return (
    <header className="h-14 bg-primary">
      <div className="container flex h-full items-center justify-between gap-4">
        <a
          href="tel:+36 20 311 1919"
          aria-label="Hívjon minket a +36 20 311 1919 telefonszámon"
          className="inline-flex items-center gap-x-2 text-xl hover:underline hover:underline-offset-2"
          title="Hívjon minket a +36 20 311 1919 telefonszámon"
        >
          <LuPhone />
          <span>+36 20 311 1919</span>
        </a>
        <div className="flex items-center gap-x-8">
          <Link
            href={LINKS.apply}
            className={buttonVariants({ variant: "secondary", size: "sm" })}
            aria-label="Tovább a jelentkezés oldalra (új lap)"
            title="Jelentkezés Google Forms-on keresztül"
          >
            Jelentkezés
          </Link>
          <div className="hidden gap-x-4 md:flex">
            <a
              href={LINKS.facebook}
              target="_blank"
              aria-label="Tekintse meg a Facebook oldalunkat"
              className="group"
              title="Facebook"
              rel="noreferrer"
            >
              <SiFacebook className="size-8 group-hover:fill-[#4267b2]" />
            </a>
            <a
              href={LINKS.instagram}
              target="_blank"
              aria-label="Tekintse meg a Instagram oldalunkat"
              className="group"
              title="Instagram"
              rel="noreferrer"
            >
              <SiInstagram className="size-8 group-hover:hidden" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlSpace="preserve"
                viewBox="0 0 551.034 551.034"
                className="hidden size-8 group-hover:block"
                aria-label="Instagram"
                role="img"
              >
                <linearGradient
                  id="a"
                  x1={275.517}
                  x2={275.517}
                  y1={4.571}
                  y2={549.72}
                  gradientTransform="matrix(1 0 0 -1 0 554)"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop
                    offset={0}
                    style={{
                      stopColor: "#e09b3d",
                    }}
                  />
                  <stop
                    offset={0.3}
                    style={{
                      stopColor: "#c74c4d",
                    }}
                  />
                  <stop
                    offset={0.6}
                    style={{
                      stopColor: "#c21975",
                    }}
                  />
                  <stop
                    offset={1}
                    style={{
                      stopColor: "#7024c4",
                    }}
                  />
                </linearGradient>
                <path
                  d="M386.878 0H164.156C73.64 0 0 73.64 0 164.156v222.722c0 90.516 73.64 164.156 164.156 164.156h222.722c90.516 0 164.156-73.64 164.156-164.156V164.156C551.033 73.64 477.393 0 386.878 0zM495.6 386.878c0 60.045-48.677 108.722-108.722 108.722H164.156c-60.045 0-108.722-48.677-108.722-108.722V164.156c0-60.046 48.677-108.722 108.722-108.722h222.722c60.045 0 108.722 48.676 108.722 108.722v222.722z"
                  style={{
                    fill: "url(#a)",
                  }}
                />
                <linearGradient
                  id="b"
                  x1={275.517}
                  x2={275.517}
                  y1={4.571}
                  y2={549.72}
                  gradientTransform="matrix(1 0 0 -1 0 554)"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop
                    offset={0}
                    style={{
                      stopColor: "#e09b3d",
                    }}
                  />
                  <stop
                    offset={0.3}
                    style={{
                      stopColor: "#c74c4d",
                    }}
                  />
                  <stop
                    offset={0.6}
                    style={{
                      stopColor: "#c21975",
                    }}
                  />
                  <stop
                    offset={1}
                    style={{
                      stopColor: "#7024c4",
                    }}
                  />
                </linearGradient>
                <path
                  d="M275.517 133C196.933 133 133 196.933 133 275.516s63.933 142.517 142.517 142.517S418.034 354.1 418.034 275.516 354.101 133 275.517 133zm0 229.6c-48.095 0-87.083-38.988-87.083-87.083s38.989-87.083 87.083-87.083c48.095 0 87.083 38.988 87.083 87.083 0 48.094-38.989 87.083-87.083 87.083z"
                  style={{
                    fill: "url(#b)",
                  }}
                />
                <linearGradient
                  id="c"
                  x1={418.306}
                  x2={418.306}
                  y1={4.571}
                  y2={549.72}
                  gradientTransform="matrix(1 0 0 -1 0 554)"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop
                    offset={0}
                    style={{
                      stopColor: "#e09b3d",
                    }}
                  />
                  <stop
                    offset={0.3}
                    style={{
                      stopColor: "#c74c4d",
                    }}
                  />
                  <stop
                    offset={0.6}
                    style={{
                      stopColor: "#c21975",
                    }}
                  />
                  <stop
                    offset={1}
                    style={{
                      stopColor: "#7024c4",
                    }}
                  />
                </linearGradient>
                <circle
                  cx={418.306}
                  cy={134.072}
                  r={34.149}
                  style={{
                    fill: "url(#c)",
                  }}
                />
              </svg>
            </a>
            <a
              href={LINKS.youtube}
              target="_blank"
              aria-label="Tekintse meg a Youtube oldalunkat"
              className="group"
              title="Youtube"
              rel="noreferrer"
            >
              <SiYoutube className="size-8 group-hover:fill-[#ff0000]" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
