import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

// Animaciones de las secciones que van después del recorrido.
export function initSecciones(reduceMotion: boolean) {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  fondos();
  palabras(reduceMotion);
  if (reduceMotion) {
    document.querySelectorAll<HTMLElement>('[data-contador]').forEach((el) => (el.textContent = formato(Number(el.dataset.contador))));
    return;
  }
  titulares();
  // En el orden de la página: las secciones fijadas (pin) añaden altura, y lo que va debajo debe calcularse después.
  manifiesto();
  unterschied();
  branchen();
  magie();
  ablauf();
  cinta();
  revelado();
  pie();
  luz();
  magnet();
  // Los triggers creados antes (fondos, palabras) se reordenan por posición y se recalculan con los pins ya puestos.
  ScrollTrigger.sort();
  ScrollTrigger.refresh();
}

// Formato suizo: 28'800.
const formato = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");

// El fondo de la página cambia de color al entrar en cada sección.
function fondos() {
  const body = document.body;
  const secciones = [...document.querySelectorAll<HTMLElement>('[data-bg]')];
  const inicial = getComputedStyle(document.documentElement).backgroundColor;
  secciones.forEach((seccion, i) => {
    const anterior = i === 0 ? inicial : secciones[i - 1].dataset.bg!;
    ScrollTrigger.create({
      trigger: seccion,
      start: 'top 55%',
      end: 'bottom 55%',
      onEnter: () => gsap.to(body, { backgroundColor: seccion.dataset.bg, duration: 1.2, ease: 'power2.out' }),
      onLeaveBack: () => gsap.to(body, { backgroundColor: anterior, duration: 1.2, ease: 'power2.out' }),
    });
  });
}

// Frases que se encienden palabra a palabra, en orden de lectura, mientras se hace scroll.
function palabras(reduceMotion: boolean) {
  document.querySelectorAll<HTMLElement>('[data-words]').forEach((bloque) => {
    const words = [...bloque.querySelectorAll<HTMLElement>('[data-word]')];
    if (reduceMotion) {
      words.forEach((word) => word.classList.add('is-lit'));
      return;
    }
    const seccion = bloque.closest('section') ?? bloque;
    ScrollTrigger.create({
      trigger: seccion,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const lit = Math.round(gsap.utils.clamp(0, 1, self.progress * 1.25) * words.length);
        words.forEach((word, i) => word.classList.toggle('is-lit', i < lit));
      },
    });
  });
}

// Titulares: cada línea sube desde debajo de su propia máscara, palabra a palabra y con un poco de desenfoque.
function titulares() {
  // El desenfoque palabra a palabra solo con ratón; en táctil, solo el movimiento.
  const conBlur = matchMedia('(hover: hover) and (pointer: fine)').matches;
  document.fonts.ready.then(() => {
    document.querySelectorAll<HTMLElement>('[data-split]').forEach((titular) => {
      const split = SplitText.create(titular, { type: 'lines,words', mask: 'lines', linesClass: 'pb-[0.08em]' });
      gsap.from(split.words, {
        yPercent: 110,
        ...(conBlur ? { filter: 'blur(8px)' } : {}),
        duration: 1.2,
        ease: 'expo.out',
        stagger: 0.06,
        scrollTrigger: { trigger: titular, start: 'top 85%' },
      });
    });
  });
}

function manifiesto() {
  const esfera = document.querySelector<SVGSVGElement>('[data-esfera]');
  const seccion = document.querySelector('[data-manifiesto]');
  if (!esfera || !seccion) return;
  const marcas = esfera.querySelectorAll('line');
  const aros = esfera.querySelectorAll('circle');
  gsap.set(aros, { strokeDasharray: 1, strokeDashoffset: 1 });
  const tl = gsap.timeline({ scrollTrigger: { trigger: seccion, start: 'top bottom', end: 'bottom top', scrub: 1 } });
  tl.fromTo(esfera, { rotate: -40, scale: 0.85 }, { rotate: 60, scale: 1.1, ease: 'none' }, 0)
    .from(marcas, { opacity: 0, stagger: { each: 0.004, from: 'random' }, ease: 'none', duration: 0.3 }, 0)
    .to(aros, { strokeDashoffset: 0, ease: 'none', duration: 0.5, stagger: 0.1 }, 0.1);
}

