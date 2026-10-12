// "Beispiele": dos webs reales para abrir en el móvil. Cada una en un teléfono que llega girado en 3D y se endereza con
// el scroll (secciones.ts → beispiele); en su pantalla, cada escena se abre dentro de la anterior con un círculo, como
// el recorrido por portales en miniatura (CSS: .mini-reise).
const beispiele = [
  {
    id: 'firn',
    name: 'Atelier Firn',
    art: 'Uhrmacher-Atelier · Konzept',
    text: 'Eine Reise durch sieben Szenen: von der Werkstatt in die Uhr, in den Himmel und zurück ins Dorf.',
    url: 'https://atelier-firn.vercel.app',
    escenas: ['firn-1', 'firn-2', 'firn-3', 'firn-4'],
  },
  {
    id: 'braidz',
    name: "Braidz'n Tips",
    art: 'Beauty-Studio · Liechtenstein',
    text: 'Braids, Nails und Extensions: vom Taschenspiegel durch einen Fingernagel bis ins Studio, mit Nail-Design zum Ausprobieren.',
    url: 'https://braidzntips.vercel.app',
    escenas: ['braidz-1', 'braidz-2', 'braidz-3', 'braidz-4'],
  },
];

export default function Beispiele() {
  return (
    <section data-bg="#0a0b18" data-beispiele aria-labelledby="beispiele-titel" className="relative overflow-hidden px-6 py-28 md:px-12 md:py-40">
      <div className="mx-auto max-w-6xl text-center">
        <p className="font-mono text-[11px] tracking-[0.3em] text-akzent uppercase">Beispiele</p>
        <h2 id="beispiele-titel" data-split className="mt-3 text-4xl leading-[0.95] md:text-6xl">
          Nicht nur Bilder: <em className="text-akzent">echte Websites</em>
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-base text-nieve/70 md:text-lg">
          Öffnen Sie sie auf Ihrem Handy und scrollen Sie selbst. Genau so erleben es Ihre Kunden.
        </p>
      </div>

      <div className="mx-auto mt-16 grid max-w-5xl gap-20 md:mt-24 md:grid-cols-2 md:gap-16 [perspective:1400px]">
        {beispiele.map((b, i) => (
          <article key={b.id} data-beispiel={i} className="flex flex-col items-center text-center">
            <div data-telefon className="telefon relative w-[min(62vw,260px)] md:w-[min(24vw,280px)]">
              <div className="mini-reise relative aspect-[9/19.5] overflow-hidden rounded-[2.4rem] bg-noche">
                {b.escenas.map((e) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={e} src={`/escenas/beispiele/${e}.webp`} alt="" loading="lazy" decoding="async" />
                ))}
                {/* Reflejo del cristal. */}
                <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 bg-linear-to-br from-nieve/12 via-transparent to-transparent" />
              </div>
              <span aria-hidden="true" className="absolute top-3 left-1/2 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />
            </div>
            <p className="mt-10 font-mono text-[11px] tracking-[0.25em] text-nieve/50 uppercase">{b.art}</p>
            <h3 className="mt-2 text-3xl md:text-4xl">{b.name}</h3>
            <p className="mt-3 max-w-sm text-sm text-nieve/65 md:text-base">{b.text}</p>
            <a href={b.url} target="_blank" rel="noopener" className="btn btn-cristal mt-6" data-magnet>
              Live ansehen
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 17 17 7M8 7h9v9" />
              </svg>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
