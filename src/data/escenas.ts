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
    src: '/escenas/hero/1-handy.webp',
    alt: 'Eine Hand hält ein Smartphone, dahinter ein Schweizer Städtchen am See in der blauen Stunde',
    lugar: 'Der Bildschirm',
    nota: 'Alles beginnt auf einem Handy.',
  },
  {
    id: 'tor',
    src: '/escenas/hero/2-tor.webp',
    alt: 'Ein riesiges Tor aus goldenem Licht steht auf stillem, dunklem Wasser',
    lugar: 'Das Tor',
    nota: 'Hinter dem Bildschirm öffnet sich eine Welt.',
  },
  {
    id: 'galerie',
    src: '/escenas/hero/3-galerie.webp',
    alt: 'Eine dunkle Halle mit schwebenden, leuchtenden Bildflächen und einem runden Fenster am Ende',
    lugar: 'Die Galerie',
    nota: 'Inhalte, die auf jede Bewegung reagieren.',
  },
  {
    id: 'see',
    src: '/escenas/hero/4-see.webp',
    alt: 'Ein spiegelglatter Bergsee bei Sonnenaufgang mit einer schwebenden Glaskugel',
    lugar: 'Der See',
    nota: 'Ein Eindruck, der bleibt.',
  },
  {
    id: 'alpen',
    src: '/escenas/hero/5-alpen.webp',
    alt: 'Die Schweizer Alpen bei Sonnenaufgang über einem Nebelmeer',
    lugar: 'Ihre Marke',
    nota: 'Und Ihre Kunden sagen: Wow.',
  },
];

// tramos[i] lleva de escenas[i] a escenas[i + 1]. Portales medidos sobre las imágenes reales.
export const tramos: Tramo[] = [
  // Por la pantalla del móvil, que ya muestra el anillo (scripts/escenas.mjs lo coloca dentro): la pantalla crece
  // hasta el alto de la vista y se abre. zoom = 1 / alto de la pantalla, para que encaje sin corte.
  {
    portal: { x: 0.5013, y: 0.468, r: 0.08 },
    llegada: { x: 0.5, y: 0.5 },
    zoom: 1 / 0.612,
    forma: 'pantalla',
    pantalla: { w: 0.1615, h: 0.612, radio: 0.0227 },
    fundido: [0, 0.02],
  },
  // Por el anillo de luz, a la galería: su ventana redonda aparece dentro del anillo.
  { portal: { x: 0.4994, y: 0.4, r: 0.15 }, llegada: { x: 0.4994, y: 0.388 }, zoom: 3.2 },
  // Por la ventana del fondo de la galería, al lago.
  { portal: { x: 0.4994, y: 0.388, r: 0.099 }, llegada: { x: 0.5, y: 0.42 }, zoom: 4 },
  // Por la esfera de cristal, a los Alpes.
  { portal: { x: 0.4994, y: 0.4676, r: 0.088 }, llegada: { x: 0.5, y: 0.5 }, zoom: 4.5 },
];