// Galería horizontal: la sección se fija y las tarjetas pasan de lado; cada imagen se desplaza dentro de su tarjeta.
function galeria() {
  const pin = document.querySelector<HTMLElement>('[data-galeria-pin]');
  const pista = document.querySelector<HTMLElement>('[data-galeria-pista]');
  const barra = document.querySelector<HTMLElement>('[data-galeria-barra]');
  if (!pin || !pista) return;
  const distancia = () => pista.scrollWidth - window.innerWidth;
  const recorrido = gsap.to(pista, {
    x: () => -distancia(),
    ease: 'none',
    scrollTrigger: {
      trigger: pin,
      start: 'top top',
      end: () => `+=${distancia()}`,
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => barra && (barra.style.transform = `scaleX(${self.progress})`),
    },
  });
  pista.querySelectorAll<HTMLElement>('[data-galeria-tarjeta]').forEach((tarjeta) => {
    const img = tarjeta.querySelector('[data-galeria-img]');
    gsap.fromTo(img, { xPercent: -8 }, {
      xPercent: 8,
      ease: 'none',
      scrollTrigger: { trigger: tarjeta, containerAnimation: recorrido, start: 'left right', end: 'right left', scrub: true },
    });
    gsap.from(tarjeta, {
      rotate: 4,
      yPercent: 8,
      scale: 0.92,
      ease: 'none',
      scrollTrigger: { trigger: tarjeta, containerAnimation: recorrido, start: 'left right', end: 'left 60%', scrub: true },
    });
  });
}

// Revelado: un círculo dorado se abre hasta ocupar la pantalla y deja ver las montañas.
function revelado() {
  const seccion = document.querySelector('[data-revelado]');
  const mascara = document.querySelector<HTMLElement>('[data-revelado-mascara]');
  if (!seccion || !mascara) return;
  const aro = document.querySelector('[data-revelado-aro]');
  const img = document.querySelector('[data-revelado-img]');
  const radio = { r: 8 };
  const pintar = () => (mascara.style.clipPath = `circle(${radio.r}vmax at 50% 50%)`);
  const tl = gsap.timeline({ scrollTrigger: { trigger: seccion, start: 'top top', end: 'bottom bottom', scrub: 1 } });
  tl.to(radio, { r: 80, ease: 'power2.in', duration: 0.6, onUpdate: pintar }, 0.05)
    .to(aro, { width: '160vmax', height: '160vmax', opacity: 0, ease: 'power2.in', duration: 0.6 }, 0.05)
    .to(img, { scale: 1, ease: 'none', duration: 0.8 }, 0)
    .to('[data-revelado-antes]', { opacity: 0, y: -40, filter: 'blur(10px)', duration: 0.15 }, 0.12)
    .to('[data-revelado-despues]', { opacity: 1, duration: 0.2 }, 0.62)
    .from('[data-revelado-despues] > *', { y: 60, filter: 'blur(12px)', stagger: 0.06, duration: 0.25 }, 0.62);
  // El círculo pequeño se lee mejor con la escala de las letras de vmin; pasado a vmax se ajusta en el primer frame.
  radio.r = 8 * (Math.min(innerWidth, innerHeight) / Math.max(innerWidth, innerHeight));
  pintar();
}

// Cifras: contadores y un volante que oscila como uno de verdad, más rápido cuanto más rápido se hace scroll.
function cifras() {
  document.querySelectorAll<HTMLElement>('[data-contador]').forEach((el) => {
    const valor = { n: 0 };
    gsap.to(valor, {
      n: Number(el.dataset.contador),
      duration: 2.2,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
      onUpdate: () => (el.textContent = formato(valor.n)),
    });
  });
  const volante = document.querySelector('[data-volante]');
  const espiral = document.querySelector<SVGPathElement>('[data-espiral]');
  if (volante) {
    const oscila = gsap.fromTo(volante, { rotate: -150 }, { rotate: 150, duration: 0.9, ease: 'sine.inOut', repeat: -1, yoyo: true, paused: true });
    // Solo oscila mientras se ve.
    ScrollTrigger.create({ trigger: '[data-cifras]', start: 'top bottom', end: 'bottom top', onToggle: (self) => (self.isActive ? oscila.play() : oscila.pause()) });
  }
  if (espiral) {
    gsap.set(espiral, { strokeDasharray: 1, strokeDashoffset: 1 });
    gsap.to(espiral, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: { trigger: '[data-cifras]', start: 'top 80%', end: 'center center', scrub: 1 },
    });
  }
}

