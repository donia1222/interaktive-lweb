import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

// Animaciones de las secciones que van después del recorrido.
// Beispiele: los dos teléfonos llegan girados en 3D (cada uno hacia su lado) y se enderezan al entrar en pantalla.
function beispiele(reduceMotion: boolean) {
  if (reduceMotion) return;
  document.querySelectorAll<HTMLElement>('[data-beispiel]').forEach((b) => {
    const telefon = b.querySelector<HTMLElement>('[data-telefon]');
    if (!telefon) return;
    const lado = Number(b.dataset.beispiel) === 0 ? -1 : 1;
    gsap.fromTo(
      telefon,
      { rotateY: 38 * lado, rotateX: 14, rotateZ: -6 * lado, y: 120, scale: 0.86, transformPerspective: 1100 },
      {
        rotateY: 0,
        rotateX: 0,
        rotateZ: 0,
        y: 0,
        scale: 1,
        ease: 'power2.out',
        scrollTrigger: { trigger: b, start: 'top 95%', end: 'top 35%', scrub: 0.6 },
      },
    );
  });
}

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
  beispiele(reduceMotion);
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
  // La galería termina con la última tarjeta exactamente en el centro de la pantalla, sea cual sea su tamaño.
  const ultimaTarjeta = [...pista.querySelectorAll<HTMLElement>('[data-branche]')].pop();
  const distancia = () => {
    if (!ultimaTarjeta) return pista.scrollWidth - window.innerWidth;
    const izquierda = ultimaTarjeta.getBoundingClientRect().left - pista.getBoundingClientRect().left;
    return izquierda + ultimaTarjeta.offsetWidth / 2 - window.innerWidth / 2;
  };
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

