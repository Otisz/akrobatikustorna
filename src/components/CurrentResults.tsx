import { FC } from "react";

const posts = [
  {
    title: "FTC Viktória Kupa",
    description:
      "2022. október 23-án rendezték meg az FTC Viktória Kupát. Felkészülés terén még korai volt ez a verseny, de így is 17 egységgel tudtunk indulni. A gyakorlatokon még itt-ott látszott egy kis izgalom, de így is gyönyörű eredmények születtek: 13 arany-, 1 ezüst-, és 3 bronzérmet sikerült nyerniük a versenyzőinknek. Gratulálunk az edzőknek, versenyzőknek. Hajrá BASE!",
    imageUrl:
      "https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3603&q=80",
    date: "2022. 10. 23.",
    datetime: "2022-10-23",
  },
  {
    title: "FTC Viktória Kupa",
    description: `##### 2022.10.01-02. --- 5th Budapest International Acro Cup

Fantasztikus hétvégén vagyunk túl. Szombat, vasárnap rendezték meg az Akrobatikus Torna 5. Budapesti International Acro Cup-t, melyen 5 egységgel vettünk részt.! Szombaton a döntőbe jutásért küzdöttek versenyzőink. Eszter Marton (TFSE)- Müller Khaohom Youth vegyes páros 7 egység közül jutottak be a legjobb 6-ba, Schirilla Alíz-Horváth Léna- Horváth Dóri Youth női hármasunk 23 egység közül jutottak be a legjobb 8-ba, Kecskés Hanna- Kaposi Borbála és Németh Luca- Kenyeres Zsófia Youth női párosaink 16 egység közül jutottak a legjobb 8-ba, Cziráki Panka- Sztojka Zsófia – Monori Janka 11-16-os korcsoportos női hármasunk szintén 23-ból jutottak a legjobb 8-as döntőbe. Már az maga remek teljesítmény volt, hogy minden egységünk bejutott a döntőbe, hiszen minden korosztályban és kategóriában hihetetlenül erős külföldi ellenfelek voltak. Vasárnap került sor a döntőre, ahol még jobb gyakorlatokat adtak elő versenyzőink, amivel a következő, remek eredményeket értek el.

*   Eszter Márton (TFSE)- Müller Khaohom III. hely
*   Németh Luca-Kenyeres Zsófi III. hely
*   Kecskés Hanna-Kaposi Bori V. hely
*   Horváth Léna-Schirilla Alíz-Horváth Dóri V. hely
*   Monori Janka-Sztojka Zsófia-Cziráki Panna VI. hely.

Olyan jó, hogy a sok befektetett energia, munka visszaköszön az eredményekben! Hálásak vagyunk, hogy ilyen jó versenyzőink, edzőink vannak! Nagyon büszkék vagyunk mindenkire. Fantasztikus, amit ezen a hétvégén nyújtottatok! Hajrá BASE! ❤️`,
    imageUrl:
      "https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3603&q=80",
    date: "2022. 10. 23.",
    datetime: "2022-10-23",
  },
];

const CurrentResults: FC = () => {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Aktuális eredményeink</h2>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          {posts.map((post, i) => (
            <article key={i} className="flex flex-col items-start justify-between">
              <div className="relative w-full">
                <img
                  src={post.imageUrl}
                  alt=""
                  className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
              </div>
              <div className="max-w-xl">
                <div className="mt-8 flex items-center gap-x-4 text-xs">
                  <time dateTime={post.datetime} className="text-gray-500">
                    {post.date}
                  </time>
                </div>
                <div className="group relative">
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                    <span className="absolute inset-0" />
                    {post.title}
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">{post.description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CurrentResults;
