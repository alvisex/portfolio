---
name: run-portfolio
description: Start, build, and drive the Alvise Leal portfolio site (Astro 7 + Vue + TresJS + GSAP). Use when asked to run or start the dev server, open or screenshot the site, check the browser console for Vue/GSAP warnings or errors, verify scroll animations or page transitions, type-check, or build it.
---

Static Astro site. To drive it, start the Astro dev server, then run `.claude/skills/run-portfolio/driver.mjs`. It's a `playwright-core` script that controls your **locally installed Chrome** headless. It scrolls the page with real wheel events, clicks through a view transition and back, saves screenshots, and exits non-zero on any console warning or error.

All paths are relative to the repo root. Verified on Windows 10 (Git Bash) with bun 1.4.2, Node 24.19, and Google Chrome.

## Prerequisites

- **bun**, the version pinned in `.prototools`. With proto: `proto install bun 1.4.2`.
- **Node ≥ 22.12**, which Astro 7 requires. Node isn't pinned in the repo.
- **Google Chrome** installed. The driver uses it directly; no Playwright browser download is needed.

## Setup

```bash
bun install
```

`playwright-core` is a devDependency, so `bun install` is all the driver needs.

## Run (agent path)

```bash
bun x astro dev > /dev/null 2>&1   # starts the dev server in the background; no-op if one is already running
bun x astro dev status              # -> "Dev server running at http://localhost:4321 (pid …)"
node .claude/skills/run-portfolio/driver.mjs           # full flow, ~1–2 min
node .claude/skills/run-portfolio/driver.mjs --quick   # load / + one screenshot
node .claude/skills/run-portfolio/driver.mjs --quick --width 600 --height 900 --out "$TEMP/run-portfolio-mobile"   # phone width
```

The driver finds the dev server URL through `astro dev status`, and waits up to 60s for it to respond. Pass a URL as the first argument to target something else, such as `bun run preview`.

**Full flow:**

| step | what it checks |
|---|---|
| load `/`, wait 4s | 3D model loads; records `.card .word` (SplitText) and `.pin-spacer` counts |
| wheel-scroll to the bottom | card pins, word reveal, Skills carousel, background gradients |
| click the Nike experience card | `ClientRouter` view transition to `/experience/nike` |
| scroll the experience page | stale home-page ScrollTriggers would throw here |
| click "Home" (`/#experience`) | returning home rebuilds the animations (word/pin counts must match the first load) |
| scroll back up, then load `/experience/nike` directly | direct page load |

**Output:**
- `home on first load {"words":56,"pinSpacers":4,"canvas":true}`
- every screenshot path
- each unique `[warning]` / `[error]` / `[pageerror]` / `[requestfailed]` with its step, then `RESULT n console warnings/errors, n failed checks`

**Exit codes:** 0 = clean, 1 = console problems or failed checks, 2 = no browser or no server.

**Screenshots** go to `$TEMP/run-portfolio-shots/` (on Windows, `%LOCALAPPDATA%\Temp\run-portfolio-shots`), numbered `01-home-top.png` … `09-nike-direct.png`. **Open them.** A clean console doesn't prove the scene rendered.

| option | meaning |
|---|---|
| `<url>` | base URL (default: from `astro dev status`, else `http://localhost:4321`) |
| `--quick` | only load `/` and take one screenshot |
| `--width N` / `--height N` | viewport, default 1440×900 |
| `--out <dir>` | screenshot directory |
| env `CHROME_PATH` | browser executable to use instead of Chrome |

Stop the server when you're done, **but only if you started it**:

```bash
bun x astro dev stop
```

## Run (human path)

```bash
bun run dev   # -> http://localhost:4321, runs in the background; stop with `bun x astro dev stop`
```

## Test

There's no test suite. These two are the automated checks:

```bash
bun run check   # astro check: expect 0 errors, 0 warnings, 0 hints
bun run build   # expect "5 page(s) built"; the only warning is the three.js chunk-size one
```

## Gotchas

- **Astro 7's dev server is one background process per project.**
  - `astro dev` returns right away; the server keeps running.
  - A second `astro dev --port 4400` does **not** start another server. It keeps the existing one (usually on 4321) and exits 0. Always read the URL from `astro dev status`, as the driver does.
  - `astro dev stop` stops *that* server, even if a human started it.
- **Never pipe `astro dev`'s output.** For example `bun run dev | Out-String` in PowerShell, or `$(bun run dev)`: the background server inherits the pipe, so the command never returns. Redirect to `/dev/null` instead.
- **Viewport matters.** `TheCanvas` renders only when the window is wider than 768px, and only checks on mount. Below that, `canvas:false` is expected. Card pinning switches between its desktop and mobile trigger at 800px.
- **Headless WebGL** needs the SwiftShader flags already in the driver. The first dev load compiles on demand and the GLB takes a few seconds, hence the 4s wait.
- **Lenis owns scrolling.** Drive it with `page.mouse.wheel`, not `window.scrollTo`.
- **Mid-scroll screenshots** can show the page shifted, with a dark band at the top or bottom. So far this has only been seen in headless captures during Lenis scrolling.
- **Edge crashed on launch** under `playwright-core` (exit code 789986, no error message), so the driver doesn't pick it. Use Chrome.
- **Page scripts run only once** because of `ClientRouter` view transitions. Home-page animations have to be built on `astro:page-load` and torn down on `astro:before-swap` (see CLAUDE.md). The driver's back-navigation check catches regressions here.

## Troubleshooting

- **`[Vue warn]: Failed to resolve component: TresPerspectiveCamera`** (also `TresAmbientLight`, `TresDirectionalLight`, `primitive`): the Vue integration in `astro.config.mjs` lost Tres's `templateCompilerOptions`.
- **`TypeError: Cannot read properties of null (reading 'lookAt')`** or **`GSAP target .bg-cards not found`** after clicking an experience card: some GSAP work isn't torn down on page transitions. Put it in a `gsap.context()` reverted in `onUnmounted`, or in the `astro:before-swap` teardown in `index.astro`.
- **`Nothing is serving http://localhost:4400 after 60s`**: you passed a port the dev server isn't on. Run `bun x astro dev status`.
- **Build fails with `MagicString is not a constructor`** (inside `@vue/compiler-sfc`) after several `bun add`s: bun left a stray nested package. Delete `node_modules` and run `bun install`.
- **Build fails with `[postcss] ENOENT … Portfolio\tailwindcss`**: a component style block `@import`s `global.css`. Remove that import.
