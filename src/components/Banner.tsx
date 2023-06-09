import Link from "next/link";

type Props = {
  hide?: boolean;
};

export default function Banner(props: Props) {
  if (props.hide) {
    return null;
  }

  return (
    <div className="bg-orange-primary">
      <div className="mx-auto max-w-7xl px-3 py-3 sm:px-6 lg:px-8">
        <div className="pr-16 sm:px-16 sm:text-center">
          <p className="font-medium text-white">
            <Link href="/images/egyszazalek.png" className="font-bold text-white underline">
              Legyél részese sikereinknek! 😇Neked 1% (és &quot;csak&quot; rendelkezni kell, nekünk minden 1%, 100%
              segítség! 👍 Tudsz segíteni 1% adományozással, felhívás megosztásával, ajánlással! ❤ A támogatás segítség
              a versenyekre való kijutásban , sportszerekvásárlásában és a megelmelkedett működési költségek
              kifizetésében! Együttműködést előre is köszönjük!
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
