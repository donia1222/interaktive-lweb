export default function Pie() {
  return (
    <footer id="kontakt" data-bg="#05060d" className="relative overflow-hidden px-6 pt-32 pb-10 md:px-12">
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-[11px] tracking-[0.3em] text-akzent uppercase">Kontakt</p>
        <h2 data-split className="mt-4 max-w-4xl text-5xl leading-[0.95] md:text-8xl">
          Bereit für den <em className="text-akzent">Wow-Moment?</em>
        </h2>
        <div className="mt-10 flex flex-wrap gap-4">
          <a href="mailto:info@lweb.ch" className="btn btn-akzent">
            Gespräch vereinbaren
          </a>
          <a href="tel:+41765608645" className="btn btn-cristal">
            +41 76 560 86 45
          </a>
        </div>
        <p data-pie-marca aria-label="Interaktiv" className="mt-20 font-display whitespace-nowrap text-[17vw] leading-[0.8] font-semibold tracking-[-0.08em]">
          Interaktiv<span className="text-akzent">.</span>
        </p>
        <div className="mt-8 flex flex-col gap-2 border-t border-nieve/10 pt-6 font-mono text-[11px] tracking-wider text-nieve/45 uppercase md:flex-row md:justify-between">
          <p>Lweb Interaktiv · 9475 Sevelen, Schweiz</p>
          <a href="https://lweb.ch" className="hover:text-akzent" rel="noopener">
            Ein Angebot von lweb.ch
          </a>
        </div>
      </div>
    </footer>
  );
}
