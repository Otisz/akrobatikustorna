interface Document {
  name: string;
  href: string;
}

const DOCUMENTS: Array<Document> = [
  {
    name: "GDPR - Adatkezelési hozzájárulási nyilatkozat",
    href: "/documents/GDPR%20nyilatkozat.pdf",
  },
  {
    name: "GDPR - Szabályzata",
    href: "/documents/GDPR%20szabalyzat.pdf",
  },
  {
    name: "1 %",
    href: "/documents/2022_adoszam.pdf",
  },
  {
    name: "Házirend",
    href: "/documents/hazirend.pdf",
  },
  {
    name: "Alapszabályzat",
    href: "/documents/BASE%20alapszabalyzata.pdf",
  },
  {
    name: "Belépési kérelem",
    href: "/documents/tagfelveteltkerolap.pdf",
  },
  {
    name: "Pártoló tagsági kérelem",
    href: "/documents/partoloitagfelveteltkerolap.pdf",
  },
  {
    name: "Tagnyilvántartó adatlap",
    href: "/documents/tagnyilvantartoadatlap.pdf",
  },
];

export default DOCUMENTS;
