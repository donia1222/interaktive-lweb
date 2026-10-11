// "Hinter der Magie": el estudio a pantalla completa. El monitor reproduce el propio recorrido del hero y,
// con el scroll, la cámara vuela hacia él hasta que llena la pantalla.
// Pantalla del monitor en la foto (fracciones): ver data-monitor.
const MONITOR = { x: 0.2, y: 0.318, w: 0.312, h: 0.316 };
const escenas = ['1-handy', '2-tor', '3-galerie', '4-see'];

export default function Magie() {
  return (
    <section data-bg="#06070f" data-magie aria-labelledby="magie-titel" className="relative h-[340svh]">
      <div className="sticky top-0 h-svh overflow-hidden bg-noche">
        <div
          data-magie-welt
          data-monitor={JSON.stringify(MONITOR)}
          className="absolute top-1/2 left-1/2 aspect-video w-[max(100vw,177.78svh)] -translate-1/2 will-change-transform"
          style={{ transformOrigin: `${(MONITOR.x + MONITOR.w / 2) * 100}% ${(MONITOR.y + MONITOR.h / 2) * 100}%` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/escenas/extra/studio.webp" alt="Unser Studio im Rheintal bei Nacht" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
          <div
            className="mini-portal absolute overflow-hidden rounded-[0.35%] bg-noche"
            style={{ left: `${MONITOR.x * 100}%`, top: `${MONITOR.y * 100}%`, width: `${MONITOR.w * 100}%`, height: `${MONITOR.h * 100}%` }}
          >
            {escenas.map((e) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={e} src={`/escenas/hero/${e}.webp`} alt="" loading="lazy" decoding="async" />
            ))}
            <span className="absolute inset-0 bg-linear-to-br from-nieve/10 via-transparent to-transparent" />
          </div>
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-linear-to-t from-noche via-noche/20 to-noche/50" />

        <div data-magie-antes className="absolute inset-x-0 bottom-[9%] px-6 text-center md:bottom-auto md:left-auto md:top-1/2 md:right-[6%] md:w-[38%] md:-translate-y-1/2 md:px-0 md:text-left">
          <p className="font-mono text-[11px] tracking-[0.3em] text-akzent uppercase">Hinter der Magie</p>
          <h2 id="magie-titel" className="mt-4 text-5xl leading-[0.95] md:text-6xl">
            Von Hand programmiert, <em className="text-akzent">im Rheintal</em>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-base text-nieve/75 md:mx-0">
            Kein Baukasten, keine Vorlage. Jede Szene und jeder Übergang entsteht in unserem Studio in Sevelen.
          </p>
        </div>

        <div data-magie-despues className="absolute inset-x-0 bottom-[10%] px-6 text-center opacity-0">
          <h2 className="mx-auto max-w-4xl text-5xl leading-[0.95] md:text-8xl">
            Jede Szene. Jeder Übergang. <em className="text-akzent">Jede Zeile Code.</em>
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-base text-nieve/75 md:text-lg">
            Das, was Sie oben erlebt haben, ist echter Code: schnell geladen, flüssig auf dem Handy, gehostet in der Schweiz.
          </p>
        </div>
      </div>
    </section>
  );
}
