// "So könnte Ihre Branche aussehen": un mini portal por sector. Imágenes en imagenes/branchen (ver PROMPTS.md).
// `portal`: centro de la abertura en la imagen de fuera (fracciones) y su radio (fracción del ancho).

export type Branche = {
  id: string;
  name: string;
  titel: string;
  text: string;
  ideen: string[];
  aussen: string;
  innen: string;
  alt: string;
  /** Centro de la abertura (fracciones) y su radio (fracción del ancho). Con `w` y `h` (fracciones del ancho y del
   *  alto) la abertura es un rectángulo, como el ventanal de la casa. */
  portal: { x: number; y: number; r: number; w?: number; h?: number };
};

export const branchen: Branche[] = [
  {
    id: 'restaurant',
    name: 'Restaurant',
    titel: 'Vom Fenster direkt an den Tisch',
    text: 'Der Gast schaut durchs Fenster, scrollt hinein und steht vor dem Teller. Die Speisekarte erscheint Gang für Gang.',
    ideen: ['Speisekarte als Reise', 'Tisch reservieren', 'Tagesmenü animiert'],
    aussen: '/escenas/branchen/restaurant-a.webp',
    innen: '/escenas/branchen/restaurant-b.webp',
    alt: 'Restaurant bei Nacht durch ein rundes Fenster, dahinter ein angerichteter Teller',
    portal: { x: 0.497, y: 0.41, r: 0.16 },
  },
  {
    id: 'hotel',
    name: 'Hotel & Ferien',
    titel: 'Die Aussicht erleben, bevor man bucht',
    text: 'Durchs Fenster in die Berge: Ihre Gäste erleben den Morgen im Zimmer, noch bevor sie anreisen.',
    ideen: ['Zimmer zum Betreten', 'Aussicht je Tageszeit', 'Direkt buchen'],
    aussen: '/escenas/branchen/hotel-a.webp',
    innen: '/escenas/branchen/hotel-b.webp',
    alt: 'Hotelzimmer mit rundem Fenster, dahinter die verschneiten Berge bei Sonnenaufgang',
    portal: { x: 0.498, y: 0.39, r: 0.164 },
  },
  {
    id: 'weingut',
    name: 'Weingut',
    titel: 'Ein Glas Rheintal',
    text: 'Von den Rebbergen ins Glas: Herkunft, Jahrgang und Geschmack als kleine Reise erzählt.',
    ideen: ['Weine entdecken', 'Lage und Jahrgang', 'Degustation buchen'],
    aussen: '/escenas/branchen/weingut-a.webp',
    innen: '/escenas/branchen/weingut-b.webp',
    alt: 'Ein Glas Rotwein vor den Rebbergen im Rheintal, darin der Wein in goldenem Licht',
    portal: { x: 0.495, y: 0.335, r: 0.1 },
  },
  {
    id: 'immobilien',
    name: 'Immobilien',
    titel: 'Die Besichtigung beginnt online',
    text: 'Durchs Fenster ins Wohnzimmer: Interessenten fühlen sich schon zu Hause, bevor sie anrufen.',
    ideen: ['Rundgang durchs Objekt', 'Grundriss interaktiv', 'Besichtigung anfragen'],
    aussen: '/escenas/branchen/immobilien-a.webp',
    innen: '/escenas/branchen/immobilien-b.webp',
    alt: 'Modernes Haus in der Dämmerung, durchs Fenster das Wohnzimmer mit Kamin',
    portal: { x: 0.5, y: 0.51, r: 0.17, w: 0.34, h: 0.36 },
  },
  {
    id: 'handwerk',
    name: 'Handwerk',
    titel: 'Zeigen, was Ihre Hände können',
    text: 'Von der Werkstatt zum Detail: Ihre Arbeit wird sichtbar, so wie sie wirklich ist.',
    ideen: ['Arbeiten im Detail', 'Vom Rohstoff zum Werk', 'Offerte anfragen'],
    aussen: '/escenas/branchen/handwerk-a.webp',
    innen: '/escenas/branchen/handwerk-b.webp',
    alt: 'Schreinerei bei Nacht mit rundem Fenster, dahinter Hände beim Hobeln von Holz',
    portal: { x: 0.5, y: 0.38, r: 0.148 },
  },
];
