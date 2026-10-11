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

// tramos[i] lleva de escenas[i] a escenas[i + 1].
// PROVISIONAL: portales en el centro con el radio pedido en PROMPTS.md. Se vuelven a medir con cada imagen real.
export const tramos: Tramo[] = [
  // Por la pantalla del móvil, al tor de luz.
  { portal: { x: 0.5, y: 0.5, r: 0.08 }, llegada: { x: 0.5, y: 0.5 }, zoom: 4 },
  // Por el anillo de luz, a la galería.
  { portal: { x: 0.5, y: 0.5, r: 0.15 }, llegada: { x: 0.5, y: 0.5 }, zoom: 3 },
  // Por la ventana del fondo, al lago.
  { portal: { x: 0.5, y: 0.5, r: 0.11 }, llegada: { x: 0.5, y: 0.5 }, zoom: 4 },
  // Por la esfera de cristal, a los Alpes.
  { portal: { x: 0.5, y: 0.5, r: 0.1 }, llegada: { x: 0.5, y: 0.45 }, zoom: 4 },
];
