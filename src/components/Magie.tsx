// "Hinter der Magie": un solo travelling de cámara. La foto del estudio aparece entera, como un cuadro; con el
// scroll crece hasta llenar la pantalla y la cámara sigue hasta el monitor, que reproduce el propio recorrido.
// Por el camino pasan fichas de código junto a la cámara. El movimiento lo calcula src/scripts/secciones.ts (magie).

// Pantalla del monitor en la foto (fracciones). El monitor está un poco girado, así que la imagen se encaja en sus
// cuatro esquinas reales con una transformación de perspectiva (ver magie() en secciones.ts).
// Orden: arriba-izquierda, arriba-derecha, abajo-derecha, abajo-izquierda; medidas sobre imagenes/extra/studio.png.
const ESQUINAS = [
  [0.1968, 0.3294],
  [0.5135, 0.3135],
  [0.5114, 0.6286],
  [0.1929, 0.611],
];
// Rectángulo que cabe entero dentro de la pantalla: hacia él vuela la cámara.
const MONITOR = { x: 0.198, y: 0.331, w: 0.312, h: 0.279 };
const escenas = ['1-handy', '2-tor', '3-galerie', '4-see'];

// Fichas de código: posición en la foto (fracciones) y si se ven también en móvil.
const fichas = [
  { x: 0.6, y: 0.27, texto: 'kamera.zoom(4.2)', movil: true },
  { x: 0.57, y: 0.6, texto: 'portal.öffnen({ weich: true })', movil: false },
  { x: 0.06, y: 0.7, texto: '60 fps · auch auf dem Handy', movil: true },
  { x: 0.05, y: 0.2, texto: '<Szene name="Studio" />', movil: false },
];

export default function Magie() {
  return (
    <section data-bg="#06070f" data-magie aria-labelledby="magie-titel" className="relative h-[360svh]">
      <div className="sticky top-0 h-svh overflow-hidden">
        <div
          data-magie-welt
          data-monitor={JSON.stringify(MONITOR)}
          data-esquinas={JSON.stringify(ESQUINAS)}
          className="absolute top-0 left-0 aspect-video w-screen origin-top-left overflow-hidden will-change-transform"
          style={{ opacity: 0 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/escenas/extra/studio.webp" alt="Unser Studio im Rheintal bei Nacht" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
          <div
            data-mini
            className="mini-portal absolute overflow-hidden bg-noche"
            style={{ left: `${MONITOR.x * 100}%`, top: `${MONITOR.y * 100}%`, width: `${MONITOR.w * 100}%`, height: `${MONITOR.h * 100}%` }}
          >
            {escenas.map((e) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={e} src={`/escenas/hero/${e}.webp`} alt="" loading="lazy" decoding="async" />
            ))}
            <span className="absolute inset-0 bg-linear-to-br from-nieve/10 via-transparent to-transparent" />
          </div>
          {fichas.map((f) => (
            <span
              key={f.texto}
              data-ficha
              className={`absolute rounded-[0.4vw] bg-noche/70 px-[0.8vw] py-[0.45vw] font-mono text-[0.85vw] whitespace-nowrap text-nieve/90 opacity-0 ring-1 ring-akzent/40 shadow-[0_0_2vw_rgba(242,180,109,0.25)] ${f.movil ? '' : 'max-md:hidden'}`}
              style={{ left: `${f.x * 100}%`, top: `${f.y * 100}%` }}
            >
              <span className="text-akzent">›</span> {f.texto}
            </span>
          ))}
        </div>
        {/* El mismo bucle a pantalla completa y resolución nativa: aparece cuando el monitor llena la pantalla, para que
            las escenas se vean tan nítidas como en el hero (el monitor ampliado se vería pixelado). */}
        <div data-magie-voll aria-hidden="true" className="mini-portal pointer-events-none absolute inset-0 opacity-0">
          {escenas.map((e) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={e} src={`/escenas/hero/${e}.webp`} alt="" loading="lazy" decoding="async" />
          ))}
        </div>
        {/* Velo para leer el texto final sobre el monitor. */}
        <div data-magie-velo aria-hidden="true" className="pointer-events-none absolute inset-0 bg-linear-to-t from-noche via-noche/40 to-noche/10 opacity-0" />

        <div data-magie-antes className="pointer-events-none absolute inset-0">
          <div data-magie-kopf className="absolute inset-x-0 px-6 text-center">
            <p className="font-mono text-[11px] tracking-[0.3em] text-akzent uppercase">Hinter der Magie</p>
            <h2 id="magie-titel" className="mt-3 text-4xl leading-[0.95] md:text-6xl">
              Von Hand programmiert, <em className="text-akzent">im Rheintal</em>
            </h2>
          </div>
          <p data-magie-fuss className="absolute inset-x-0 mx-auto max-w-lg px-6 text-center text-base text-nieve/70 md:text-lg">
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
