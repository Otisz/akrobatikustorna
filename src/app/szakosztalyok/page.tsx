import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Szakosztályok - Budai Akrobatikus Sport Egyesület",
  description: "Szakosztályok - Budai Akrobatikus Sport Egyesület",
};

export default () => (
  <main>
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 pb-20 pt-8 sm:px-6">
      <h1 className="mb-16 text-5xl">Szakosztályok</h1>
      <div className="overflow-x-auto">
        <table className="table-primary overflow-x-scroll">
          <thead>
            <tr>
              <th>Sportág megnevezése</th>
              <th>Kategória</th>
              <th className="text-5xl">
                <span className="sr-only">Hazai</span>🇭🇺
              </th>
              <th className="text-5xl">
                <span className="sr-only">Nemzetközi</span>🌍
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td rowSpan={2}>
                Akrobatikus Torna <br />(
                <Link href="https://hu.frwiki.wiki/wiki/Gymnastique_acrobatique" target="_blank">
                  Története
                </Link>
                )
              </td>
              <td>
                {'"'}A{'"'} kategória
              </td>
              <td>
                Versenynaptár (
                <Link href="/documents/Versenyszabalyzat_2022.pdf" target="_blank">
                  szabályzat
                </Link>
                )
              </td>
              <td>
                <Link
                  href="https://www.sportsacrobatics.info/sacalend.shtml?fbclid=IwAR1lo74G1DiIIjTr_ccNDMepAtzPAhEilZbpefDIj3v7Zp45qcGdvemnML0"
                  target="_blank"
                >
                  acrobatic gymnastics calendar
                </Link>
              </td>
            </tr>
            <tr>
              <td>
                Utánpótlás versenyrendszere
                <ul className="mt-2 list-inside list-disc pl-8 text-left">
                  <li>Rekreáció</li>
                  <li>
                    {'"'}B{'"'} kategória
                  </li>
                  <li>
                    {'"'}A{'"'} kategória
                  </li>
                </ul>
              </td>
              <td>
                Versenynaptár (
                <Link href="/documents/1Viktoria-Kupa-versenyszabalyzat.pdf" target="_blank">
                  szabályzat
                </Link>
                )
                <br />
                Kiegészítő szabályzatok:
                <ul className="mt-2 list-inside list-disc pl-8 text-left">
                  <li>
                    <Link href="/documents/Akro-freestlye-kategoria-szabalyai-2022.pdf" target="_blank">
                      Freestyle
                    </Link>
                  </li>
                  <li>
                    <Link href="/documents/Gula_torna_szabalyok.pdf" target="_blank">
                      Gúlatorna
                    </Link>
                  </li>
                  <li>
                    <Link href="/documents/Kezallas_szabalyzat.pdf" target="_blank">
                      Kézállófa
                    </Link>
                  </li>
                </ul>
              </td>
              <td>
                <div className="flex flex-col gap-4">
                  <Link href="/documents/Acro-Calendar-2022-2023.pdf" target="_blank">
                    <span className="text-xl">🇬🇧</span> UK
                  </Link>
                  <Link href="https://www.csitgymnasticschampionships.com/acrobatic/" target="_blank">
                    <span className="text-xl">🇮🇹</span> Italy
                  </Link>
                </div>
              </td>
            </tr>
            <tr>
              <td rowSpan={2}>
                CheerLeading <br /> (
                <Link href="https://hu.wikipedia.org/wiki/Cheerleading#T%C3%B6rt%C3%A9nete" target="_blank">
                  Története
                </Link>
                )
              </td>
              <td>
                Cheer {'"'}acro{'"'}
              </td>
              <td>Versenynaptár (szabályzat)</td>
              <td></td>
            </tr>
            <tr>
              <td>Cheerdance</td>
              <td>Versenynaptár (szabályzat)</td>
              <td></td>
            </tr>
            <tr>
              <td>Látványtánc</td>
              <td>Akrobatikus látványtánc</td>
              <td>
                Versenynaptár (
                <Link href="/documents/latvanytanc%20Versenyszabalyzat-2022.pdf" target="_blank">
                  szabályzat
                </Link>
                )
              </td>
              <td></td>
            </tr>
            <tr>
              <td rowSpan={3}>
                Szertorna <br /> (
                <Link href="https://hu.wikipedia.org/wiki/Torna_(sport)#T%C3%B6rt%C3%A9nete" target="_blank">
                  Története
                </Link>
                )
              </td>
              <td>Férfi Torna</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>Női Torna</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>
                Női Torna {'"'}Zsebibaba{'"'}
              </td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
);
