const schritte = [
  {
    titel: 'Kennenlernen',
    text: 'Wir hören zu: Was macht Ihren Betrieb besonders? Daraus entsteht die Geschichte Ihrer Website.',
    icon: 'M4 6h16v10H8l-4 4V6z',
  },
  {
    titel: 'Bilder & Szenen',
    text: 'Wir gestalten Szenen und Übergänge — mit Ihren eigenen Fotos oder mit eigens erzeugten Bildwelten.',
    icon: 'M3 5h18v14H3zM3 15l5-5 4 4 3-3 6 6',
  },
  {
    titel: 'Code & Bewegung',
    text: 'Von Hand programmiert: schnell, flüssig und auch auf dem Handy ein Erlebnis. Keine schweren Videos.',
    icon: 'M8 7l-5 5 5 5M16 7l5 5-5 5M13 5l-2 14',
  },
  {
    titel: 'Live & Wow',
    text: 'Ihre Website geht online, gehostet in der Schweiz. Und Ihre Kunden erzählen davon.',
    icon: 'M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6-4.5-4.2 6.1-.7z',
  },
];

// Proceso: una línea de luz se dibuja con el scroll y enciende cada paso al llegar a él.
export default function Ablauf() {
  return (
    <section data-bg="#0a0b18" data-ablauf aria-labelledby="ablauf-titel" className="relative px-6 py-32 md:px-12 md:py-44">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="font-mono text-[11px] tracking-[0.3em] text-akzent uppercase">So entsteht sie</p>
          <h2 id="ablauf-titel" data-split className="mt-4 text-5xl leading-[0.95] md:text-7xl">
            Vier Schritte bis zum <em className="text-akzent">Wow</em>
          </h2>
        </div>

        <ol className="relative mt-20 md:mt-28">
          <span aria-hidden="true" className="absolute top-0 bottom-0 left-[15px] w-px bg-nieve/10 md:left-1/2">
            <span data-ablauf-linie className="absolute inset-0 origin-top scale-y-0 bg-linear-to-b from-akzent via-akzent to-akzent/0 shadow-[0_0_18px_rgba(242,180,109,0.6)]" />
          </span>
          {schritte.map((s, i) => (
            <li key={s.titel} data-schritt className={`relative pb-16 pl-14 last:pb-0 md:w-1/2 md:pl-0 ${i % 2 ? 'md:ml-auto md:pl-16' : 'md:pr-16 md:text-right'}`}>
              <span
                data-punkt
                aria-hidden="true"
                className={`punkt absolute top-1 left-[7px] size-[17px] rounded-full bg-noche ring-2 ring-nieve/20 ${i % 2 ? 'md:-left-[8.5px]' : 'md:left-auto md:-right-[8.5px]'}`}
              />
              <div data-schritt-inhalt data-seite={i % 2 ? 'rechts' : 'links'}>
                <div className={`flex items-center gap-4 ${i % 2 ? '' : 'md:flex-row-reverse'}`}>
                  <span className="grid size-12 place-items-center rounded-2xl bg-akzent/10 text-akzent ring-1 ring-akzent/30">
                    <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d={s.icon} />
                    </svg>
                  </span>
                  <span className="font-mono text-5xl font-light text-nieve/15 md:text-6xl">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="mt-5 text-3xl md:text-4xl">{s.titel}</h3>
                <p className={`mt-3 max-w-sm text-base text-nieve/65 ${i % 2 ? '' : 'md:ml-auto'}`}>{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
