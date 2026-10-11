// "Der Unterschied": la misma web de un restaurante en versión normal y en versión interactiva.
// Una línea de luz la barre con el scroll y deja ver, detrás, la versión interactiva.
export default function Unterschied() {
  return (
    <section data-bg="#090b17" data-unterschied aria-labelledby="unterschied-titel" className="relative h-[320svh]">
      <div className="sticky top-0 flex h-svh flex-col items-center justify-center gap-6 overflow-hidden px-5 md:gap-8">
        <div className="text-center">
          <p className="font-mono text-[11px] tracking-[0.3em] text-akzent uppercase">Der Unterschied</p>
          <h2 id="unterschied-titel" data-split className="mt-3 text-4xl leading-[0.95] md:text-6xl">
            Gleicher Inhalt. <em className="text-akzent">Ganz andere Wirkung.</em>
          </h2>
        </div>

        <div className="relative w-[min(78vw,360px)] md:w-[min(88vw,1040px)]">
          <div className="geraet overflow-hidden rounded-[1.6rem] bg-[#0d1020] ring-1 ring-nieve/15 md:rounded-2xl">
            <div className="flex h-8 items-center gap-1.5 border-b border-nieve/10 bg-[#0a0d1a] px-4">
              <i className="size-2 rounded-full bg-[#ff5f57]" />
              <i className="size-2 rounded-full bg-[#febc2e]" />
              <i className="size-2 rounded-full bg-[#28c840]" />
              <span className="mx-auto font-mono text-[10px] text-nieve/45">restaurant-alpenblick.ch</span>
            </div>
            <div className="relative aspect-[10/14] max-h-[56svh] w-full overflow-hidden md:aspect-video md:max-h-none">
              {/* Versión normal: plantilla gris, todo quieto. */}
              <div className="web-normal absolute inset-0 flex flex-col bg-[#f3f3f1] text-[#2b2b2b]">
                <div className="flex items-center justify-between border-b border-black/10 px-4 py-2.5 md:px-6">
                  <span className="text-sm font-bold md:text-base">Restaurant Alpenblick</span>
                  <span className="hidden gap-4 text-xs text-black/50 md:flex">
                    <span>Home</span>
                    <span>Speisekarte</span>
                    <span>Kontakt</span>
                  </span>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/escenas/branchen/restaurant-a.webp" alt="" loading="lazy" className="h-[38%] w-full object-cover grayscale-[55%]" />
                <div className="flex flex-1 flex-col gap-2 p-4 md:p-6">
                  <p className="text-lg font-bold md:text-2xl">Willkommen in unserem Restaurant</p>
                  <span className="h-2 w-full rounded bg-black/10" />
                  <span className="h-2 w-11/12 rounded bg-black/10" />
                  <span className="h-2 w-3/4 rounded bg-black/10" />
                  <span className="mt-2 w-max rounded bg-[#7a7a7a] px-3 py-1.5 text-xs text-white">Reservieren</span>
                </div>
              </div>

              {/* Versión interactiva: la misma información, como experiencia. */}
              <div data-unterschied-interaktiv className="absolute inset-0 overflow-hidden bg-noche" style={{ clipPath: 'inset(0 0 0 100%)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  data-unterschied-bild
                  src="/escenas/branchen/restaurant-a.webp"
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 size-full object-cover"
                  style={{ transformOrigin: '49.7% 41%' }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-noche via-noche/30 to-noche/10" />
                <div className="absolute inset-x-0 bottom-0 flex flex-col items-center p-5 text-center md:p-10">
                  <p className="font-mono text-[9px] tracking-[0.3em] text-akzent uppercase md:text-[11px]">Seit 1962 · Sevelen</p>
                  <p className="mt-2 font-display text-3xl font-medium tracking-[-0.05em] md:text-6xl">
                    Alpen<span className="text-akzent">blick</span>
                  </p>
                  <p className="mt-2 max-w-sm text-xs text-nieve/75 md:text-sm">Treten Sie ein. Der Tisch am Fenster wartet schon.</p>
                  <span className="mt-4 rounded-full bg-akzent px-4 py-2 text-xs font-medium text-noche shadow-[0_0_30px_rgba(242,180,109,0.55)]">
                    Tisch reservieren
                  </span>
                </div>
                <span className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-noche/60 px-2.5 py-1 font-mono text-[9px] tracking-wider text-nieve/80 uppercase ring-1 ring-nieve/15">
                  <i className="size-1.5 animate-pulse rounded-full bg-akzent" />
                  Scroll
                </span>
              </div>

              {/* Línea de luz que barre de derecha a izquierda. */}
              <div data-unterschied-linie className="pointer-events-none absolute inset-y-0 left-full w-px" style={{ transform: 'translateX(-0.5px)' }}>
                <span className="absolute inset-y-0 -left-px w-[3px] bg-akzent shadow-[0_0_24px_6px_rgba(242,180,109,0.65)]" />
                <span className="absolute top-1/2 left-1/2 grid size-9 -translate-1/2 place-items-center rounded-full bg-akzent text-noche shadow-[0_0_30px_rgba(242,180,109,0.7)]">
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Lo que se siente con cada una: el texto cambia con la línea. */}
        <div className="relative h-16 w-full max-w-xl text-center md:h-14">
          <p data-unterschied-normal className="absolute inset-0 text-sm text-nieve/60 md:text-base">
            <span className="text-nieve">Normale Website:</span> Man schaut kurz, scrollt weiter und vergisst.
          </p>
          <p data-unterschied-wow className="absolute inset-0 text-sm text-nieve/75 opacity-0 md:text-base">
            <span className="text-akzent">Interaktive Website:</span> Man taucht ein, bleibt länger und erzählt davon.
          </p>
        </div>
      </div>
    </section>
  );
}