// Cinta: dos filas en bucle que aceleran y se inclinan con la velocidad del scroll.
function cinta() {
  const filas = [...document.querySelectorAll<HTMLElement>('[data-cinta-fila]')];
  if (!filas.length) return;
  let impulso = 0;
  let inclinacion = 0;
  let visible = false;
  ScrollTrigger.create({
    trigger: '[data-cinta]',
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => (visible = self.isActive),
    onUpdate: (self) => (impulso = gsap.utils.clamp(-30, 30, self.getVelocity() / 120)),
  });
  const posiciones = filas.map(() => 0);
  gsap.ticker.add((_, delta) => {
    if (!visible) return;
    impulso *= 0.92;
    inclinacion += (impulso * 0.6 - inclinacion) * 0.1;
    filas.forEach((fila, i) => {
      const sentido = fila.hasAttribute('data-invertida') ? 1 : -1;
      const mitad = fila.scrollWidth / 2;
      posiciones[i] += sentido * (0.6 + Math.abs(impulso)) * (delta / 16);
      if (posiciones[i] <= -mitad) posiciones[i] += mitad;
      if (posiciones[i] >= 0) posiciones[i] -= mitad;
      fila.style.transform = `translate3d(${posiciones[i]}px,0,0) skewX(${-inclinacion * sentido}deg)`;
    });
  });
}

// Diagrama: la cámara entra en los círculos anidados mientras se leen los pasos, y el paso activo se ilumina.
function diagrama() {
  const grupo = document.querySelector('[data-diagrama]');
  if (grupo) {
    gsap.fromTo(grupo, { scale: 1 }, {
      scale: Math.pow(1 / 0.52, 4),
      ease: 'none',
      svgOrigin: '0 0',
      scrollTrigger: { trigger: '[data-como]', start: 'top top', end: 'bottom bottom', scrub: 1 },
    });
  }
  document.querySelectorAll<HTMLElement>('[data-paso]').forEach((paso) => {
    ScrollTrigger.create({
      trigger: paso,
      start: 'top 60%',
      end: 'bottom 40%',
      toggleClass: { targets: paso, className: 'is-activo' },
    });
  });
}

// Pie: las letras de la marca suben una a una.
function pie() {
  const marca = document.querySelector<HTMLElement>('[data-pie-marca]');
  if (!marca) return;
  document.fonts.ready.then(() => {
    const split = SplitText.create(marca, { type: 'chars', mask: 'chars' });
    gsap.from(split.chars, {
      yPercent: 100,
      duration: 1.4,
      ease: 'expo.out',
      stagger: 0.08,
      scrollTrigger: { trigger: marca, start: 'top 90%' },
    });
  });
}

// Der Unterschied: una línea de luz barre la web normal y deja ver la interactiva; el texto de abajo cambia con ella.
function unterschied() {
  const seccion = document.querySelector('[data-unterschied]');
  const capa = document.querySelector<HTMLElement>('[data-unterschied-interaktiv]');
  const linie = document.querySelector<HTMLElement>('[data-unterschied-linie]');
  if (!seccion || !capa || !linie) return;
  const estado = { corte: 100 };
  const pintar = () => {
    capa.style.clipPath = `inset(0 0 0 ${estado.corte}%)`;
    linie.style.left = `${estado.corte}%`;
  };
  gsap
    .timeline({ scrollTrigger: { trigger: seccion, start: 'top top', end: 'bottom bottom', scrub: 1 } })
    .to(estado, { corte: 0, ease: 'power1.inOut', duration: 0.7, onUpdate: pintar }, 0.12)
    .fromTo('[data-unterschied-bild]', { scale: 1.6 }, { scale: 1, ease: 'power2.out', duration: 0.9 }, 0.1)
    .to(linie, { opacity: 0, duration: 0.08 }, 0.8)
    .to('[data-unterschied-normal]', { opacity: 0, y: -12, duration: 0.12 }, 0.4)
    .fromTo('[data-unterschied-wow]', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.12 }, 0.46);
}

