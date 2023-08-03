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
                      Akrobatikus Torna <br /> &quot;A&quot; kategória
                    </span>
                    <span className="text-sky-500">Nemzetközi kategória</span>
                    <span className="text-orange-primary">
                      Legenda team EB VB
                      <br />
                      és Kiemelt nemzetközi versenyek
                    </span>
                  </div>
                </th>
                <td>
                  <div className="flex flex-col gap-4">
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
                  <div className="flex flex-col gap-4">
                    <span className="select-none opacity-0">-</span>
                    <span className="select-none opacity-0">-</span>
                    <span className="text-orange-primary">
                      18<sup>00</sup> - 20<sup>00</sup>
                    </span>
                  </div>
                </td>
                <td>
                  <div className="flex flex-col gap-4">
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
                  <div className="flex flex-col gap-4">
                    <span className="select-none opacity-0">-</span>
                    <span className="select-none opacity-0">-</span>
                    <span className="text-orange-primary">
                      18<sup>00</sup> - 20<sup>00</sup>
                    </span>
                  </div>
                </td>
                <td>
                  <div className="flex flex-col gap-4">
                    <span>
                      17<sup>00</sup> - 20<sup>00</sup>
                    </span>
                    <span className="text-sky-500">
                      17<sup>00</sup> - 20<sup>30</sup>
                    </span>
                    <span className="text-orange-primary">
                      18<sup>00</sup> - 20<sup>30</sup>
                    </span>
                  </div>
                </td>
                <td>
                  <div className="flex flex-col gap-4">
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
                  Akrobatikus Torna <br /> rekreációs csoport <br /> és haladó {'"'}B{'"'} kategória
                </th>
                <td></td>
                <td>
                  16<sup>00</sup> - 18<sup>00</sup>
                </td>
                <td>
                  ugróedzés <br /> 16<sup>00</sup> - 17<sup>00</sup>
                </td>
                <td></td>
                <td>
                  16<sup>00</sup> - 18<sup>00</sup>
                </td>
                <td>
                  felvehető <br /> 10<sup>00</sup> - 12<sup>00</sup>
                </td>
              </tr>
              <tr>
                <th>
                  Akrobatikus Torna <br /> kezdő {'"'}B{'"'} kategória
                </th>
                <td></td>
                <td>
                  18<sup>00</sup> - 20<sup>00</sup>
                </td>
                <td>
                  ugróedzés <br /> 16<sup>00</sup> - 17<sup>00</sup>
                </td>
                <td>
                  16<sup>00</sup> - 18<sup>00</sup>
                </td>
                <td></td>
                <td>
                  felvehető <br /> 10<sup>00</sup> - 12<sup>00</sup>
                </td>
              </tr>
              <tr>
                <th>
                  Szertorna, <br /> akrobatikus torna előkészítő <br />
                  {'"'}Gyémánt{'"'}csoport
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
                <th>Felnőtt ugróedzés</th>
                <td>
                  19<sup>00</sup> - 20<sup>00</sup>
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <th>Balett</th>
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
