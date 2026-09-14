# Dependency Upgrade Plan

_Drafted 2026-09-13. Versions from `bun outdated` and the npm registry on that date._

**Order:** 0 clean install → 1 minor bumps → 2 SplitText refactor → 3 Astro 7 → 4 Spline decision → 5 TypeScript 7 (deferred).
The SplitText refactor goes before Astro 7 on purpose. It removes the one-`<span>`-per-word markup that Astro 7's whitespace rules would break, so Phase 3 needs no `compressHTML` or CSS workaround.

## Current state vs latest

| Package | Installed | Latest | Jump | Notes |
| --- | --- | --- | --- | --- |
| astro | 6.1.1 | **7.3.2** | major | Vite 8 (Rolldown), Rust compiler default, JSX whitespace rules. Needs Node ≥ 22.12 (`.nvmrc` 22.22.0 ✅). See Phase 3 |
| @astrojs/vue | 6.0.1 | **7.0.2** | major | Only breaking change is Vite 8. Peer: `astro ^7`, `vue ^3.5.24` |
| @rollup/plugin-yaml | 4.1.2 | **5.0.0** | major | Switched to hook filters (Rolldown/Vite 8 feature). Upgrade together with Astro 7 |
| @tresjs/core | 5.7.0 | 5.8.3 | minor | |
| @tresjs/cientos | 5.6.0 | 5.8.1 | minor | **Pins exact `@tresjs/core: 5.8.3`**, so bump both together |
| three | 0.170.0 (undeclared) | 0.186.0 | minor | Imported directly in `CoolStuff.vue` but missing from `package.json` |
| @types/three | 0.183.1 (undeclared) | 0.186.0 | — | Should match `three` |
| gsap | 3.14.2 | 3.15.0 | minor | Includes SplitText (free since 3.13). See Phase 2 |
| @studio-freight/lenis | 1.0.42 | — | **deprecated** | Renamed to `lenis` (1.3.26) |
| vue | 3.5.31 | 3.5.42 | patch | |
| tailwindcss / @tailwindcss/vite | 4.2.2 | 4.3.3 | minor | `@tailwindcss/vite` 4.3 supports Vite 8 |
| typescript | 6.0.2 | 6.0.3 / 7.0.2 | major | **Stay on 6.x**. See Phase 5 |
| @splinetool/runtime | 1.12.72 | 1.12.98 / 2.0.46 | major | Only used by `demo.astro` and the unused `Avatar.astro`. See Phase 4 |
| sass | 1.75.0 (undeclared) | 1.104.1 | minor | Used by `<style lang="scss">` but missing from `package.json` |

## ⚠️ Blocker found: `node_modules` is contaminated by an old pnpm install

`node_modules/.pnpm/` (707 packages from the pre-bun era) is still present. Several top-level entries are **junctions into that store**: `@tresjs/core`, `@astrojs/vue`, `sass`, plus the stale `@tresjs/leches`, `@astrojs/tailwind` and `@astrojs/check`. bun installed new versions *through* those junctions, so the files are new but the resolution context is old. The current build prints this:

```
"Timer" is not exported by ".pnpm/three@0.163.0/.../three.module.js",
imported by ".pnpm/@tresjs+core@4.0.2_three@0.163.0_.../@tresjs/core/dist/tres.js"
```

Tres 5 resolves `three` to pnpm's nested **0.163**, not the top-level 0.170. `sass` and `three` also only work because they happen to be left on disk.

## Phase 0: Clean baseline (do this first, on its own branch)

1. `git checkout -b chore/upgrade-deps`
2. Delete `node_modules/` completely, including `.pnpm`, and `node_modules/.vite`.
3. Declare the implicit deps: `bun add three && bun add -d sass @types/three`
4. Optional: upgrade bun (1.2.9 → current) and switch to the text lockfile (`bun install --save-text-lockfile`, then delete `bun.lockb`). Diffs become reviewable.
5. `bun install && bun run build`. The `Timer` warning should be gone.
6. Record a baseline: `bun run preview`, then take screenshots or a screen recording of the home page scroll (desktop and mobile widths) and one `/experience/*` page. Every later phase is compared against this baseline.

Commit: `chore: clean reinstall, declare three/sass`.

## Phase 1: Low-risk bumps within the same majors

```sh
bun add vue@^3.5.42 gsap@^3.15.0 tailwindcss@^4.3.3 three@^0.186.0 typescript@~6.0.3 \
        @tresjs/core@5.8.3 @tresjs/cientos@5.8.1
bun add -d @tailwindcss/vite@^4.3.3 @types/three@^0.186.0
```