// Branchen: galería horizontal fija. El portal de cada sector se abre mientras su tarjeta cruza el centro.
function branchen() {
  const pin = document.querySelector<HTMLElement>('[data-branchen-pin]');
  const pista = document.querySelector<HTMLElement>('[data-branchen-pista]');
  const barra = document.querySelector<HTMLElement>('[data-branchen-barra]');
  if (!pin || !pista) return;
  const distancia = () => pista.scrollWidth - window.innerWidth;
  const recorrido = gsap.to(pista, {
    x: () => -distancia(),
    ease: 'none',
    scrollTrigger: {
      trigger: pin,
      start: 'top top',
      // Más recorrido de scroll que de píxeles: da tiempo a ver abrirse cada portal.
      end: () => `+=${distancia() * 1.6}`,
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => barra && (barra.style.transform = `scaleX(${self.progress})`),
    },
  });
  document.querySelectorAll<HTMLElement>('[data-branche]').forEach((tarjeta) => {
    const buehne = tarjeta.querySelector<HTMLElement>('[data-branche-buehne]');
    const aussen = tarjeta.querySelector<HTMLElement>('[data-branche-aussen]');
    const innen = tarjeta.querySelector<HTMLElement>('[data-branche-innen]');
    const texto = tarjeta.querySelector<HTMLElement>('[data-branche-text]');
    if (!buehne || !aussen || !innen) return;
    const p = JSON.parse(tarjeta.dataset.portal ?? '{}') as { x: number; y: number; r: number; w?: number; h?: number };
    const estado = { abre: 0 };
    // El portal se calcula en píxeles: en móvil la tarjeta es vertical y la foto (16:9, object-cover) se recorta por
    // los lados, así que las fracciones de la foto no coinciden con las de la tarjeta.
    let geo = { bw: 0, bh: 0, px: 0, py: 0, r: 0, w: 0, h: 0 };
    const medir = () => {
      const bw = buehne.clientWidth;
      const bh = buehne.clientHeight;
      const iw = Math.max(bw, (bh * 16) / 9);
      const ih = (iw * 9) / 16;
      const px = (bw - iw) / 2 + p.x * iw;
      const py = (bh - ih) / 2 + p.y * ih;
      geo = { bw, bh, px, py, r: p.r * iw, w: (p.w ?? 0) * iw, h: (p.h ?? 0) * ih };
      aussen.style.transformOrigin = innen.style.transformOrigin = `${px}px ${py}px`;
      pintar();
    };
    // Círculo que crece o, si el portal es un rectángulo (el ventanal de la casa), un recorte que se abre hacia los bordes.
    const pintar = () => {
      const { bw, bh, px, py, r, w, h } = geo;
      const k = 1 - estado.abre;
      if (w && h) {
        innen.style.clipPath = `inset(${(py - h / 2) * k}px ${(bw - px - w / 2) * k}px ${(bh - py - h / 2) * k}px ${(px - w / 2) * k}px round ${12 * k}px)`;
      } else {
        const lejos = Math.hypot(Math.max(px, bw - px), Math.max(py, bh - py));
        innen.style.clipPath = `circle(${r + (lejos - r) * estado.abre}px at ${px}px ${py}px)`;
      }
    };
    medir();
    new ResizeObserver(medir).observe(buehne);
    gsap
      .timeline({ scrollTrigger: { trigger: tarjeta, containerAnimation: recorrido, start: 'left 85%', end: 'center 50%', scrub: true } })
      .to(aussen, { scale: 2.6, ease: 'power2.in', duration: 1 }, 0)
      .to(innen, { opacity: 1, ease: 'none', duration: 0.2 }, 0.2)
      .to(estado, { abre: 1, ease: 'power2.in', duration: 0.7, onUpdate: pintar }, 0.3)
      .fromTo(innen, { scale: 1.3 }, { scale: 1, ease: 'none', duration: 1 }, 0);
    if (texto) {
      gsap.from(texto, {
        opacity: 0,
        y: 30,
        ease: 'none',
        scrollTrigger: { trigger: tarjeta, containerAnimation: recorrido, start: 'left 70%', end: 'left 40%', scrub: true },
      });
    }
  });
}