// Pie: las letras de la marca suben una a una y, al llegar, una ola de luz dorada recorre la palabra.
// Después el punto se queda latiendo y la ola vuelve a pasar de vez en cuando.
function pie() {
  const marca = document.querySelector<HTMLElement>('[data-pie-marca]');
  if (!marca) return;
  document.fonts.ready.then(() => {
    // La máscara va en la línea, no en cada letra: con las letras tan juntas, una máscara por letra cortaba los bordes.
    const split = SplitText.create(marca, { type: 'lines,chars', mask: 'lines', linesClass: 'pb-[0.06em]' });
    const letras = split.chars as HTMLElement[];
    const punto = marca.querySelector<HTMLElement>('.text-akzent');
    const brillo = '0 0 0.12em rgba(255,214,160,0.95), 0 0 0.35em rgba(242,180,109,0.7), 0 0 0.8em rgba(242,180,109,0.35)';
    const apagado = '0 0 0 rgba(255,214,160,0), 0 0 0 rgba(242,180,109,0), 0 0 0 rgba(242,180,109,0)';
    gsap.set(letras, { textShadow: apagado });

    // Ola de luz: cada letra se enciende y se apaga, en orden.
    const ola = () =>
      gsap
        .timeline()
        .to(letras, { color: '#fff4e3', textShadow: brillo, duration: 0.35, ease: 'power2.out', stagger: 0.06 }, 0)
        .to(letras, { color: '', textShadow: apagado, duration: 0.9, ease: 'power2.inOut', stagger: 0.06 }, 0.35);

    const entrada = gsap.timeline({ paused: true });
    entrada
      .from(letras, { yPercent: 100, duration: 1.4, ease: 'expo.out', stagger: 0.08 })
      .add(ola(), 0.9);
    if (punto) {
      entrada.to(punto, { textShadow: '0 0 0.25em rgba(242,180,109,0.9), 0 0 0.6em rgba(242,180,109,0.5)', duration: 0.6 }, 1.4);
      // El punto late suave mientras el pie se ve.
      const late = gsap.to(punto, { textShadow: '0 0 0.1em rgba(242,180,109,0.5), 0 0 0.3em rgba(242,180,109,0.2)', duration: 1.6, ease: 'sine.inOut', repeat: -1, yoyo: true, paused: true });
      entrada.eventCallback('onComplete', () => late.play());
    }
    // Cada pocos segundos, otra ola mientras el pie está a la vista.
    let repetir: gsap.core.Tween | null = null;
    ScrollTrigger.create({
      trigger: marca,
      start: 'top 90%',
      once: false,
      onEnter: () => {
        if (!entrada.progress()) entrada.play();
        repetir ??= gsap.delayedCall(6, function bucle() {
          ola();
          repetir = gsap.delayedCall(6, bucle);
        });
      },
      onLeaveBack: () => {
        repetir?.kill();
        repetir = null;
      },
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
  // La galería termina con la última tarjeta exactamente en el centro de la pantalla, sea cual sea su tamaño.
  const ultimaTarjeta = [...pista.querySelectorAll<HTMLElement>('[data-branche]')].pop();
  const distancia = () => {
    if (!ultimaTarjeta) return pista.scrollWidth - window.innerWidth;
    const izquierda = ultimaTarjeta.getBoundingClientRect().left - pista.getBoundingClientRect().left;
    return izquierda + ultimaTarjeta.offsetWidth / 2 - window.innerWidth / 2;
  };
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
  const movil = !matchMedia('(min-width: 768px)').matches;
  const tarjetas = document.querySelectorAll<HTMLElement>('[data-branche]');
  tarjetas.forEach((tarjeta, i) => {
    const ultima = i === tarjetas.length - 1;
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
      // El portal no empieza a abrirse hasta que la tarjeta está casi centrada: antes se ve la foto de fuera entera.
      // En móvil la tarjeta ocupa casi toda la pantalla, así que espera a que su borde izquierdo llegue cerca del margen.
      .timeline({
        scrollTrigger: {
          trigger: tarjeta,
          containerAnimation: recorrido,
          // La última no puede pasar del centro (la galería termina con ella centrada), así que se abre entre su
          // llegada y ese final.
          start: ultima ? (movil ? 'left 45%' : 'left 50%') : movil ? 'left 18%' : 'left 45%',
          end: ultima ? 'center 50%' : movil ? 'center 22%' : 'center 35%',
          scrub: true,
        },
      })
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

// Hinter der Magie: un solo travelling. La cámara es un rectángulo sobre la foto (centro y escala) que va de "la foto
// entera, como un cuadro en el centro" a "el monitor llenando la pantalla". La escala crece de forma geométrica, como en
// el hero, y el centro avanza al mismo ritmo que el zoom, así el monitor se acerca sin desplazamientos raros.
function magie() {
  const seccion = document.querySelector<HTMLElement>('[data-magie]');
  const welt = document.querySelector<HTMLElement>('[data-magie-welt]');
  const kopf = document.querySelector<HTMLElement>('[data-magie-kopf]');
  const fuss = document.querySelector<HTMLElement>('[data-magie-fuss]');
  if (!seccion || !welt) return;
  const m = JSON.parse(welt.dataset.monitor ?? '{}') as { x: number; y: number; w: number; h: number };
  const fichas = [...welt.querySelectorAll<HTMLElement>('[data-ficha]')];
  const estado = { e: 0 };
  let W = 0;
  let H = 0;
  let Wd = 0;
  let Hd = 0;
  let s0 = 1;
  let s1 = 1;

  const medir = () => {
    W = window.innerWidth;
    H = (welt.parentElement as HTMLElement).clientHeight;
    Wd = welt.offsetWidth;
    Hd = welt.offsetHeight;
    // Al empezar: la foto entera, como un cuadro con aire para el titular arriba y el texto abajo.
    s0 = Math.min((0.88 * W) / Wd, (0.58 * H) / Hd);
    // Al terminar: la pantalla del monitor cubre la vista.
    s1 = 1.04 * Math.max(W / (m.w * Wd), H / (m.h * Hd));
    // Titular y texto pegados al cuadro inicial.
    const alto = Hd * s0;
    if (kopf) kopf.style.bottom = `${(H + alto) / 2 + 28}px`;
    if (fuss) fuss.style.top = `${(H + alto) / 2 + 24}px`;
    encajar();
    pintar();
  };

  const pintar = () => {
    const e = estado.e;
    const s = s0 * Math.pow(s1 / s0, e);
    // El centro avanza al ritmo del zoom (no del tiempo): primero crece el cuadro, después se acerca al monitor.
    const f = (s - s0) / (s1 - s0);
    const cx = 0.5 + (m.x + m.w / 2 - 0.5) * f;
    const cy = 0.5 + (m.y + m.h / 2 - 0.5) * f;
    const tx = W / 2 - s * cx * Wd;
    const ty = H / 2 - s * cy * Hd;
    welt.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${s})`;
    // Esquinas redondeadas del cuadro que se enderezan al llenar la pantalla (el radio se compensa con la escala).
    welt.style.borderRadius = `${(28 * Math.max(0, 1 - e * 3)) / s}px`;
    // Fichas de código: aparecen al acercarse y se desvanecen al pasar junto a la cámara.
    const vis = gsap.utils.clamp(0, 1, (e - 0.12) / 0.15) * (1 - gsap.utils.clamp(0, 1, (e - 0.55) / 0.2));
    fichas.forEach((ficha, i) => {
      ficha.style.opacity = String(vis);
      ficha.style.transform = `translateY(${(1 - vis) * 12 + i * e * -6}px)`;
    });
  };

  // Encaja la imagen del monitor en sus cuatro esquinas con una homografía (matrix3d), un pelín hacia dentro del marco.
  const mini = welt.querySelector<HTMLElement>('[data-mini]');
  const esquinas = JSON.parse(welt.dataset.esquinas ?? '[]') as [number, number][];
  const encajar = () => {
    if (!mini || esquinas.length !== 4) return;
    const cx = esquinas.reduce((t, q) => t + q[0], 0) / 4;
    const cy = esquinas.reduce((t, q) => t + q[1], 0) / 4;
    const [p0, p1, p2, p3] = esquinas.map(([x, y]) => [(cx + (x - cx) * 0.985) * Wd, (cy + (y - cy) * 0.98) * Hd]);
    const dx1 = p1[0] - p2[0], dx2 = p3[0] - p2[0], dx3 = p0[0] - p1[0] + p2[0] - p3[0];
    const dy1 = p1[1] - p2[1], dy2 = p3[1] - p2[1], dy3 = p0[1] - p1[1] + p2[1] - p3[1];
    const det = dx1 * dy2 - dx2 * dy1;
    const g = (dx3 * dy2 - dx2 * dy3) / det;
    const h = (dx1 * dy3 - dx3 * dy1) / det;
    const a = p1[0] - p0[0] + g * p1[0], b = p3[0] - p0[0] + h * p3[0], c = p0[0];
    const d = p1[1] - p0[1] + g * p1[1], e = p3[1] - p0[1] + h * p3[1], f = p0[1];
    // El elemento ocupa toda la foto (Wd × Hd); la homografía va del cuadrado unidad a las esquinas.
    Object.assign(mini.style, { left: '0', top: '0', width: `${Wd}px`, height: `${Hd}px`, transformOrigin: '0 0', borderRadius: '0' });
    mini.style.transform = `matrix3d(${a / Wd},${d / Wd},0,${g / Wd},${b / Hd},${e / Hd},0,${h / Hd},0,0,1,0,${c},${f},0,1)`;
  };

  welt.style.opacity = '1';
  welt.style.boxShadow = '0 40px 120px rgba(0,0,0,.55), 0 0 0 1px rgba(255,255,255,.08)';
  medir();
  window.addEventListener('resize', medir);
  ScrollTrigger.addEventListener('refresh', medir);

  // El bucle del monitor solo se reproduce mientras la sección está a la vista.
  // Incluye la copia a pantalla completa: las dos van en pausa y en marcha a la vez, así siguen sincronizadas.
  const bucle = [...seccion.querySelectorAll<HTMLElement>('.mini-portal img')];
  const reproducir = (si: boolean) => bucle.forEach((img) => (img.style.animationPlayState = si ? 'running' : 'paused'));
  reproducir(false);
  ScrollTrigger.create({ trigger: seccion, start: 'top bottom', end: 'bottom top', onToggle: (self) => reproducir(self.isActive) });

  gsap
    .timeline({ scrollTrigger: { trigger: seccion, start: 'top top', end: 'bottom bottom', scrub: 1 } })
    .to('[data-magie-antes]', { opacity: 0, y: -30, duration: 0.12 }, 0.14)
    .to(estado, { e: 1, ease: 'power1.inOut', duration: 0.66, onUpdate: pintar }, 0.12)
    .to(welt, { boxShadow: '0 0 0 0 rgba(0,0,0,0)', duration: 0.2 }, 0.2)
    .to('[data-magie-voll]', { opacity: 1, ease: 'none', duration: 0.08 }, 0.7)
    .to('[data-magie-velo]', { opacity: 1, duration: 0.1 }, 0.8)
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
