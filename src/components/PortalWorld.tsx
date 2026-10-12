import Stop from './Stop';
import Dial from './Dial';
import { escenas } from '../data/escenas';

const title = 'mt-3 text-[clamp(2.1rem,6.2svh,3rem)] leading-[0.95] md:mt-4 md:text-6xl';
const body = 'mt-[min(1.25rem,2svh)] max-w-lg text-[15px] text-nieve/75 md:mt-5 md:text-lg';

export default function PortalWorld() {
  return (
    <section data-world aria-label="Eine Reise in die Website" className="relative">
      <div data-stage className="sticky top-0 h-lvh overflow-hidden bg-noche">
        {/* Primera escena como imagen normal: se ve al instante mientras el canvas carga las demás. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          data-poster
          src={escenas[0].src}
          alt=""
          aria-hidden="true"
          width={1672}
          height={941}
          fetchPriority="high"
          className="absolute inset-0 size-full scale-[1.04] object-cover transition-opacity duration-700"
        />
        <canvas data-portal aria-hidden="true" className="absolute inset-0 size-full opacity-0 transition-opacity duration-700" />

        {/* Velos: viñeta para dar profundidad y degradado inferior para leer el texto. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgb(7_10_20/0.55)_100%)]"
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-noche/90 via-noche/40 to-transparent" />

        <div data-hint aria-hidden="true" className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex">
          <span className="relative block h-9 w-5 rounded-full ring-1 ring-nieve/40">
            <span className="hint-dot absolute top-2 left-1/2 -ml-0.5 size-1 rounded-full bg-nieve" />
          </span>
        </div>

        <Dial />
      </div>

      <div className="relative z-10 -mt-[100lvh]">
        <Stop index={0} eyebrow="Lweb Interaktiv · Websites zum Erleben">
          <h1 className={title}>
            Websites, die man <em className="text-akzent">betritt</em>
          </h1>
          <p className={body}>Nicht anschauen, eintauchen. Scrollen Sie und gehen Sie hinein.</p>
        </Stop>

        <Stop index={1} eyebrow="Hinter dem Bildschirm">
          <h2 className={title}>Jede Zeile von Hand geschrieben</h2>
          <p className={body}>Kein Baukasten, keine Vorlage: Ihre Website entsteht im Code, schnell, sauber und nur für Sie.</p>
        </Stop>

        <Stop index={2} eyebrow="In Bewegung">
          <h2 className={title}>Inhalte, die zum Leben erwachen</h2>
          <p className={body}>Bilder, Texte und Effekte reagieren auf jeden Scroll, flüssig, auch auf dem Handy.</p>
        </Stop>

        <Stop index={3} eyebrow="Für Ihren Betrieb">
          <h2 className={title}>
            Und Ihre Kunden sagen: <em className="text-akzent">Wow.</em>
          </h2>
          <p className={body}>Von Hand programmiert in der Schweiz, für Restaurants, Hotels, Weingüter, Immobilien und Handwerk.</p>
          <div className="mt-[min(2rem,3.5svh)] flex flex-wrap justify-center gap-3">
            <a href="#branchen" className="btn btn-akzent">
              So könnte Ihre Branche aussehen
            </a>
            <a href="#kontakt" className="btn btn-cristal">
              Gespräch vereinbaren
            </a>
          </div>
        </Stop>
      </div>
    </section>
  );
}
