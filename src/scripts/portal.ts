import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { escenas, tramos } from '../data/escenas';

// Recorrido por portales. Cada tramo lleva de una escena a la siguiente: la cámara se acerca al portal de la escena
// actual (ventana, lupa, volante…) y la siguiente aparece dentro de él, crece y acaba ocupando la pantalla.
//
// Todo se calcula en fracciones del marco 16:9 de cada escena. Un punto `x` de una escena se pinta en `c + k · (x − p)`,
// donde `p` es el portal, `k` el zoom y `c` el punto de la pantalla hacia el que viaja la cámara (del portal de esta
// escena al punto de llegada de la siguiente). La escena siguiente usa la misma cámara con zoom `k / K`, así que al
// final del tramo (k = K) queda exactamente en su sitio y sin escalar.
//
// Se pinta en un único canvas del tamaño de la pantalla: de cada escena solo se dibuja el trozo visible. Con capas
// del DOM, cada escena era una textura de varios miles de píxeles y en iOS se acababa la memoria gráfica.

type Key = { y: number; v: number };
type Fuente = ImageBitmap | HTMLImageElement;
type Plano = { tx: number; ty: number; k: number; alpha: number };

const piecewise = (y: number, keys: Key[]) => {
  if (y <= keys[0].y) return keys[0].v;
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1];
    const b = keys[i];
    if (y <= b.y) return a.v + (b.v - a.v) * ((y - a.y) / (b.y - a.y || 1));
  }
  return keys[keys.length - 1].v;
};

const clamp01 = gsap.utils.clamp(0, 1);
const smooth = (t: number) => t * t * (3 - 2 * t);
const range = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
// Mitad del alto del marco 16:9 en fracciones del ancho: el círculo visible de la escena entrante no puede ser mayor
// o se verían los bordes de la imagen.
const MAX_RHO = 0.27;
const RATIO = 16 / 9;
const NOCHE = '#070a14';

async function cargar(src: string): Promise<Fuente> {
  const img = new Image();
  img.src = src;
  await img.decode();
  // ImageBitmap queda decodificada en memoria: dibujarla no vuelve a decodificar el WebP.
  if ('createImageBitmap' in window) {
    try {
      return await createImageBitmap(img);
    } catch {
      return img;
    }
  }
  return img;
}

