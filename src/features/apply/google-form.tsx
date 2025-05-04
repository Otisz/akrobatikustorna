"use client";

export default function GoogleForm() {
  return (
    <iframe
      src="https://docs.google.com/forms/d/e/1FAIpQLScuoLL1rYrgj1ohglnjoGDWRKFCPaCMdUhJ3zs96EXm4tytWw/viewform?embedded=true"
      className="min-h-500 w-full"
      onLoad={(e) => {
        try {
          e.currentTarget.style.height = `${e.currentTarget.contentWindow?.document.body.scrollHeight}px`;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
          // ignore
        }
      }}
    >
      Betöltés…
    </iframe>
  );
}
