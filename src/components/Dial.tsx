import { escenas } from '../data/escenas';

// Indicador de progreso en forma de esfera: una marca por escena y una aguja que gira con el scroll.
export default function Dial() {
  const ticks = escenas.length;
  return (
    <div className="pointer-events-none absolute right-5 bottom-5 flex items-center gap-4 md:right-8 md:bottom-8">
      <div className="hidden text-right md:block">
        <p data-dial-count className="font-mono text-[11px] tracking-[0.25em] text-nieve/60 tabular-nums">
          01 / {String(ticks).padStart(2, '0')}
        </p>
        <p data-dial-label className="mt-1 font-mono text-sm tracking-wide">
          {escenas[0].lugar}
        </p>
      </div>
      <div className="relative size-14 rounded-full bg-noche/60 ring-1 ring-nieve/20 md:backdrop-blur-md md:size-16">
        <svg viewBox="0 0 64 64" className="absolute inset-0 size-full" aria-hidden="true">
          {Array.from({ length: ticks }, (_, i) => {
            const a = (i / ticks) * Math.PI * 2 - Math.PI / 2;
            return (
              <line
                key={i}
                x1={32 + Math.cos(a) * 24}
                y1={32 + Math.sin(a) * 24}
                x2={32 + Math.cos(a) * 28}
                y2={32 + Math.sin(a) * 28}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                className="text-nieve/50"
              />
            );
          })}
        </svg>
        <span data-dial-hand className="absolute inset-0 transition-none">
          <span className="absolute top-[18%] left-1/2 h-[34%] w-px -translate-x-1/2 rounded-full bg-akzent" />
        </span>
        <span className="absolute top-1/2 left-1/2 size-1.5 -translate-1/2 rounded-full bg-akzent" />
      </div>
    </div>
  );
}
