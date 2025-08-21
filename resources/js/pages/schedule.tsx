import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";

const HASH_LIST = {
  "a-kategoriak": "a-kategoriak",
  "gyongy-csoport": "gyongy-csoport",
  "gyemant-csoport": "gyemant-csoport",
  "szabadidos-oromtorna": "szabadidos-oromtorna",
  "kezdo-b-kategoria": "kezdo-b-kategoria",
  "halado-b-kategoria": "halado-b-kategoria",
  "hazai-a-kategoria": "hazai-a-kategoria",
  "nemzetkozi-a-kategoria": "nemzetkozi-a-kategoria",
  "kiemelt-a-kategoria": "kiemelt-a-kategoria",
  "magan-es-meghivasos-akrobatika-es-ugroedzes": "magan-es-meghivasos-akrobatika-es-ugroedzes",
  "mozgaskepzes-alap-balett": "mozgaskepzes-alap-balett",
} as const;

export default function Page() {
  return (
    <AppLayout>
      <Head title="Edzéseink"></Head>
      <main className="container space-y-8 px-4 pt-8 pb-20">
        <h1 className="text-5xl">Edzéseink</h1>

        <div className="prose max-w-none prose-a:font-normal marker:text-primary">
          <p className="font-semibold">
            Egyesületünkben, felmérés (első próbaedzés) után kerülhetnek a megfelelő csoportba a gyerekek, azaz a
            jelenlegi teljesítményét nézi a vezetőedző.
          </p>
          <p>Akrobatikus torna szakosztályunkban, lehet valaki:</p>
          <ul>
            <li>
              <Link href={`#${HASH_LIST["gyongy-csoport"]}`} prefetch={false}>
                Gyöngy csoportos
              </Link>
            </li>
            <li>
              <Link href={`#${HASH_LIST["gyemant-csoport"]}`} prefetch={false}>
                Gyémánt csoportos
              </Link>
            </li>
            <li>
              <Link href={`#${HASH_LIST["szabadidos-oromtorna"]}`} prefetch={false}>
                Szabadidős sportoló, aki nem szeretne vagy valamilyen okból nem tud versenyezni
              </Link>
            </li>
            <li>
              <Link href={`#${HASH_LIST["kezdo-b-kategoria"]}`} prefetch={false}>
                Kezdő leigazolt B kategóriás vagy rajtengedélyes versenyző
              </Link>
            </li>
            <li>
              <Link href={`#${HASH_LIST["halado-b-kategoria"]}`} prefetch={false}>
                Haladó leigazolt B kategóriás vagy rajtengedélyes versenyző
              </Link>
            </li>
            <li>
              <Link href={`#${HASH_LIST["hazai-a-kategoria"]}`} prefetch={false}>
                Felsőszintű leigazolt A kategriás versenyző (hazai pontszerző verseny)
              </Link>
            </li>
            <li>
              <Link href={`#${HASH_LIST["nemzetkozi-a-kategoria"]}`} prefetch={false}>
                Felsőszintű leigazolt A kategriás versenyző (nemzetközi pontszerző verseny)
              </Link>
            </li>
            <li>
              <Link href={`#${HASH_LIST["kiemelt-a-kategoria"]}`} prefetch={false}>
                Kiemelt szintű leigazolt A kategóriás versenyző (EB, VB, világkupa)
              </Link>
            </li>
          </ul>
          <p className="font-semibold">
            A megfelelő csoportba sorolást az első &quot;próbaedzés&quot; után az edző javaslata alapján a szülővel,
            gyerekkel egyeztetve alakítjuk ki.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="table-auto! w-full border-collapse overflow-x-scroll whitespace-nowrap bg-gray-900 text-center text-white md:table-fixed [&_a]:underline [&_td]:border-2 [&_td]:border-primary [&_td]:px-4 [&_td]:py-6 [&_th]:border-2 [&_th]:border-primary [&_th]:px-4 [&_th]:py-6">
            <thead>
              <tr>
                <th>Kategória</th>
                <th>Hétfő</th>
                <th>Kedd</th>
                <th>Szerda</th>
                <th>Csütörtök</th>
                <th>Péntek</th>
                <th>Szombat</th>
              </tr>
            </thead>
            <tbody>
              <tr id={HASH_LIST["a-kategoriak"]}>
                <th>
                  <div className="flex flex-col gap-2">
                    <span id={HASH_LIST["hazai-a-kategoria"]}>
                      Akrobatikus Torna &quot;A&quot; kategória
                      <br />
                      Hazai versenyzők
                    </span>
                    <span className="text-sky-500" id={HASH_LIST["nemzetkozi-a-kategoria"]}>
                      Nemzetközi versenyzők
                    </span>
                    <span className="text-primary" id={HASH_LIST["kiemelt-a-kategoria"]}>
                      Legend Team EB VB
                      <br />
                      és Kiemelt nemzetközi <br /> versenyek versenyzői
                    </span>
                  </div>
                </th>
                <td>
                  <div className="flex flex-col gap-8">
                    <span>
                      16<sup>00</sup> - 19<sup>00</sup>
                    </span>
                    <span className="text-sky-500">
                      16<sup>00</sup> - 19<sup>30</sup>
                    </span>
                    <span className="text-primary">
                      16<sup>00</sup> - 19<sup>30</sup>
                    </span>
                  </div>
                </td>
                <td>
                  <div className="flex flex-col gap-8">
                    <span className="select-none opacity-0">-</span>
                    <span className="select-none opacity-0">-</span>
                    <span className="text-primary">
                      18<sup>00</sup> - 20<sup>00</sup>
                    </span>
                  </div>
                </td>
                <td>
                  <div className="flex flex-col gap-8">
                    <span>
                      16<sup>00</sup> - 19<sup>00</sup>
                    </span>
                    <span className="text-sky-500">
                      16<sup>00</sup> - 19<sup>30</sup>
                    </span>
                    <span className="text-primary">
                      16<sup>00</sup> - 19<sup>30</sup>
                    </span>
                  </div>
                </td>
                <td>
                  <div className="flex flex-col gap-8">
                    <span className="select-none opacity-0">-</span>
                    <span className="select-none opacity-0">-</span>
                    <span className="text-primary">
                      18<sup>00</sup> - 20<sup>00</sup>
                    </span>
                  </div>
                </td>
                <td>
                  <div className="flex flex-col gap-8">
                    <span>
                      18<sup>00</sup> - 20<sup>00</sup>
                    </span>
                    <span className="text-sky-500">
                      18<sup>00</sup> - 20<sup>30</sup>
                    </span>
                    <span className="text-primary">
                      18<sup>00</sup> - 20<sup>30</sup>
                    </span>
                  </div>
                </td>
                <td>
                  <div className="flex flex-col gap-8">
                    <span className="select-none opacity-0">-</span>
                    <span className="text-sky-500">
                      10<sup>00</sup> - 13<sup>00</sup>
                    </span>
                    <span className="text-primary">
                      10<sup>00</sup> - 13<sup>00</sup>
                    </span>
                  </div>
                </td>
              </tr>
              <tr id={HASH_LIST["mozgaskepzes-alap-balett"]}>
                <th>
                  Mozgásképzés, alap balett
                  <br />
                  <span className="font-normal text-sm">(Legend Team versenyzőknek kötelező)</span>
                </th>
                <td />
                <td />
                <td />
                <td />
                <td>
                  17<sup>00</sup> - 18<sup>00</sup>
                </td>
                <td />
              </tr>
              <tr id={HASH_LIST["halado-b-kategoria"]}>
                <th>
                  Akrobatikus Torna &quot;B&quot; kategória <br /> haladó versenyzők
                </th>
                <td />
                <td>
                  16<sup>00</sup> - 18<sup>00</sup>
                </td>
                <td />
                <td />
                <td>
                  16<sup>00</sup> - 18<sup>00</sup>
                </td>
                <td>
                  10<sup>00</sup> - 12<sup>00</sup>
                  <br />
                  <span className="text-sm">felvehető</span>
                </td>
              </tr>
              <tr id={HASH_LIST["kezdo-b-kategoria"]}>
                <th>
                  Akrobatikus Torna &quot;B&quot; kategória <br />
                  rekreációs csoport <br />
                  és kezdő versenyzők <br />
                  <span className="font-normal text-sm">8 ~ 22 éves korig</span>
                </th>
                <td />
                <td>
                  18<sup>00</sup> - 20<sup>00</sup>
                </td>
                <td />
                <td>
                  16<sup>00</sup> - 18<sup>00</sup>
                </td>
                <td />
                <td>
                  10<sup>00</sup> - 12<sup>00</sup>
                  <br />
                  <span className="text-sm">felvehető</span>
                </td>
              </tr>
              <tr id={HASH_LIST["magan-es-meghivasos-akrobatika-es-ugroedzes"]}>
                <th>
                  Magán és meghívásos <br /> akrobatika és ugróedzések
                </th>
                <td />
                <td>
                  18<sup>00</sup> - 19<sup>00</sup>
                </td>
                <td />
                <td>
                  18<sup>00</sup> - 19<sup>00</sup>
                </td>
                <td />
                <td />
              </tr>
              <tr id={HASH_LIST["gyongy-csoport"]}>
                <th>
                  Torna előkészítő Gyöngy csoport <br />
                  <span className="font-normal text-sm">5 és fél - 7 éves korig</span>
                </th>
                <td>
                  16<sup>15</sup> - 17<sup>15</sup>
                </td>
                <td />
                <td>
                  16<sup>15</sup> - 17<sup>15</sup>
                </td>
                <td />
                <td />
                <td />
              </tr>
              <tr id={HASH_LIST["gyemant-csoport"]}>
                <th>
                  Torna előkészítő Gyémánt csoport <br />
                  <span className="font-normal text-sm">6 - 10 éves korig</span>
                </th>
                <td />
                <td>
                  16<sup>00</sup> - 17<sup>30</sup>
                </td>
                <td />
                <td>
                  16<sup>00</sup> - 17<sup>30</sup>
                </td>
                <td />
                <td />
              </tr>
              <tr id={HASH_LIST["szabadidos-oromtorna"]}>
                <th>
                  Szabadidős - örömtorna <br />
                  <span className="font-normal text-sm">~8 ~ 12 éves korig</span>
                </th>
                <td>
                  17<sup>30</sup> - 19<sup>00</sup>
                </td>
                <td />
                <td>
                  17<sup>30</sup> - 19<sup>00</sup>
                </td>
                <td />
                <td />
                <td />
              </tr>
              <tr>
                <th>
                  <div className="flex flex-col gap-2">
                    <span>Látványtánc</span>
                    <span className="text-primary">A kategória</span>
                    <span>B kategória</span>
                  </div>
                </th>
                <td />
                <td>
                  <div className="flex flex-col gap-2">
                    <span className="select-none opacity-0">-</span>
                    <span className="select-none opacity-0">-</span>
                    <span>
                      16<sup>00</sup> - 18<sup>00</sup>
                    </span>
                  </div>
                </td>
                <td />
                <td>
                  <div className="flex flex-col gap-2">
                    <span className="select-none opacity-0">-</span>
                    <span className="text-primary">
                      18<sup>00</sup> - 20<sup>00</sup>
                    </span>
                    <span>
                      16<sup>00</sup> - 18<sup>00</sup>
                    </span>
                  </div>
                </td>
                <td />
                <td />
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </AppLayout>
  );
}
