import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Edzéseink",
  description: "Edzéseink - Budai Akrobatikus Sport Egyesület",
};

export default function Page() {
  return (
    <main>
      <div className="mx-auto w-full max-w-7xl space-y-8 px-4 pb-20 pt-8 sm:px-6">
        <h1 className="mb-16 text-5xl">Edzéseink</h1>
        <div className="overflow-x-auto">
          <table className="table-primary table-auto overflow-x-scroll">
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
              <tr>
                <th>
                  <div className="flex flex-col gap-2">
                    <span>
                      Akrobatikus Torna &quot;A&quot; kategória
                      <br />
                      Hazai versenyzők
                    </span>
                    <span className="text-sky-500">Nemzetközi versenyzők</span>
                    <span className="text-orange-primary">
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
                    <span className="text-orange-primary">
                      16<sup>00</sup> - 19<sup>30</sup>
                    </span>
                  </div>
                </td>
                <td>
                  <div className="flex flex-col gap-8">
                    <span className="select-none opacity-0">-</span>
                    <span className="select-none opacity-0">-</span>
                    <span className="text-orange-primary">
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
                    <span className="text-orange-primary">
                      16<sup>00</sup> - 19<sup>30</sup>
                    </span>
                  </div>
                </td>
                <td>
                  <div className="flex flex-col gap-8">
                    <span className="select-none opacity-0">-</span>
                    <span className="select-none opacity-0">-</span>
                    <span className="text-orange-primary">
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
                    <span className="text-orange-primary">
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
                    <span className="text-orange-primary">
                      10<sup>00</sup> - 13<sup>00</sup>
                    </span>
                  </div>
                </td>
              </tr>
              <tr>
                <th>
                  Akrobatikus Torna &quot;B&quot; kategória <br /> haladó versenyzők
                </th>
                <td></td>
                <td>
                  16<sup>00</sup> - 18<sup>00</sup>
                </td>
                <td>
                  16<sup>00</sup> - 17<sup>00</sup>
                  <br />
                  <span className="text-sm">ugróedzés</span>
                </td>
                <td></td>
                <td>
                  16<sup>00</sup> - 18<sup>00</sup>
                </td>
                <td>
                  10<sup>00</sup> - 12<sup>00</sup>
                  <br />
                  <span className="text-sm">felvehető</span>
                </td>
              </tr>
              <tr>
                <th>
                  Akrobatikus Torna &quot;B&quot; kategória <br /> rekreációs csoport <br /> és kezdő versenyzők
                </th>
                <td></td>
                <td>
                  18<sup>00</sup> - 20<sup>00</sup>
                </td>
                <td>
                  16<sup>00</sup> - 17<sup>00</sup>
                  <br />
                  <span className="text-sm">ugróedzés</span>
                </td>
                <td>
                  16<sup>00</sup> - 18<sup>00</sup>
                </td>
                <td></td>
                <td>
                  10<sup>00</sup> - 12<sup>00</sup>
                  <br />
                  <span className="text-sm">felvehető</span>
                </td>
              </tr>
              <tr>
                <th>
                  Szertorna, <br /> akrobatikus torna előkészítő <br />
                  &quot;Gyémánt&quot; csoport
                </th>
                <td></td>
                <td>
                  16<sup>00</sup> - 17<sup>30</sup>
                </td>
                <td></td>
                <td>
                  16<sup>00</sup> - 17<sup>30</sup>
                </td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <th>
                  Meghívásos akrobatika <br /> és ugróedzések
                </th>
                <td></td>
                <td>
                  17<sup>30</sup> - 18<sup>30</sup>
                </td>
                <td></td>
                <td>
                  17<sup>30</sup> - 18<sup>30</sup>
                </td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <th>
                  <div className="flex flex-col gap-2">
                    <span>Látványtánc</span>
                    <span className="text-orange-primary">A kategória</span>
                    <span>B kategória</span>
                  </div>
                </th>
                <td></td>
                <td>
                  <div className="flex flex-col gap-2">
                    <span className="select-none opacity-0">-</span>
                    <span className="select-none opacity-0">-</span>
                    <span>
                      16<sup>00</sup> - 18<sup>00</sup>
                    </span>
                  </div>
                </td>
                <td></td>
                <td>
                  <div className="flex flex-col gap-2">
                    <span className="select-none opacity-0">-</span>
                    <span className="text-orange-primary">
                      18<sup>00</sup> - 20<sup>00</sup>
                    </span>
                    <span>
                      16<sup>00</sup> - 18<sup>00</sup>
                    </span>
                  </div>
                </td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <th>Szabadidős - örömtorna</th>
                <td>
                  17<sup>30</sup> - 19<sup>00</sup>
                </td>
                <td></td>
                <td>
                  17<sup>30</sup> - 19<sup>00</sup>
                </td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <th>Modern Tánc</th>
                <td>
                  16<sup>00</sup> - 17<sup>30</sup>
                </td>
                <td></td>
                <td>
                  16<sup>00</sup> - 17<sup>30</sup>
                </td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <th>
                  Mozgásképzés, alap balett
                  <br />
                  <span className="text-sm font-normal">(Legend Team versenyzőknek kötelező)</span>
                </th>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>
                  17<sup>00</sup> - 18<sup>00</sup>
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