**Lenis rename** (API is unchanged for this usage):
- `bun remove @studio-freight/lenis && bun add lenis`
- `src/pages/index.astro`: `import Lenis from '@studio-freight/lenis'` → `import Lenis from 'lenis'`
- Optionally replace the hand-copied Lenis rules at the bottom of `global.css` with `import 'lenis/dist/lenis.css'`.

**Small code fixes to make while you're in these files:**
- `CoolStuff.vue` and `Skills.vue` import `gsap/dist/ScrollTrigger` (UMD), while the `.astro` scripts import `gsap/ScrollTrigger` (ESM). These can load as two separate ScrollTrigger instances, and Lenis only drives `ScrollTrigger.update` on one of them. Switch both to `gsap/ScrollTrigger`.
- `CoolStuff.vue`: delete `import type { TresObject } from 'tresjs'`. The package doesn't exist and the import is unused.

Verify: build is clean. Compare against the baseline: model loads, halo rotation, camera moves per section, card pinning, per-word reveal, skills carousel rotation, smooth scroll.

Three.js jumps 16 minor versions (r170 → r186). Watch for lighting and color differences in the GLB model, since three changes light and color-management defaults from time to time. If the scene looks different, the directional light intensities in `CoolStuff.vue` are the knob to tune.

Commit: `chore: bump minor deps, migrate to lenis`.

## Phase 2: Replace manual word `<span>`s with GSAP SplitText

**Why:**
- **Duplicated copy.** Each text card in `index.astro` is written twice: a `.sr-only` sentence for screen readers, and an `aria-hidden` copy with one `<span>` per word for the reveal animation. The copies have already drifted apart. Card 2 says "various environment," in the sr-only text but "environments," in the spans.
- **Astro 7 would break it.** The one-span-per-line markup is exactly what Astro 7's whitespace rules break. Doing this first means Phase 3 needs no workaround for the cards.
- **No new dependency.** SplitText has shipped free inside `gsap` since 3.13. It's already available after Phase 1.

**1. Markup (`index.astro`).** Replace each card's pair of `<p>`s with a single paragraph. Keep the highlighted words as inline markup; SplitText preserves nested elements and splits the words inside them.

```astro
<Card title="" header="Who I am?">
  <p class="reveal">
    A Web Engineer with <span class="text-accent">5+ years</span> of experience developing <span class="text-primary">outstanding</span> interfaces and
    effective <span class="text-primary">solutions</span> through web technologies.
  </p>
</Card>
```

**Formatting rule that keeps this safe under Astro 7:** only wrap lines between two plain words, as in `and⏎effective` above. Never put a line break directly before or after an inline tag. Astro 7 follows JSX whitespace rules and drops a line break that touches a tag, so `developing⏎<span>outstanding</span>` would render as `developingoutstanding`. If a break has to go next to a tag, write the space explicitly as `{' '}`. Following this now means Phase 3 needs no changes here.

Also fix the sr-only/visible wording mismatches while merging (card 2 "environment(s)", card 1 "seamless" vs "effective").

**2. Script (`index.astro`).** Register the plugin and split inside `cardsAnimation()`, after the pin triggers are created, so ScrollTrigger measures pinned positions correctly:

```ts
import { SplitText } from 'gsap/SplitText'
gsap.registerPlugin(ScrollTrigger, SplitText)

// inside cards.forEach(card => …), replacing the setTimeout(…, 600) block
q('p.reveal').forEach((p: HTMLElement) => {
  SplitText.create(p, {
    type: 'words',
    tag: 'span',          // keep valid HTML inside <p> (default is <div>)
    wordsClass: 'word',
    autoSplit: true,      // re-splits once web fonts load
    onSplit: (self) =>    // returning the tween lets SplitText revert/rebuild it on re-split
      gsap.from(self.words, {
        opacity: 0.1,
        ease: 'none',
        stagger: 0.1,
        scrollTrigger: {
          trigger: p,
          start: 'clamp(top 60%)',
          end: () => `+=${self.words.length * 15}`, // same ~15px of scroll per word as today
          scrub: true,
        },
      }),
  })
})
```

Behaviour note: today every word gets its own ScrollTrigger with a timed 0.3s tween (`toggleActions: 'play none none reverse'`). The snippet above uses one scrubbed trigger per paragraph instead, which is lighter and smoother with Lenis. If you want the old timed feel, drop `scrub`, add `toggleActions`, and give it a `duration`.

**3. Accessibility.** With the default `aria: 'auto'`, SplitText puts `aria-label` on the `<p>` and `aria-hidden` on each word. `aria-label` on a plain paragraph isn't announced reliably by every screen reader, so test with NVDA or VoiceOver. If it doesn't read well, fall back to a visually hidden copy of the paragraph plus `aria: 'hidden'` on the split one. That's still one visual text block with no hand-written spans.

