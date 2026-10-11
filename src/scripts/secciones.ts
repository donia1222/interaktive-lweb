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
  manifiesto();
  galeria();
  revelado();
  cifras();
  cinta();
  diagrama();
  branchen();
  pie();
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

// Branchen: la imagen de fuera se acerca a su portal y la de dentro se abre en círculo, con el scroll.
function branchen() {
  document.querySelectorAll<HTMLElement>('[data-branche]').forEach((tarjeta) => {
    const aussen = tarjeta.querySelector<HTMLElement>('[data-branche-aussen]');
    const innen = tarjeta.querySelector<HTMLElement>('[data-branche-innen]');
    if (!aussen || !innen) return;
    const r = Number(innen.dataset.r) * 100;
    const w = Number(innen.dataset.w || 0);
    const h = Number(innen.dataset.h || 0);
    const [ox, oy] = aussen.style.transformOrigin.split(' ').map((v) => parseFloat(v) / 100);
    const estado = { r, abre: 0 };
    // Círculo que crece o, si el portal es un rectángulo (el ventanal de la casa), un recorte que se abre hacia los bordes.
    const pintar = () => {
      if (w && h) {
        const k = 1 - estado.abre;
        innen.style.clipPath = `inset(${(oy - h / 2) * 100 * k}% ${(1 - ox - w / 2) * 100 * k}% ${(1 - oy - h / 2) * 100 * k}% ${(ox - w / 2) * 100 * k}% round ${12 * k}px)`;
      } else {
        innen.style.clipPath = `circle(${estado.r}% at ${ox * 100}% ${oy * 100}%)`;
      }
    };
    gsap
      .timeline({ scrollTrigger: { trigger: tarjeta, start: 'top 75%', end: 'center 35%', scrub: 1 } })
      .to(aussen, { scale: 2.6, ease: 'power2.in', duration: 1 }, 0)
      .to(innen, { opacity: 1, ease: 'none', duration: 0.25 }, 0.15)
      .to(estado, { r: 80, abre: 1, ease: 'power2.in', duration: 0.75, onUpdate: pintar }, 0.25)
      .fromTo(innen, { scale: 1.25 }, { scale: 1, ease: 'none', duration: 1 }, 0);
  });
}
