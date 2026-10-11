const palabras = ['Staunen', 'Eintauchen', 'Erinnern', 'Weiterempfehlen', 'Swiss made', 'Von Hand programmiert'];

function Fila({ invertida = false }: { invertida?: boolean }) {
  const items = [...palabras, ...palabras];
  return (
    <div data-cinta-fila data-invertida={invertida ? '' : undefined} className="flex w-max items-center whitespace-nowrap will-change-transform">
      {[0, 1].map((copia) => (
        <div key={copia} className="flex items-center" aria-hidden={copia === 1 ? 'true' : undefined}>
          {items.map((p, i) => (
            <span key={i} className="flex items-center">
              <span className={(i + (invertida ? 1 : 0)) % 2 ? 'text-transparent [-webkit-text-stroke:1px_var(--color-nieve)]' : ''}>{p}</span>
              <span className="mx-8 size-3 rounded-full bg-akzent shadow-[0_0_14px_rgba(242,180,109,0.8)] md:mx-12" />
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

// Cinta: dos filas en bucle que aceleran y se inclinan con la velocidad del scroll.
export default function Cinta() {
  return (
    <section data-bg="#0c0a14" data-cinta aria-label="Was eine interaktive Website auslöst" className="overflow-hidden py-24 font-display text-6xl font-medium tracking-[-0.05em] md:py-32 md:text-9xl">
      <div className="flex flex-col gap-4 md:gap-6">
        <Fila />
        <Fila invertida />
      </div>
    </section>
  );
}
