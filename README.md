# Lweb Interaktiv

Web nueva para vender **páginas web interactivas** en Suiza. Base técnica: Atelier Firn
(Next.js 16, GSAP, Lenis; recorrido por portales pintado en canvas, fluido en móvil).

```bash
npm run dev     # genera las escenas y arranca en http://localhost:3000
npm run build   # web estática en ./out
```

## Imágenes

1. Generarlas con ChatGPT siguiendo **PROMPTS.md**.
2. Guardarlas con su nombre exacto en `imagenes/hero`, `imagenes/branchen` o `imagenes/extra`.
3. `npm run escenas` (o `dev`/`build`) las pasa a WebP en `public/escenas`. Las que falten salen como provisionales.
4. Medir el portal de cada imagen real y ajustarlo en `src/data/escenas.ts` y `src/data/branchen.ts`.

## Estructura

- `src/components/PortalWorld.tsx`: hero con el recorrido (textos de cada parada).
- `src/components/Branchen.tsx`: "So könnte Ihre Branche aussehen", un mini portal por sector.
- `src/scripts/portal.ts`: motor del recorrido (canvas).
- `src/scripts/secciones.ts`: animaciones de las secciones.
