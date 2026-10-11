import type { CSSProperties } from 'react';
import { branchen } from '../data/branchen';

// Cada sector: la imagen de fuera hace zoom hacia su portal y la de dentro aparece por un círculo que se abre.
export default function Branchen() {
  return (
    <section id="branchen" data-bg="#0b0a16" aria-labelledby="branchen-titel" className="relative px-6 py-32 md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="font-mono text-[11px] tracking-[0.3em] text-akzent uppercase">Branchen</p>
          <h2 id="branchen-titel" data-split className="mt-4 text-5xl leading-[0.95] md:text-7xl">
            So könnte <em className="text-akzent">Ihre Branche</em> aussehen
          </h2>
          <p data-reveal className="mt-8 max-w-xl text-lg text-nieve/70">
            Scrollen Sie langsam: Jedes Bild öffnet sich wie eine Tür. Genau so erleben Ihre Kunden Ihre neue Website.
          </p>
        </div>

        <div className="mt-24 flex flex-col gap-28 md:gap-40">
          {branchen.map((b, i) => (
            <article
              key={b.id}
              data-branche
              className={`grid items-center gap-10 md:gap-16 lg:grid-cols-[1.35fr_1fr] ${i % 2 ? 'lg:[&>*:first-child]:order-2' : ''}`}
            >
              <div className="relative aspect-video overflow-hidden rounded-[2rem] bg-noche ring-1 ring-nieve/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  data-branche-aussen
                  src={b.aussen}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 size-full object-cover will-change-transform"
                  style={{ transformOrigin: `${b.portal.x * 100}% ${b.portal.y * 100}%` }}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  data-branche-innen
                  data-r={b.portal.r}
                  src={b.innen}
                  alt={b.alt}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 size-full object-cover"
                  style={{ clipPath: `circle(${b.portal.r * 100}% at ${b.portal.x * 100}% ${b.portal.y * 100}%)`, opacity: 0 } as CSSProperties}
                />
                <span className="absolute top-5 left-5 rounded-full bg-noche/60 px-3 py-1 font-mono text-[10px] tracking-[0.2em] uppercase ring-1 ring-nieve/15">
                  {String(i + 1).padStart(2, '0')} · {b.name}
                </span>
              </div>
              <div>
                <p className="font-mono text-[11px] tracking-[0.3em] text-akzent uppercase">{b.name}</p>
                <h3 data-split className="mt-4 text-4xl leading-[0.98] md:text-5xl">
                  {b.titel}
                </h3>
                <p data-reveal className="mt-6 text-base text-nieve/70 md:text-lg">
                  {b.text}
                </p>
                <ul className="mt-8 flex flex-wrap gap-2">
                  {b.ideen.map((idee) => (
                    <li key={idee} data-reveal className="rounded-full bg-nieve/[0.05] px-4 py-2 text-sm ring-1 ring-nieve/15">
                      {idee}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