// Hinter der Magie: la cámara vuela hacia el monitor del estudio hasta que su pantalla llena la vista.
function magie() {
  const seccion = document.querySelector<HTMLElement>('[data-magie]');
  const welt = document.querySelector<HTMLElement>('[data-magie-welt]');
  if (!seccion || !welt) return;
  const m = JSON.parse(welt.dataset.monitor ?? '{}') as { x: number; y: number; w: number; h: number };
  const cx = m.x + m.w / 2;
  const cy = m.y + m.h / 2;
  // Medidas del marco 16:9 que cubre la pantalla y del centro del monitor dentro de la vista.
  const medir = () => {
    const W = window.innerWidth;
    const H = (welt.parentElement as HTMLElement).clientHeight;
    const boxW = Math.max(W, (H * 16) / 9);
    const boxH = (boxW * 9) / 16;
    const left = (W - boxW) / 2;
    const top = (H - boxH) / 2;
    const ox = left + cx * boxW;
    const oy = top + cy * boxH;
    // Al empezar, desplazar lo justo para acercar el monitor al centro sin dejar huecos en los bordes
    // (en móvil la foto se recorta por los lados y el monitor quedaría fuera).
    const x0 = gsap.utils.clamp(W - left - boxW, -left, W / 2 - ox);
    const escala = 1.06 * Math.max(W / (m.w * boxW), H / (m.h * boxH));
    return { x0, x1: W / 2 - ox, y1: H / 2 - oy, escala };
  };
  let med = medir();
  // El bucle del monitor solo se reproduce mientras la sección está a la vista.
  const mini = [...welt.querySelectorAll<HTMLElement>('.mini-portal img')];
  const reproducir = (si: boolean) => mini.forEach((img) => (img.style.animationPlayState = si ? 'running' : 'paused'));
  reproducir(false);
  ScrollTrigger.create({ trigger: seccion, start: 'top bottom', end: 'bottom top', onToggle: (self) => reproducir(self.isActive) });
  ScrollTrigger.addEventListener('refreshInit', () => (med = medir()));
  gsap
    .timeline({ scrollTrigger: { trigger: seccion, start: 'top top', end: 'bottom bottom', scrub: 1, invalidateOnRefresh: true } })
    .fromTo(welt, { x: () => med.x0, y: 0, scale: 1 }, { x: () => med.x1, y: () => med.y1, scale: () => med.escala, ease: 'power3.in', duration: 0.7 }, 0.18)
    .to('[data-magie-antes]', { opacity: 0, y: -30, duration: 0.14 }, 0.16)
    .to('[data-magie-despues]', { opacity: 1, duration: 0.1 }, 0.82)
    .from('[data-magie-despues] > *', { y: 50, stagger: 0.04, duration: 0.14 }, 0.82);
}

// So entsteht sie: la línea se dibuja con el scroll y cada paso se enciende cuando la línea llega a él.
function ablauf() {
  const seccion = document.querySelector('[data-ablauf]');
  const linie = document.querySelector('[data-ablauf-linie]');
  if (!seccion || !linie) return;
  gsap.to(linie, {
    scaleY: 1,
    ease: 'none',
    scrollTrigger: { trigger: seccion.querySelector('ol'), start: 'top 60%', end: 'bottom 60%', scrub: 0.6 },
  });
  document.querySelectorAll<HTMLElement>('[data-schritt]').forEach((schritt) => {
    const inhalt = schritt.querySelector<HTMLElement>('[data-schritt-inhalt]');
    ScrollTrigger.create({ trigger: schritt, start: 'top 60%', toggleClass: { targets: schritt, className: 'is-on' } });
    if (inhalt) {
      const desdeDerecha = inhalt.dataset.seite === 'rechts' || window.innerWidth < 768;
      gsap.from(inhalt, {
        x: desdeDerecha ? 60 : -60,
        opacity: 0,
        duration: 1.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: schritt, start: 'top 70%' },
      });
    }
  });
}

// Escritorio: una luz suave sigue al ratón por las secciones oscuras.
function luz() {
  const el = document.querySelector<HTMLElement>('[data-luz]');
  if (!el || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const pos = { x: innerWidth / 2, y: innerHeight / 2 };
  const objetivo = { ...pos };
  window.addEventListener('pointermove', (e) => {
    objetivo.x = e.clientX;
    objetivo.y = e.clientY;
    el.classList.add('is-on');
  });
  gsap.ticker.add(() => {
    pos.x += (objetivo.x - pos.x) * 0.12;
    pos.y += (objetivo.y - pos.y) * 0.12;
    el.style.setProperty('--lx', `${pos.x}px`);
    el.style.setProperty('--ly', `${pos.y}px`);
  });
}

// Escritorio: los botones se acercan un poco al puntero, como si tuvieran imán.
function magnet() {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  document.querySelectorAll<HTMLElement>('[data-magnet], .btn-akzent').forEach((boton) => {
    const xTo = gsap.quickTo(boton, 'x', { duration: 0.5, ease: 'power3.out' });
    const yTo = gsap.quickTo(boton, 'y', { duration: 0.5, ease: 'power3.out' });
    boton.addEventListener('pointermove', (e) => {
      const r = boton.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.3);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.4);
    });
    boton.addEventListener('pointerleave', () => {
      xTo(0);
      yTo(0);
    });
  });
}
