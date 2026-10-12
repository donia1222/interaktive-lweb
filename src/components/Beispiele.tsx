import type { CSSProperties } from 'react';

// "Beispiele": webs reales, cada una en una tarjeta grande que ocupa casi toda la pantalla. Las tarjetas se apilan con
// el scroll: la siguiente sube por encima y la anterior se encoge y se apaga detrás (secciones.ts → beispiele). Dentro,
// el recorrido de cada web en miniatura: cada escena se abre en un círculo dentro de la anterior (CSS: .mini-reise).
const beispiele = [
  {
    id: 'flink',
    name: 'Flink Sauber',
    art: 'Reinigungsfirma · Triesen',
    text: 'Ein Wisch über die Scheibe, dann durch Spiegel und Wassertropfen bis zur fertigen Wohnung. Mit echten Vorher-Nachher-Fotos.',
    url: 'https://flink-sauber.vercel.app',
    farbe: '#d4ae6a',
    escenas: ['flink-1', 'flink-2', 'flink-3', 'flink-4'],
    // Punto (fracción del ancho) que queda centrado en la tarjeta vertical del móvil, por escena.
    foco: [0.5, 0.5, 0.5, 0.5],
  },
  {
    id: 'braidz',
    name: "Braidz'n Tips",
    art: 'Beauty-Studio · Liechtenstein',
    text: 'Vom Taschenspiegel durch einen Fingernagel bis ins Studio, mit Nail-Design zum Ausprobieren.',
    url: 'https://braidzntips.vercel.app',
    farbe: '#e7a9a0',
    escenas: ['braidz-1', 'braidz-2', 'braidz-3', 'braidz-4'],
    foco: [0.494, 0.6, 0.5, 0.5],
  },
  {
    id: 'firn',
    name: 'Atelier Firn',
    art: 'Uhrmacher-Atelier · Konzept',
    text: 'Eine Reise durch sieben Szenen: von der Werkstatt in die Uhr, in den Himmel und zurück ins Dorf.',
    url: 'https://atelier-firn.vercel.app',
    farbe: '#9cc4e4',
    escenas: ['firn-1', 'firn-2', 'firn-3', 'firn-4'],
    foco: [0.5, 0.5, 0.5, 0.5],
  },
];

export default function Beispiele() {
  return (
    <section data-bg="#0a0b18" data-beispiele aria-labelledby="beispiele-titel" className="relative px-4 py-28 md:px-12 md:py-40">
      <div className="mx-auto max-w-6xl px-2 text-center">
        <p className="font-mono text-[11px] tracking-[0.3em] text-akzent uppercase">Beispiele</p>
        <h2 id="beispiele-titel" data-split className="mt-3 text-4xl leading-[0.95] md:text-6xl">
          Nicht nur Bilder: <em className="text-akzent">echte Websites</em>
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-base text-nieve/70 md:text-lg">
          Öffnen Sie sie auf Ihrem Handy und scrollen Sie selbst. Genau so erleben es Ihre Kunden.
        </p>
      </div>

      <div className="mx-auto mt-14 flex max-w-6xl flex-col md:mt-20">
        {beispiele.map((b, i) => (
          <article
            key={b.id}
            data-beispiel={i}
            className="projekt sticky mb-[22svh] last:mb-0"
            style={{ top: `calc(max(4.5rem, 8svh) + ${i * 14}px)`, '--farbe': b.farbe } as CSSProperties}
          >
            <div data-projekt-karte className="projekt-karte relative h-[min(80svh,720px)] overflow-hidden rounded-[1.75rem] md:rounded-[2.25rem]">
              <div className="mini-reise absolute inset-0 z-0" aria-hidden="true">
                {b.escenas.map((e, j) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={e} src={`/escenas/beispiele/${e}.webp`} alt="" loading="lazy" decoding="async" style={{ objectPosition: `${b.foco[j] * 100}% 50%` }} />
                ))}
              </div>
              {/* Velo para leer el texto: de abajo en el móvil, de la izquierda en escritorio. */}
              <div aria-hidden="true" className="absolute inset-0 z-10 bg-linear-to-t from-noche via-noche/45 to-noche/10 md:bg-linear-to-r md:from-noche/90 md:via-noche/40 md:to-transparent" />

              <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between p-5 md:p-8">
                <span className="rounded-full bg-noche/60 px-3 py-1.5 font-mono text-[11px] tracking-[0.2em] text-nieve/80 ring-1 ring-nieve/15 backdrop-blur-sm">
                  0{i + 1} / 0{beispiele.length}
                </span>
                <span className="flex items-center gap-2 rounded-full bg-noche/60 px-3 py-1.5 font-mono text-[11px] text-nieve/80 ring-1 ring-nieve/15 backdrop-blur-sm">
                  <span className="projekt-punkt size-1.5 rounded-full" aria-hidden="true" />
                  Live
                </span>
              </div>

              <div data-projekt-text className="absolute inset-x-0 bottom-0 z-20 p-6 text-left md:top-0 md:right-auto md:flex md:max-w-md md:flex-col md:justify-end md:p-12">
                <p className="projekt-art font-mono text-[11px] tracking-[0.25em] uppercase">{b.art}</p>
                <h3 className="mt-2 text-4xl leading-none md:text-6xl">{b.name}</h3>
                <p className="mt-3 max-w-sm text-sm text-nieve/75 md:text-base">{b.text}</p>
                <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <a href={b.url} target="_blank" rel="noopener" className="btn btn-projekt" data-magnet>
                    Live ansehen
                    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M7 17 17 7M8 7h9v9" />
                    </svg>
                  </a>
                  <span className="font-mono text-xs text-nieve/50">{b.url.replace('https://', '')}</span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
