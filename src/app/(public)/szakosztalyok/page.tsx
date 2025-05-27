import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Szakosztályok",
  description: "Szakosztályok - Budai Akrobatikus Sport Egyesület",
};

export default function Page() {
  return (
    <main className="container space-y-8 px-4 pt-8 pb-20">
      <h1 className="text-5xl">Szakosztályok</h1>
      <div className="overflow-x-auto">
        <table className="table-auto! w-full border-collapse overflow-x-scroll whitespace-nowrap bg-gray-900 text-center text-white md:table-fixed [&_a]:underline [&_td]:border-2 [&_td]:border-primary [&_td]:px-4 [&_td]:py-6 [&_th]:border-2 [&_th]:border-primary [&_th]:px-4 [&_th]:py-6">
          <thead>
            <tr>
              <th>Sportág megnevezése</th>
              <th>Kategória</th>
              <th className="text-5xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 1200 600"
                  className="mx-auto aspect-2/1 h-16"
                  aria-label="Hazai"
                  role="img"
                >
                  <path d="M0 0h1200v600H0" fill="#477050" />
                  <path d="M0 0h1200v400H0" fill="#fff" />
                  <path d="M0 0h1200v200H0" fill="#ce2939" />
                </svg>
              </th>
              <th className="text-5xl">
                <svg
                  className="mx-auto h-16 fill-white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 466.337 466.337"
                  aria-label="Nemzetközi"
                  role="img"
                >
                  <g>
                    <path d="M233.168,0C104.604,0,0,104.604,0,233.168c0,128.565,104.604,233.169,233.168,233.169 c128.565,0,233.169-104.604,233.169-233.169C466.337,104.604,361.733,0,233.168,0z M223.984,441.874 c-22.321,0-46.405-41.384-59.045-107.815h118.067C270.371,400.49,246.316,441.874,223.984,441.874z M161.114,310.144 c-2.738-19.991-4.437-41.781-4.881-65.018H291.74c-0.443,23.237-2.148,45.027-4.869,65.018H161.114z M24.521,245.126h107.704 c0.443,21.883,2.09,43.859,4.887,65.018H38.768C30.693,289.826,25.818,267.966,24.521,245.126z M223.984,24.464 c21.982,0,45.687,40.14,58.484,104.877h-116.97C178.286,64.604,201.996,24.464,223.984,24.464z M286.463,153.245 c2.978,20.785,4.811,43.596,5.277,67.966H156.222c0.467-24.37,2.295-47.169,5.272-67.966H286.463z M132.226,221.211H24.521 c1.354-23.926,6.568-46.836,15.332-67.966h97.656C134.462,175.32,132.681,198.312,132.226,221.211z M315.749,245.126h126.065 c-1.296,22.84-6.188,44.7-14.246,65.018H310.855C313.646,288.985,315.305,267.009,315.749,245.126z M315.749,221.211 c-0.468-22.898-2.254-45.891-5.29-67.966h116.023c8.77,21.13,13.978,44.04,15.332,67.966H315.749z M414.596,129.33H306.617 c-7.894-42.067-20.727-78.844-38.195-102.222C330.952,37.799,384.06,76.205,414.596,129.33z M176.073,32.036 c-15.7,23.459-27.348,58.1-34.699,97.305H51.741C78.657,82.505,123.064,47.1,176.073,32.036z M49.96,334.058h90.895 c7.311,40.403,19.133,76.205,35.219,100.26C121.944,418.904,76.672,382.378,49.96,334.058z M268.41,439.222 c17.865-23.938,30.874-61.889,38.697-105.164h109.274C386.15,388.743,332.12,428.339,268.41,439.222z" />
                  </g>
                </svg>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td rowSpan={2}>
                Akrobatikus Torna <br />(
                <a href="https://hu.frwiki.wiki/wiki/Gymnastique_acrobatique" target="_blank" rel="noreferrer">
                  Története
                </a>
                )
              </td>
              <td>&quot;A&quot; kategória</td>
              <td>
                Versenynaptár (
                <a href="/documents/Versenyszabályzat_2024_v_1_1.pdf" target="_blank" rel="noreferrer">
                  szabályzat
                </a>
                )
              </td>
              <td>
                <a
                  href="https://www.sportsacrobatics.info/sacalend.shtml?fbclid=IwAR1lo74G1DiIIjTr_ccNDMepAtzPAhEilZbpefDIj3v7Zp45qcGdvemnML0"
                  target="_blank"
                  rel="noreferrer"
                >
                  acrobatic gymnastics calendar
                </a>
              </td>
            </tr>
            <tr>
              <td>
                Utánpótlás versenyrendszere
                <ul className="mt-2 list-inside list-disc pl-8 text-left">
                  <li>Rekreáció</li>
                  <li>&quot;B&quot; kategória</li>
                  <li>&quot;A&quot; kategória</li>
                </ul>
              </td>
              <td>
                Versenynaptár (
                <a href="/documents/1Viktoria-Kupa-versenyszabalyzat.pdf" target="_blank" rel="noreferrer">
                  szabályzat
                </a>
                )
                <br />
                Kiegészítő szabályzatok:
                <ul className="mt-2 list-inside list-disc pl-8 text-left">
                  <li>
                    <a href="/documents/Akro-freestlye-kategoria-szabalyai-2022.pdf" target="_blank" rel="noreferrer">
                      Freestyle
                    </a>
                  </li>
                  <li>
                    <a href="/documents/Gula_torna_szabalyok.pdf" target="_blank" rel="noreferrer">
                      Gúlatorna
                    </a>
                  </li>
                  <li>
                    <a href="/documents/Kezallas_szabalyzat.pdf" target="_blank" rel="noreferrer">
                      Kézállófa
                    </a>
                  </li>
                </ul>
              </td>
              <td>
                <div className="flex flex-col gap-4">
                  <a
                    href="/documents/Acro-Calendar-2022-2023.pdf"
                    target="_blank"
                    lang="en"
                    className="inline-flex items-center justify-center gap-2"
                    rel="noreferrer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 60 30"
                      className="aspect-2/1 w-10"
                      aria-label="Nagy-Britannia"
                      role="img"
                    >
                      <clipPath id="a">
                        <path d="M0 0v30h60V0z" />
                      </clipPath>
                      <clipPath id="b">
                        <path d="M30 15h30v15zv15H0zH0V0zV0h30z" />
                      </clipPath>
                      <g clipPath="url(#a)">
                        <path d="M0 0v30h60V0z" fill="#012169" />
                        <path d="m0 0 60 30m0-30L0 30" stroke="#fff" strokeWidth="6" />
                        <path d="m0 0 60 30m0-30L0 30" clipPath="url(#b)" stroke="#C8102E" strokeWidth="4" />
                        <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
                        <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6" />
                      </g>
                    </svg>
                    <span id="gb">GB</span>
                  </a>
                  <a
                    href="https://www.csitgymnasticschampionships.com/acrobatic/"
                    target="_blank"
                    lang="en"
                    className="inline-flex items-center justify-center gap-2"
                    rel="noreferrer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 3 2"
                      className="aspect-3/2 w-10"
                      aria-label="Olaszorszag"
                      role="img"
                    >
                      <path fill="#009246" d="M0 0h3v2H0z" />
                      <path fill="#fff" d="M1 0h2v2H1z" />
                      <path fill="#ce2b37" d="M2 0h1v2H2z" />
                    </svg>
                    <span id="italy">Italy</span>
                  </a>
                </div>
              </td>
            </tr>
            <tr>
              <td>Tánc</td>
              <td>Akrobatikus tánc</td>
              <td>
                Versenynaptár (
                <a href="/documents/Szabályzat%202024%20MLTSZ.pdf" target="_blank" rel="noreferrer">
                  szabályzat
                </a>
                )
              </td>
              <td />
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}
