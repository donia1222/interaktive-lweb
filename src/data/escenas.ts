// Las escenas del recorrido del hero. Imágenes generadas con ChatGPT (originales en imagenes/hero, ver PROMPTS.md),
// preparadas con scripts/escenas.mjs. Mientras falten, se usan provisionales.
//
// Coordenadas en fracciones de la imagen 16:9: `x` del ancho, `y` del alto y los radios en fracciones del ancho.
// `portal` es la abertura por la que se entra a la escena siguiente; `llegada` es el punto de la escena siguiente
// que queda dentro de ese portal, y `zoom` cuánto se acerca la cámara en el tramo.

export type Punto = { x: number; y: number };

export type Escena = {
  id: string;
  src: string;
  alt: string;
  lugar: string;
  nota: string;
};

export type Tramo = {
  portal: Punto & { r: number };
  llegada: Punto;
  zoom: number;
  /** Radio del círculo por el que se ve la escena siguiente al empezar, en su propio marco. Por defecto, el del
   *  portal limitado a la mitad del alto del marco; más grande solo si las dos imágenes se parecen en el borde. */
  apertura?: number;
  /** Forma del portal: círculo (máscara difuminada) o pantalla (recorte rectangular con esquinas redondeadas). */
  forma?: 'circulo' | 'pantalla';
  /** Tamaño del portal si es una pantalla: `w` en fracciones del ancho, `h` del alto y `radio` del ancho. */
  pantalla?: { w: number; h: number; radio: number };
  /** Tramo de `t` en el que aparece la escena siguiente. Por defecto [0.42, 0.72]. */
  fundido?: [number, number];
};

export const escenas: Escena[] = [
  {
    id: 'start',
    src: '/escenas/hero-code/1-studio.webp',
    alt: 'Ein Entwicklerstudio bei Nacht: Auf dem Bildschirm leuchtet Code, dahinter die Lichter der Stadt',
    lugar: 'Das Studio',
    nota: 'Alles beginnt mit Code.',
  },
  {
    id: 'code',
    src: '/escenas/hero-code/2-tunel.webp',
    alt: 'Ein Tunnel aus leuchtenden Codezeilen, an seinem Ende ein Ring aus goldenem Licht',
    lugar: 'Der Code',
    nota: 'Zeile für Zeile, von Hand.',
  },
  {
    id: 'leben',
    src: '/escenas/hero-code/3-leben.webp',
    alt: 'Schwebende Website-Elemente aus Glas, Bildern und Licht rund um ein leuchtendes Smartphone',
    lugar: 'Die Website',
    nota: 'Inhalte, die zum Leben erwachen.',
  },
  {
    id: 'wow',
    src: '/escenas/hero-code/4-wow.webp',
    alt: 'Bänder aus flüssigem Gold und violettem Licht, Glasformen und goldene Partikel',
    lugar: 'Ihre Kunden',
    nota: 'Und Ihre Kunden sagen: Wow.',
  },
];

// tramos[i] lleva de escenas[i] a escenas[i + 1]. Portales medidos sobre las imágenes reales (imagenes/hero-code).
export const tramos: Tramo[] = [
  // Por la pantalla del monitor: primero se ve el código; al acercarse, dentro aparece el túnel, y la pantalla crece
  // hasta el alto de la vista y se abre. zoom = 1 / alto de la pantalla, para que encaje sin corte.
  {
    portal: { x: 0.5, y: 0.444, r: 0.1 },
    llegada: { x: 0.4976, y: 0.436 },
    zoom: 1 / 0.378,
    forma: 'pantalla',
    pantalla: { w: 0.397, h: 0.378, radio: 0.004 },
    fundido: [0.25, 0.6],
  },
  // Por el anillo de luz del fondo del túnel: dentro, la web que cobra vida.
  { portal: { x: 0.4976, y: 0.436, r: 0.057 }, llegada: { x: 0.5, y: 0.512 }, zoom: 7 },
  // Por la pantalla del móvil: dentro, el final.
  {
    portal: { x: 0.5, y: 0.512, r: 0.06 },
    llegada: { x: 0.5, y: 0.5 },
    zoom: 1 / 0.46,
    forma: 'pantalla',
    pantalla: { w: 0.113, h: 0.46, radio: 0.014 },
    // La pantalla encendida del móvil llena casi toda la vista antes de que aparezca el final: un destello de luz.
    fundido: [0.6, 0.92],
  },
];

// En pantallas en vertical (móvil), la primera escena es la misma mesa con un móvil en lugar del monitor: el monitor,
// recortado en vertical, no cabía. El resto del recorrido es igual.
export const PANTALLA_VERTICAL = '(max-aspect-ratio: 1/1)';
const escenaMovil: Escena = {
  ...escenas[0],
  src: '/escenas/hero-code/1-studio-handy.webp',
  alt: 'Ein Smartphone auf einem Schreibtisch bei Nacht: Auf dem Bildschirm leuchtet Code, dahinter die Lichter der Stadt',
};
const tramoMovil: Tramo = {
  ...tramos[0],
  portal: { x: 0.5, y: 0.4766, r: 0.07 },
  zoom: 1 / 0.5165,
  pantalla: { w: 0.1495, h: 0.5165, radio: 0.012 },
};

export const recorrido = (vertical: boolean) =>
  vertical ? { escenas: [escenaMovil, ...escenas.slice(1)], tramos: [tramoMovil, ...tramos.slice(1)] } : { escenas, tramos };
