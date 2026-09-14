// Drives the portfolio in headless Chrome/Edge against a running dev (or preview) server.
//
// Flow: load / -> wheel-scroll the whole page -> click the Nike experience card (view
// transition) -> scroll -> "Home" link back -> scroll up -> load /experience/nike directly.
// Prints every console warning/error, page error and failed request, checks that the
// home animations are rebuilt after navigating back, and exits 1 if anything is wrong.
//
// usage (from the repo root):
//   node .claude/skills/run-portfolio/driver.mjs [baseUrl] [--out <dir>] [--quick] [--width N] [--height N]
//     baseUrl   default: the URL `bun x astro dev status` reports, else http://localhost:4321
//     --out     screenshot dir, default <os tmp>/run-portfolio-shots
//     --quick   only load / and take one screenshot
//   env CHROME_PATH  browser executable to use instead of auto-detection
import { chromium } from 'playwright-core'
import { execSync } from 'node:child_process'
import { existsSync, mkdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const args = process.argv.slice(2)
const flag = (name, fallback) => {
  const i = args.indexOf(name)
  return i === -1 ? fallback : args[i + 1]
}
// Astro 7 runs ONE dev server per project and ignores --port when one is already up,
// so ask it where it is instead of assuming a port.
const detectDevUrl = () => {
  try {
    const status = execSync('bun x astro dev status', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
    return status.match(/running at (https?:\/\/[^\s"(]+)/)?.[1]
  } catch {
    return undefined
  }
}
const base = (args.find((a) => /^https?:\/\//.test(a)) ?? detectDevUrl() ?? 'http://localhost:4321').replace(/\/$/, '')
const out = flag('--out', join(tmpdir(), 'run-portfolio-shots'))
const quick = args.includes('--quick')
// >768px or TheCanvas renders nothing; >=800px for the desktop card pinning
const viewport = { width: Number(flag('--width', 1440)), height: Number(flag('--height', 900)) }
mkdirSync(out, { recursive: true })

const browserPath = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', // verified
  // Edge (msedge.exe) crashed on launch under playwright-core here, so it's not auto-picked
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].find((p) => p && existsSync(p))
if (!browserPath) {
  console.error('No Chrome found. Install Google Chrome or set CHROME_PATH to a Chromium-based browser executable.')
  process.exit(2)
}

// the dev server daemonizes and returns before it listens: wait for it here
for (const deadline = Date.now() + 60000; ; ) {
  try {
    await fetch(base + '/')
    break
  } catch {
    if (Date.now() > deadline) {
      console.error(`Nothing is serving ${base} after 60s. Start the dev server first (see SKILL.md).`)
      process.exit(2)
    }
    await new Promise((r) => setTimeout(r, 500))
  }
}

const browser = await chromium.launch({
  executablePath: browserPath,
  headless: true,
  // software WebGL so the Tres canvas renders without a GPU
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
})
const page = await (await browser.newContext({ viewport })).newPage()

let step = 'init'
const logs = []
const problems = []
page.on('console', (m) => logs.push({ step, type: m.type(), text: m.text() }))
page.on('pageerror', (e) => logs.push({ step, type: 'pageerror', text: e.stack || e.message }))
page.on('requestfailed', (r) => logs.push({ step, type: 'requestfailed', text: `${r.url()} ${r.failure()?.errorText}` }))

const settle = (ms) => page.waitForTimeout(ms)
let shotNo = 1
const shot = async (name) => {
  const file = join(out, `${String(shotNo++).padStart(2, '0')}-${name}.png`)
  await page.screenshot({ path: file })
  console.log('screenshot', file)
}
// Lenis owns scrolling: use real wheel events, not window.scrollTo
const wheel = async (times, dy) => {
  for (let i = 0; i < times; i++) {
    await page.mouse.wheel(0, dy)
    await settle(120)
  }
}
const homeState = () =>
  page.evaluate(() => ({
    words: document.querySelectorAll('.card .word').length, // SplitText output
    pinSpacers: document.querySelectorAll('.pin-spacer').length, // 3 cards + skills carousel
    canvas: !!document.querySelector('canvas#mycanvas'),
  }))

console.log(`driving ${base} with ${browserPath} at ${viewport.width}x${viewport.height}`)

step = 'home:load'
await page.goto(base + '/', { waitUntil: 'load', timeout: 90000 }) // first dev load compiles on demand
await settle(4000) // GLB load + deferred animation setup (setTimeouts up to 800ms)
await shot('home-top')
const first = await homeState()
console.log('home on first load', JSON.stringify(first))
if (!first.words) problems.push('SplitText did not split the card copy (.card .word missing)')

if (!quick) {
  step = 'home:scroll'
  const total = await page.evaluate(() => document.documentElement.scrollHeight)
  const steps = Math.ceil(total / 300)
  for (let i = 0; i < steps; i++) {
    await wheel(1, 300)
    if (i % 12 === 11) await shot('home-scroll')
  }
  await settle(1500)
  await shot('home-bottom')

  step = 'nav:card-click'
  await page.locator('a[href="/experience/nike"]').first().click()
  await page.waitForURL('**/experience/nike', { timeout: 30000 })
  await settle(2000)
  await shot('nike-via-click')

  step = 'nike:scroll' // stale home ScrollTriggers would throw here
  await wheel(6, 300)
  await settle(800)

  step = 'nav:back-home'
  await page.locator('a[href="/#experience"]').first().click()
  await page.waitForURL((u) => u.pathname === '/', { timeout: 30000 })
  await settle(3000)
  await shot('home-returned')
  const back = await homeState()
  console.log('home after return', JSON.stringify(back))
  if (back.words !== first.words || back.pinSpacers !== first.pinSpacers)
    problems.push(`home animations not rebuilt after navigating back: ${JSON.stringify(first)} -> ${JSON.stringify(back)}`)

  step = 'home:scroll-up'
  await wheel(26, -300)
  await shot('home-returned-cards')

  step = 'nike:load'
  await page.goto(base + '/experience/nike', { waitUntil: 'load', timeout: 60000 })
  await settle(2000)
  await shot('nike-direct')
}

await browser.close()

// report: warnings/errors deduped; plain log/debug/info (Vite, astro) are noise
const bad = logs.filter((l) => !['log', 'debug', 'info'].includes(l.type))
const seen = new Map()
for (const l of bad) {
  const key = `${l.type}|${l.text.split('\n')[0]}`
  seen.set(key, { ...l, times: (seen.get(key)?.times ?? 0) + 1 })
}
for (const l of seen.values()) console.log(`\n[${l.type}] (${l.step}) x${l.times}\n${l.text.slice(0, 1500)}`)
for (const p of problems) console.log(`\n[check] ${p}`)
console.log(`\nRESULT ${bad.length} console warnings/errors, ${problems.length} failed checks. Screenshots: ${out}`)
process.exit(bad.length || problems.length ? 1 : 0)
