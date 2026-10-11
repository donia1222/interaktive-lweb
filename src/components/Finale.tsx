// Finale: un anillo de luz, como el del hero, se abre hasta llenar la pantalla y deja dentro el contacto.
export default function Finale() {
  return (
    <section id="kontakt" data-bg="#04050b" data-revelado aria-labelledby="finale-titel" className="relative h-[320svh]">
      <div className="sticky top-0 h-svh overflow-hidden">
        <div data-revelado-mascara className="absolute inset-0" style={{ clipPath: 'circle(8vmin at 50% 50%)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img data-revelado-img src="/escenas/hero/5-alpen.webp" alt="Die Alpen bei Sonnenaufgang über dem Nebelmeer" loading="lazy" decoding="async" className="size-full scale-125 object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-noche via-noche/40 to-noche/30" />
        </div>
        <div
          data-revelado-aro
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 size-[16vmin] -translate-1/2 rounded-full border-2 border-akzent shadow-[0_0_40px_8px_rgba(242,180,109,0.55),inset_0_0_30px_rgba(242,180,109,0.5)]"
        />

        <div data-revelado-antes className="absolute inset-x-0 top-[16%] px-6 text-center">
          <p className="font-mono text-[11px] tracking-[0.3em] text-akzent uppercase">Ihr Eingang</p>
          <p className="mt-4 font-display text-4xl font-medium tracking-[-0.045em] md:text-6xl">Bereit, hindurchzugehen?</p>
        </div>

        <div data-revelado-despues className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center opacity-0">
          <h2 id="finale-titel" className="max-w-4xl text-5xl leading-[0.95] md:text-8xl">
            Lassen Sie uns <em className="text-akzent">Ihre Welt</em> bauen
          </h2>
          <p className="mt-6 max-w-lg text-base text-nieve/80 md:text-lg">
            Erzählen Sie uns von Ihrem Betrieb. Wir zeigen Ihnen, wie Ihre interaktive Website aussehen könnte — unverbindlich.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a href="mailto:info@lweb.ch?subject=Interaktive%20Website" className="btn btn-akzent" data-magnet>
              Gespräch vereinbaren
            </a>
            <a href="tel:+41765608645" className="btn btn-cristal" data-magnet>
              +41 76 560 86 45
            </a>
          </div>
          <p className="mt-5 font-mono text-[11px] tracking-[0.2em] text-nieve/55 uppercase">Antwort innert 24 Stunden</p>
        </div>
      </div>
    </section>
  );
}