export function initPortal(world: HTMLElement, reduceMotion: boolean) {
  const stage = world.querySelector<HTMLElement>('[data-stage]');
  const canvas = stage?.querySelector<HTMLCanvasElement>('[data-portal]');
  const ctx = canvas?.getContext('2d', { alpha: false });
  if (!stage || !canvas || !ctx) return;
  const poster = stage.querySelector<HTMLElement>('[data-poster]');
  const stops = [...world.querySelectorAll<HTMLElement>('[data-stop]')];
  const hand = document.querySelector<HTMLElement>('[data-dial-hand]');
  const dialLabel = document.querySelector<HTMLElement>('[data-dial-label]');
  const dialCount = document.querySelector<HTMLElement>('[data-dial-count]');
  const hint = stage.querySelector<HTMLElement>('[data-hint]');
  const last = stops.length - 1;
  const marks = stops.map((stop) => ScrollTrigger.create({ trigger: stop, start: 'top top' }));
  const pad = (n: number) => String(n).padStart(2, '0');

  // Capa auxiliar para recortar la escena entrante con su máscara circular.
  const aux = document.createElement('canvas');
  const actx = aux.getContext('2d');
  if (!actx) return;

  // Hay que volver a pintar (en movimiento reducido solo se pinta cuando cambia algo).
  let sucio = true;
  const fuentes: (Fuente | null)[] = escenas.map(() => null);
  // Primero la escena inicial y las dos siguientes; el resto, en orden, sin bloquear.
  (async () => {
    for (let i = 0; i < escenas.length; i++) {
      try {
        fuentes[i] = await cargar(escenas[i].src);
      } catch {
        fuentes[i] = null;
      }
      if (i === 0) {
        canvas.style.opacity = '1';
        if (poster) {
          poster.style.opacity = '0';
          // Fuera del todo tras el fundido: una imagen invisible a pantalla completa sigue gastando memoria gráfica.
          setTimeout(() => (poster.style.display = 'none'), 800);
        }
      }
      sucio = true;
    }
  })();

  let current = -2;
  const setCurrent = (index: number) => {
    if (index === current) return;
    current = index;
    stops.forEach((stop, i) => stop.classList.toggle('is-current', i === index));
    if (index < 0) return;
    if (dialLabel) dialLabel.textContent = stops[index].dataset.lugar ?? '';
    if (dialCount) dialCount.textContent = `${pad(index + 1)} / ${pad(stops.length)}`;
  };

  // Estado que calcula el scroll y que dibuja el bucle de pintado.
  let tramo = 0;
  let t = 0;

  const render = (self: ScrollTrigger) => {
    const y = self.scroll();
    const w = piecewise(y, [...marks.map((mark, i) => ({ y: mark.start, v: i })), { y: self.end, v: last + 0.5 }]);
    const at = Math.min(w, last);
    if (hand) hand.style.transform = `rotate(${(at / last) * 360}deg)`;
    if (hint) hint.style.opacity = String(clamp01(1 - w * 5));
    tramo = Math.min(Math.floor(at), last - 1);
    // Cada tramo deja quietas las escenas al principio y al final para que se pueda leer el texto.
    t = at >= last ? 1 : range(at - tramo, 0.18, 0.88);
    // El texto solo se ve con la escena quieta; durante el viaje la pantalla es toda imagen.
    setCurrent(t < 0.06 ? tramo : t > 0.94 ? tramo + 1 : -1);
    sucio = true;
  };

  const span = ScrollTrigger.create({
    trigger: world,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: render,
    onRefresh: render,
  });
  render(span);

  // Tamaño del canvas: el de la pantalla, con la densidad limitada para no pintar más píxeles de los que se notan.
  let W = 0;
  let H = 0;
  let dpr = 1;
  const medir = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = stage.clientWidth;
    H = stage.clientHeight;
    for (const c of [canvas, aux]) {
      c.width = Math.round(W * dpr);
      c.height = Math.round(H * dpr);
    }
    sucio = true;
  };
  medir();
  new ResizeObserver(medir).observe(stage);

  // Dibuja solo la parte visible de una escena colocada en (x0, y0) con tamaño (w, h) en píxeles CSS.
  const dibujar = (c: CanvasRenderingContext2D, img: Fuente, x0: number, y0: number, w: number, h: number) => {
    const margen = 0.06;
    const vx0 = -W * margen;
    const vy0 = -H * margen;
    const vx1 = W * (1 + margen);
    const vy1 = H * (1 + margen);
    const ax = Math.max(x0, vx0);
    const ay = Math.max(y0, vy0);
    const bx = Math.min(x0 + w, vx1);
    const by = Math.min(y0 + h, vy1);
    if (bx <= ax || by <= ay) return;
    const iw = img.width;
    const ih = img.height;
    const sx = ((ax - x0) / w) * iw;
    const sy = ((ay - y0) / h) * ih;
    const sw = ((bx - ax) / w) * iw;
    const sh = ((by - ay) / h) * ih;
    c.drawImage(img, sx, sy, sw, sh, ax, ay, bx - ax, by - ay);
  };

  // Movimiento ambiente: el escenario respira un poco y sigue al puntero, para que las imágenes fijas no parezcan fotos.
  const objetivo = { x: 0, y: 0 };
  const puntero = { x: 0, y: 0 };
  if (!reduceMotion) {
    window.addEventListener('pointermove', (event) => {
      if (event.pointerType !== 'mouse') return;
      objetivo.x = event.clientX / innerWidth - 0.5;
      objetivo.y = event.clientY / innerHeight - 0.5;
    });
  }

  const nieve = reduceMotion ? null : crearNieve();

  // Solo se pinta mientras el recorrido está en pantalla.
  let visible = true;
  new IntersectionObserver(([entry]) => (visible = entry.isIntersecting)).observe(world);

  let prev = 0;
  gsap.ticker.add((time) => {
    const dt = Math.min(time - prev, 0.05);
    prev = time;
    if (!visible) return;

    puntero.x += (objetivo.x - puntero.x) * 0.04;
    puntero.y += (objetivo.y - puntero.y) * 0.04;
    const respira = reduceMotion ? 1.02 : 1.04 + Math.sin(time * 0.35) * 0.012;
    const hayNieve = !!nieve && tramo === 0 && t < 0.9;
    if (!sucio && reduceMotion) return;

    // Marco 16:9 que cubre la pantalla, como object-fit: cover.
    const boxW = Math.max(W, H * RATIO);
    const boxH = boxW / RATIO;
    const ox = (W - boxW) / 2;
    const oy = (H - boxH) / 2;

    const conCamara = (c: CanvasRenderingContext2D) => {
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.translate(W / 2 - puntero.x * 18, H / 2 - puntero.y * 12);
      c.scale(respira, respira);
      c.translate(-W / 2, -H / 2);
    };

    const { portal: p, llegada: q, zoom: K, apertura } = tramos[tramo];
    const a = fuentes[tramo];
    const b = fuentes[tramo + 1];

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = NOCHE;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    conCamara(ctx);

    const pintar = (img: Fuente | null, plano: Plano, c: CanvasRenderingContext2D = ctx) => {
      if (!img || plano.alpha <= 0.002) return;
      c.globalAlpha = plano.alpha;
      dibujar(c, img, ox + plano.tx * boxW, oy + plano.ty * boxH, plano.k * boxW, plano.k * boxH);
      c.globalAlpha = 1;
    };

    if (reduceMotion) {
      pintar(a, { tx: 0, ty: 0, k: 1, alpha: 1 });
      pintar(b, { tx: 0, ty: 0, k: 1, alpha: smooth(range(t, 0.3, 0.7)) });
      sucio = false;
      return;
    }

    const e = smooth(t);
    const k = Math.pow(K, e);
    const cx = p.x + (q.x - p.x) * e;
    const cy = p.y + (q.y - p.y) * e;

    // Escena actual: se acerca al portal y al final se desvanece, como algo que pasa junto a la cámara.
    const ko = k * (1 + 0.6 * smooth(range(t, 0.6, 1)));
    pintar(a, { tx: cx - ko * p.x, ty: cy - ko * p.y, k: ko, alpha: 1 - smooth(range(t, 0.86, 1)) });

    // Escena siguiente: no aparece hasta que el portal ya es grande; antes, el portal enseña lo que tiene pintado.
    const alphaB = smooth(range(t, 0.42, 0.72));
    if (b && alphaB > 0.002) {
      const ki = k / K;
      const plano = { tx: cx - ki * q.x, ty: cy - ki * q.y, k: ki, alpha: 1 };
      if (t >= 1) {
        pintar(b, { ...plano, alpha: alphaB });
      } else {
        // Se pinta aparte y se recorta con un degradado radial que se abre al final del tramo.
        const rho0 = apertura ?? Math.min(p.r * K, MAX_RHO);
        const rho = rho0 + (1.4 - rho0) * smooth(range(t, 0.45, 1));
        const feather = 100 - 40 * (1 - smooth(range(t, 0.7, 1)));
        actx.setTransform(1, 0, 0, 1, 0, 0);
        actx.clearRect(0, 0, aux.width, aux.height);
        conCamara(actx);
        pintar(b, plano, actx);
        const gx = ox + (plano.tx + ki * q.x) * boxW;
        const gy = oy + (plano.ty + ki * q.y) * boxH;
        const radio = rho * ki * boxW;
        const g = actx.createRadialGradient(gx, gy, 0, gx, gy, radio);
        g.addColorStop(Math.max(0, Math.min(feather, 99.5) - 40) / 100, 'rgba(0,0,0,1)');
        g.addColorStop(feather / 100, 'rgba(0,0,0,0)');
        actx.globalCompositeOperation = 'destination-in';
        actx.fillStyle = g;
        actx.fillRect(-W, -H, W * 3, H * 3);
        actx.globalCompositeOperation = 'source-over';
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.globalAlpha = alphaB;
        ctx.drawImage(aux, 0, 0);
        ctx.globalAlpha = 1;
      }
    }

    // Nieve en el primer tramo: los copos salen despedidos desde el portal al hacer zoom.
    if (hayNieve && nieve) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const gx = ox + cx * boxW;
      const gy = oy + cy * boxH;
      nieve(ctx, W, H, dt, 1 - range(t, 0.55, 0.9), k, gx, gy);
    }
    sucio = false;
  });
}

