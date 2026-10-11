import { Fragment } from 'react';

const frase =
  'Die meisten Websites sehen gleich aus. Man scrollt, man vergisst. Eine interaktive Website ist anders: Man geht hinein, man erlebt sie, und man erzählt davon.';

// Esfera de 60 marcas que se dibuja y gira detrás de la frase.
function Esfera() {
  return (
    <svg data-esfera viewBox="0 0 400 400" className="h-full w-full" aria-hidden="true">
      {Array.from({ length: 60 }, (_, i) => {
        const a = (i / 60) * Math.PI * 2;
        const largo = i % 5 === 0 ? 22 : 9;
        return (
          <line
            key={i}
            x1={200 + Math.cos(a) * (190 - largo)}
            y1={200 + Math.sin(a) * (190 - largo)}
            x2={200 + Math.cos(a) * 190}
            y2={200 + Math.sin(a) * 190}
            stroke="currentColor"
            strokeWidth={i % 5 === 0 ? 2 : 1}
            strokeLinecap="round"
          />
        );
      })}
      <circle cx="200" cy="200" r="150" fill="none" stroke="currentColor" strokeWidth="0.75" pathLength={1} />
      <circle cx="200" cy="200" r="112" fill="none" stroke="currentColor" strokeWidth="0.75" pathLength={1} />
    </svg>
  );
}

export default function Manifiesto() {
  return (
    <section data-bg="#0a0e1c" data-manifiesto aria-label="Manifest" className="relative h-[240svh]">
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden px-6">
        <div className="pointer-events-none absolute top-1/2 left-1/2 size-[min(130vw,980px)] -translate-1/2 text-nieve/20">
          <Esfera />
        </div>
        <p className="sr-only">{frase}</p>
        <p
          data-words
          aria-hidden="true"
          className="relative max-w-5xl text-center font-display text-4xl leading-[1.02] font-medium tracking-[-0.045em] md:text-7xl"
        >
          {frase.split(' ').map((word, i) => (
            <Fragment key={i}>
              <span data-word className="word">
                {word}
              </span>{' '}
            </Fragment>
          ))}
        </p>
      </div>
    </section>
  );
}
