// Prepara las imágenes: las de ChatGPT que haya en imagenes/ pasan a WebP en public/escenas.
// Las que aún faltan se sustituyen por una provisional oscura con su nombre y el portal marcado,
// para que la web funcione mientras se generan.
import sharp from 'sharp';
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';

const OUT = 'public/escenas';
const W = 1672;
const H = 941;

// nombre de archivo (sin extensión) → radio del portal provisional, en fracciones del ancho
const imagenes = {
  'hero/1-handy': 0.08,
  'hero/2-tor': 0.15,
  'hero/3-galerie': 0.11,
  'hero/4-see': 0.1,
  'hero/5-alpen': 0,
  'branchen/restaurant-a': 0.15,
  'branchen/restaurant-b': 0,
  'branchen/hotel-a': 0.15,
  'branchen/hotel-b': 0,
  'branchen/weingut-a': 0.11,
  'branchen/weingut-b': 0,
  'branchen/immobilien-a': 0.15,
  'branchen/immobilien-b': 0,
  'branchen/handwerk-a': 0.125,
  'branchen/handwerk-b': 0,
  'extra/studio': 0,
};

const provisional = (nombre, r) =>
  Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs><radialGradient id="g" cx="50%" cy="50%" r="70%"><stop offset="0" stop-color="#1c1f3a"/><stop offset="1" stop-color="#06070f"/></radialGradient></defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  ${r ? `<circle cx="${W / 2}" cy="${H / 2}" r="${r * W}" fill="#0d1022" stroke="#f2b46d" stroke-width="3" stroke-dasharray="14 10"/>` : ''}
  <text x="50%" y="${r ? H / 2 + r * W + 70 : H / 2}" fill="#eef1f6" font-family="Helvetica, Arial" font-size="38" text-anchor="middle">${nombre}</text>
  <text x="50%" y="${r ? H / 2 + r * W + 118 : H / 2 + 50}" fill="#8a90b0" font-family="Helvetica, Arial" font-size="24" text-anchor="middle">imagen pendiente · imagenes/${nombre}.png</text>
</svg>`);

let reales = 0;
for (const [nombre, r] of Object.entries(imagenes)) {
  const destino = `${OUT}/${nombre}.webp`;
  await mkdir(destino.slice(0, destino.lastIndexOf('/')), { recursive: true });
  const fuente = ['png', 'jpg', 'jpeg', 'webp'].map((ext) => `imagenes/${nombre}.${ext}`).find(existsSync);
  if (fuente) {
    reales++;
    await sharp(fuente).resize(W, H, { fit: 'cover', kernel: 'lanczos3' }).sharpen({ sigma: 0.6 }).webp({ quality: 84 }).toFile(destino);
  } else {
    await sharp(provisional(nombre, r)).webp({ quality: 80 }).toFile(destino);
  }
}
console.log(`escenas: ${reales} de ${Object.keys(imagenes).length} imágenes reales, el resto provisionales`);