**4. Cleanup.**
- Remove the `.sr-only` duplicates and the `setTimeout(…, 600)` word-reveal block.
- Delete the commented-out `& span { … }` text-reveal CSS in `Card.astro`. Style `.card .word` instead if needed.
- Update the "How the home page animation fits together" section in `CLAUDE.md`.

**Verify:**
- Words reveal while scrolling and reverse on scroll-up.
- Line wrapping matches the baseline at desktop and mobile widths.
- Highlighted words keep their color.
- No layout shift when fonts load.
- Pinned cards still release at the same point.
- A screen reader reads each card as one sentence.

Commit: `refactor: use SplitText for card text reveal`.

## Phase 3: Astro 7 + @astrojs/vue 7 + Vite 8

```sh
bun add astro@^7.3.2 @astrojs/vue@^7.0.2
bun add -d @rollup/plugin-yaml@^5.0.0
```

Astro 7's own guide says most projects need no code changes. These are the parts that apply to this repo:

1. **Whitespace.** Astro 7 compresses HTML with JSX whitespace rules: a line break next to a tag is dropped, and spaces between inline elements on separate lines are stripped. The cards were already converted in Phase 2, so there's nothing to do for them. Keep the default and **don't** set `compressHTML: true`. Check the few remaining spots for joined words and fix them with `{' '}` or by moving the text onto one line:
   - `Navbar.astro`: `<span class="text-gradient short">Alvise</span> Leal` and `<span>&nbsp; Home</span>` in `[company].astro`
   - `Hero.astro`: `<span class="text-gradient short"> Frontend</span> expertise`
   - `Experience.astro` card text
2. **Rust compiler is stricter about invalid HTML.** Run the build and fix any errors it reports. Nothing obviously invalid was found in a read-through.
3. **CSS output can differ slightly.** Color values get re-serialized. Check the gradients (`.bg-cards`, `.text-gradient`, the conic border in `Experience.astro`) visually.
4. **Vite 8 / Rolldown.** No custom `vite.build` options exist, so there is nothing to migrate. Confirm that `companies.yml` still imports via plugin-yaml 5, that `lang="scss"` blocks compile, and that `@tailwindcss/vite` still processes `@reference` inside Astro `<style>` blocks (`[company].astro`).
5. **View transitions.** Only `<ClientRouter />` and `transition:name` are used, not the removed internals. Verify the card → experience page morph.
6. The existing ">500 kB chunk" warning comes from three.js. It's fine to leave. Optionally lazy-load `TheCanvas` later.

Commit: `chore: upgrade to Astro 7`.

## Phase 4: Spline runtime — ✅ done (option A: removed)

`@splinetool/runtime` 2.0 shipped on 2026-08-20 with no public migration notes and about 40 patch releases in three weeks, so it isn't stable yet. It's only used by `demo.astro`, an unlinked experiment with debug `markers: true`, and `Avatar.astro`, which is unused. Options:
- **A (recommended):** delete `demo.astro`, `Avatar.astro`, `Preloader.astro`, and the dependency. This also removes a large chunk from the build.
- **B:** bump within 1.x (`@splinetool/runtime@^1.12.98`) and revisit 2.x once it settles.

## Phase 5: Deferred — TypeScript 7

TS 7 (Go-native, GA 2026-07-08) has **no programmatic compiler API until 7.1**, and Volar, vue-tsc and Astro's language tooling depend on that API. Stay on `typescript@~6.0.3` and revisit when TS 7.1 is released and Astro/Volar announce support. The build itself doesn't type-check, so there's no urgency.

## Optional cleanup — ✅ done (also removed unused public/ images and icons; 3D models kept)

- Delete `tailwind.config.mjs`. Tailwind v4 doesn't load it without `@config`.
- Delete `src/outdated/`.
- Add `@astrojs/check` and a `"check": "astro check"` script (on TS 6) to catch template type errors.
- Replace the Astro starter README with a real one.

## Verification checklist (run after every phase)

- [ ] `bun run build` passes with no new warnings
- [ ] Home, desktop (>800px): hero intro, 3D model fades in, camera moves through 4 sections, halo spins, cards pin and words reveal, background gradient changes per section
- [ ] Home, mobile (<768px): canvas hidden, cards pin with the mobile trigger line, drawer menu toggles
- [ ] Skills carousel rotates and spreads while scrubbing; tooltips show on hover
- [ ] Experience cards: conic border animates, hover tilt, click morphs into `/experience/<id>` (view transition)
- [ ] `/experience/nike|gitlab|citelis|clout` render with correct colors and bullet HTML
- [ ] No words run together (Hero, Navbar, cards, experience pages)
- [ ] Lenis smooth scroll stays in sync with pinned sections (no jitter)
