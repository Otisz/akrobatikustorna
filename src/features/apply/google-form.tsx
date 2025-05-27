"use client";

export default function GoogleForm() {
  return (
    <iframe
      src="https://docs.google.com/forms/d/e/1FAIpQLScuoLL1rYrgj1ohglnjoGDWRKFCPaCMdUhJ3zs96EXm4tytWw/viewform?embedded=true"
      className="min-h-500 w-full"
      title="Jelentkezés űrlap"
      onLoad={(e) => {
        try {
          e.currentTarget.style.height = `${e.currentTarget.contentWindow?.document.body.scrollHeight}px`;
        } catch (_e) {
          // ignore
        }
      }}
    >
      Betöltés…
    </iframe>
  );
}