type Copo = { x: number; y: number; z: number; vx: number; vy: number };

function crearNieve() {
  // Menos copos en pantallas pequeñas: se ven igual y cuestan la mitad.
  const cantidad = innerWidth < 768 ? 90 : 160;
  const copos: Copo[] = Array.from({ length: cantidad }, () => ({
    x: Math.random(),
    y: Math.random(),
    z: 0.25 + Math.random() * 0.75,
    vx: (Math.random() - 0.5) * 0.02,
    vy: 0.02 + Math.random() * 0.03,
  }));
  return (ctx: CanvasRenderingContext2D, W: number, H: number, dt: number, cantidad: number, zoom: number, ox: number, oy: number) => {
    if (cantidad <= 0.01) return;
    ctx.fillStyle = '#eef1f6';
    for (const f of copos) {
      f.x = (f.x + f.vx * dt * f.z + 1) % 1;
      f.y = (f.y + f.vy * dt * f.z) % 1;
      // Los copos cercanos (z alto) se separan más deprisa del centro al hacer zoom: sensación de atravesar la nevada.
      const s = Math.pow(zoom, 0.6 + f.z * 1.6);
      const x = ox + (f.x * W - ox) * s;
      const y = oy + (f.y * H - oy) * s;
      if (x < -20 || x > W + 20 || y < -20 || y > H + 20) continue;
      ctx.globalAlpha = cantidad * (0.25 + f.z * 0.55);
      ctx.beginPath();
      ctx.arc(x, y, (0.6 + f.z * 1.8) * Math.min(s, 3), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  };
}
