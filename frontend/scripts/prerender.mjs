import { readFile, writeFile } from 'node:fs/promises'
import { renderLanding } from '../.prerender/prerender.js'

const original = await readFile('dist/index.html', 'utf8')
const manifest = JSON.parse(await readFile('dist/.vite/manifest.json', 'utf8'))
const landing = manifest['src/pages/LandingPage.tsx']
const css = new Set(landing?.css ?? [])
const styles = [...css].map(path => `<link rel="stylesheet" href="/${path}">`).join('\n')
const html = original.replace('</head>', `${styles}\n</head>`).replace('<div id="root"></div>', `<div id="root" data-prerendered="true">${renderLanding()}</div>`)
if (!html.includes('把脑海里的故事，写成下一章。')) throw new Error('Landing prerender produced no expected content')
await writeFile('dist/landing.html', html)
console.log('Public landing prerendered; other routes retain the normal SPA entry.')
