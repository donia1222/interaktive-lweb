import PortalWorld from '../components/PortalWorld';
import Manifiesto from '../components/Manifiesto';
import Unterschied from '../components/Unterschied';
import Branchen from '../components/Branchen';
import Beispiele from '../components/Beispiele';
import Magie from '../components/Magie';
import Ablauf from '../components/Ablauf';
import Cinta from '../components/Cinta';
import Finale from '../components/Finale';
import Pie from '../components/Pie';

// Cada sección tiene su propio efecto, ninguno se repite:
// recorrido por portales · palabras que se encienden · barrido normal/interaktiv · galería horizontal con portales ·
// móviles que se enderezan en 3D con portales en miniatura ·
// vuelo hacia el monitor · línea que enciende pasos · cinta con inercia · anillo que se abre · letras que suben.
export default function Home() {
  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 pt-5 md:px-8 md:pt-7">
        <a href="#start" className="pointer-events-auto font-display text-2xl leading-none font-semibold tracking-[-0.06em]">
          Lweb<span className="text-akzent">.</span> <span className="font-normal text-nieve/60">Interaktiv</span>
        </a>
        <a href="#kontakt" className="btn btn-cristal pointer-events-auto" data-magnet>
          <span className="md:hidden">Kontakt</span>
          <span className="hidden md:inline">Gespräch vereinbaren</span>
        </a>
      </header>
      <main>
        <PortalWorld />
        <Manifiesto />
        <Unterschied />
        <Branchen />
        <Beispiele />
        <Magie />
        <Ablauf />
        <Cinta />
        <Finale />
      </main>
      <Pie />
      <div aria-hidden="true" className="grano pointer-events-none fixed inset-0 z-[60]" />
      <div aria-hidden="true" data-luz className="luz pointer-events-none fixed inset-0 z-[55]" />
    </>
  );
}
