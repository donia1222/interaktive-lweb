import PortalWorld from '../components/PortalWorld';
import Manifiesto from '../components/Manifiesto';
import Branchen from '../components/Branchen';
import Pie from '../components/Pie';

// ESTRUCTURA (borrador): hero → manifiesto → branchen → contacto.
// Más secciones cuando estén las imágenes: "Normale vs. interaktive Website", proceso, precios, preguntas.
export default function Home() {
  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 pt-5 md:px-8 md:pt-7">
        <a href="#start" className="pointer-events-auto font-display text-2xl leading-none font-semibold tracking-[-0.06em]">
          Lweb<span className="text-akzent">.</span> <span className="font-normal text-nieve/60">Interaktiv</span>
        </a>
        <a href="#kontakt" className="btn btn-cristal pointer-events-auto">
          Gespräch vereinbaren
        </a>
      </header>
      <main>
        <PortalWorld />
        <Manifiesto />
        <Branchen />
      </main>
      <Pie />
      <div aria-hidden="true" className="grano pointer-events-none fixed inset-0 z-[60]" />
    </>
  );
}
