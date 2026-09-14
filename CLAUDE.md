# CLAUDE.md

Personal portfolio site for Alvise Leal — a static Astro site with Vue islands, a scroll-driven Three.js scene (TresJS), and GSAP/ScrollTrigger animations. Deployed as static output (`dist/`) at https://portfolio-f7ag.onrender.com.

## Commands

Package manager is **bun** (`bun.lockb`). Node version is pinned in `.nvmrc`.

```sh
bun install
bun run dev       # astro dev → http://localhost:4321
bun run build     # static build → dist/
bun run preview   # serve dist/
```

There are no tests, linter, or `astro check` set up. `bun run build` is the only automated verification — animations and the 3D scene must be checked manually in the browser.

Formatting follows `.prettierrc.json`: no semicolons, single quotes, 2-space indent, `printWidth: 140`, `trailingComma: es5`.

## Stack

- **Astro 6** (`output: static`) — `astro.config.mjs` registers `@astrojs/vue` plus two Vite plugins: `@tailwindcss/vite` and `@rollup/plugin-yaml`.
- **Vue 3** for interactive islands (`.vue` files in `src/components/`).
- **TresJS 5** (`@tresjs/core` + `@tresjs/cientos`) on top of **three**, for the hero 3D model.
- **GSAP 3** + ScrollTrigger for all animation; **Lenis** (`lenis`) for smooth scroll, synced to ScrollTrigger in `index.astro` (its CSS comes from `lenis/dist/lenis.css`).
- **Tailwind CSS 4**, CSS-first config in `src/styles/global.css` (`@theme` block). `tailwind.config.mjs` is a leftover from v3 and is **not** loaded.
- **Sass** is used via `<style lang="scss">` in several components.
- `@splinetool/runtime` is only used by `src/pages/demo.astro` and the unused `Avatar.astro`.

## Layout

```
src/
  layouts/Layout.astro        # <head> meta/OG tags, <ClientRouter /> (view transitions), Navbar, global.css
  pages/
    index.astro               # home: Hero → TheCanvas → 3 text Cards → Skills carousel → Experience grid
    experience/[company].astro# one static page per key in companies.yml (getStaticPaths)
    demo.astro                # Spline scene experiment (not linked from nav)
  components/
    Hero.astro                # intro text + CSS blob background, GSAP intro/scroll timelines
    Card.astro                # text section wrapper (is:global styles for .card)
    TheCanvas.vue             # TresCanvas wrapper; only renders when window width > 768px
    CoolStuff.vue             # scene contents: loads /models/alterado.glb, camera path per [data-model] section
    Skills.vue                # 3D CSS carousel of skill logos, driven by ScrollTrigger CSS vars
    Experience.astro          # company cards linking to /experience/<id>
    Items.vue                 # renders company bullet items with v-html
    Navbar.astro              # fixed nav + mobile drawer (vanilla script)
    Preloader*.astro, Avatar.astro  # currently unused (commented out)
  companies.yml               # experience data — the single source for Experience.astro and [company].astro
  types.ts                    # Company type
  styles/global.css           # Tailwind import, @theme tokens, CSS vars, .text-gradient
  outdated/                   # dead code, not routed
public/                       # images, logos/, models/ (.glb/.gltf)
```

## How the home page animation fits together

These pieces are coupled through the DOM, so read them together before changing any of them:

- `index.astro`'s `<script>` sets up Lenis ↔ ScrollTrigger sync, the fixed `.bg-cards` background gradient that changes per `section:not(.hero)`, card pinning via `gsap.matchMedia()` (breakpoint 800px), and a per-word opacity reveal on `.card p > span`.
- Each text card's words are wrapped in individual `<span>`s inside an `aria-hidden` `<p>`, with the full sentence duplicated in a `.sr-only` `<p>` for screen readers. Keep both in sync when editing copy.
- `CoolStuff.vue` collects every `[data-model]` element on mount and builds one scrubbed camera timeline per element, indexed into its `cameras` / `looktAts` arrays. **The number of `[data-model]` elements in `index.astro` must match those arrays (currently 4 used of 5).** The optional `data-end-mark` attribute overrides the ScrollTrigger end.
- `CoolStuff.vue` animates GLTF nodes by name (`nimbus001–003`, `lentes`, `busto`); renaming nodes in the model breaks the animation.
- The canvas starts at `opacity: 0` and is revealed by GSAP once the model loads.
- Several animations are deferred with `setTimeout` (Skills 800ms, cards 600ms after `window.onload`) so pinned sections measure correctly after layout settles. Removing them tends to cause mis-positioned pins.

## Conventions and gotchas

- Colors: Tailwind tokens (`text-primary`, `text-accent`, `bg-background`, …) come from `@theme` in `global.css`; plain CSS uses the matching `--primary` / `--accent` vars defined in `:root` there. Update both when changing the palette.
- Custom breakpoints are non-standard (`md` = 728px, `lg` = 984px, etc.), defined in `@theme`.
- Astro `<style>` blocks that use `@apply` need `@reference '../../styles/global.css';` (Tailwind v4).
- `companies.yml` is imported as a module via `@rollup/plugin-yaml`; its type declaration lives in `src/env.d.ts`. Items can contain inline HTML (`<strong>`, `<b>`, `<br/>`), rendered with `v-html`.
- View transitions: `transition:name` values (`hero-<id>`, `title-<id>`, `period-<id>`) link `Experience.astro` cards to `[company].astro`.
- Always import GSAP plugins from `gsap/<Plugin>` (e.g. `gsap/ScrollTrigger`), never `gsap/dist/...`. The dist (UMD) build is a separate ScrollTrigger instance, and Lenis only drives `ScrollTrigger.update` on the ESM one.
- `@tresjs/core` and `@tresjs/cientos` are pinned to exact versions because cientos requires an exact core version. Bump them together.
