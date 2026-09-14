# Alvise Leal — Portfolio

Personal portfolio site: a static [Astro](https://astro.build) site with Vue islands, a scroll-driven Three.js scene ([TresJS](https://tresjs.org)) and [GSAP](https://gsap.com) animations.

Live: https://portfolio-f7ag.onrender.com

## Stack

- Astro 7 (static output) + Vue 3 islands
- TresJS / three.js for the 3D hero model
- GSAP (ScrollTrigger, SplitText) + Lenis smooth scroll
- Tailwind CSS 4 (CSS-first config in `src/styles/global.css`)

## Development

Requires [bun](https://bun.sh) (version pinned in `.prototools`) and Node ≥ 22.12.

```sh
bun install
bun run dev       # http://localhost:4321
bun run check     # type-check .astro / .ts files
bun run build     # static build → dist/
bun run preview   # serve the build
```

## Content

- Experience entries live in `src/companies.yml`. Each key becomes a page at `/experience/<key>`.
- Skill logos are listed in `src/components/Skills.vue` (images in `public/logos/`).
- Home page copy is in `src/pages/index.astro`.

See [CLAUDE.md](CLAUDE.md) for architecture notes and gotchas.
