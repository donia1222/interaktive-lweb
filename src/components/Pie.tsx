export default function Pie() {
  return (
    <footer data-bg="#05060d" className="relative overflow-hidden px-6 pt-28 pb-10 md:px-12">
      <div className="mx-auto max-w-7xl">
        <p data-pie-marca aria-label="Interaktiv" className="font-display text-[17vw] leading-[0.8] font-semibold tracking-[-0.08em] whitespace-nowrap">
          Interaktiv<span className="text-akzent">.</span>
        </p>
        <div className="mt-10 flex flex-col gap-2 border-t border-nieve/10 pt-6 font-mono text-[11px] tracking-wider text-nieve/45 uppercase md:flex-row md:justify-between">
          <p>Lweb Interaktiv · 9475 Sevelen, Schweiz · info@lweb.ch</p>
          <a href="https://lweb.ch" className="hover:text-akzent" rel="noopener">
            Ein Angebot von lweb.ch
          </a>
        </div>
      </div>
    </footer>
  );
}
