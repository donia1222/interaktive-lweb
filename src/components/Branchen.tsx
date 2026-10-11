import type { CSSProperties } from 'react';
import { branchen } from '../data/branchen';

// Recorte inicial de la imagen de dentro: el círculo o el rectángulo del portal.
const recorte = (p: { x: number; y: number; r: number; w?: number; h?: number }) =>
  p.w && p.h
    ? `inset(${(p.y - p.h / 2) * 100}% ${(1 - p.x - p.w / 2) * 100}% ${(1 - p.y - p.h / 2) * 100}% ${(p.x - p.w / 2) * 100}% round 12px)`
    : `circle(${p.r * 100}% at ${p.x * 100}% ${p.y * 100}%)`;

// Galería horizontal fija: los sectores pasan de lado y el portal de cada uno se abre al llegar al centro.
export default function Branchen() {
  return (
    <section id="branchen" data-bg="#0b0a16" data-branchen aria-labelledby="branchen-titel" className="relative">
      <div data-branchen-pin className="relative flex h-svh flex-col justify-center overflow-hidden pt-24 md:pt-0">
        <div data-branchen-pista className="flex w-max items-center gap-6 pr-[8vw] pl-6 md:gap-10 md:pl-12">
          <div className="w-[80vw] shrink-0 md:w-[38vw]">
            <p className="font-mono text-[11px] tracking-[0.3em] text-akzent uppercase">Branchen</p>
            <h2 id="branchen-titel" data-split className="mt-4 text-5xl leading-[0.95] md:text-7xl">
              So könnte <em className="text-akzent">Ihre Branche</em> aussehen
            </h2>
            <p className="mt-6 max-w-md text-base text-nieve/70 md:text-lg">
              Scrollen Sie weiter: Jedes Bild öffnet sich wie eine Tür. Genau so erleben Ihre Kunden Ihre neue Website.
            </p>
            <p className="mt-8 flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] text-nieve/50 uppercase">
              <span className="h-px w-10 bg-akzent" />
              {branchen.length} Branchen
            </p>
          </div>
          {/* Hueco para que el primer sector entre por la derecha con su portal aún cerrado. */}
          <div aria-hidden="true" className="w-[4vw] shrink-0 md:w-[30vw]" />

          {branchen.map((b, i) => (
            <article key={b.id} data-branche data-portal={JSON.stringify(b.portal)} className="w-[80vw] max-w-[440px] shrink-0 md:w-[58vw] md:max-w-none">
              <div data-branche-buehne className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem] bg-noche ring-1 ring-nieve/10 md:aspect-video md:rounded-[2rem]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  data-branche-aussen
                  src={b.aussen}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 size-full object-cover"
                  style={{ transformOrigin: `${b.portal.x * 100}% ${b.portal.y * 100}%` }}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  data-branche-innen
                  data-r={b.portal.r}
                  data-w={b.portal.w}
                  data-h={b.portal.h}
                  src={b.innen}
                  alt={b.alt}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 size-full object-cover"
                  style={{ clipPath: recorte(b.portal), opacity: 0, transformOrigin: `${b.portal.x * 100}% ${b.portal.y * 100}%` } as CSSProperties}
                />
                <span className="absolute top-4 left-4 rounded-full bg-noche/60 px-3 py-1 font-mono text-[10px] tracking-[0.2em] uppercase ring-1 ring-nieve/15 md:top-5 md:left-5">
                  {String(i + 1).padStart(2, '0')} · {b.name}
                </span>
              </div>
              <div data-branche-text className="mt-5 grid gap-3 md:mt-7 md:grid-cols-[1fr_auto] md:items-end md:gap-8">
                <div>
                  <h3 className="text-2xl leading-tight md:text-4xl">{b.titel}</h3>
                  <p className="mt-2 max-w-xl text-sm text-nieve/65 md:text-base">{b.text}</p>
                </div>
                <ul className="flex flex-wrap gap-2 md:max-w-[15rem] md:justify-end">
                  {b.ideen.map((idee) => (
                    <li key={idee} className="rounded-full bg-nieve/[0.05] px-3 py-1.5 text-xs ring-1 ring-nieve/15">
                      {idee}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <div className="mx-6 mt-8 h-px bg-nieve/10 md:mx-12 md:mt-12">
          <div data-branchen-barra className="h-full origin-left scale-x-0 bg-akzent" />
        </div>
      </div>
    </section>
  );
}
