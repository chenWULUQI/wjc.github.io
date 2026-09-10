import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const dist = new URL('../dist/', import.meta.url);
const distPath = dist.pathname.replace(/^\/(.:)/, '$1');
const base = '/wjc.github.io/';
const failures = [];

function walk(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const expected = [
  'index.html', 'writing/index.html', 'tech/index.html', 'archive/index.html',
  'tags/index.html', 'about/index.html', '404.html', 'rss.xml',
  'sitemap-index.xml', 'robots.txt', 'og.png',
];
for (const path of expected) {
  if (!existsSync(join(distPath, path))) failures.push(`Missing ${path}`);
}

const files = walk(distPath);
const htmlFiles = files.filter((path) => path.endsWith('.html'));
const rootPathPattern = /(?:href|src)="(\/[^"#]*)"/g;

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  for (const [, url] of html.matchAll(rootPathPattern)) {
    if (!url.startsWith(base)) failures.push(`Wrong base path in ${file}: ${url}`);
    if (!url.startsWith(base)) continue;
    const clean = url.slice(base.length).split(/[?#]/)[0];
    let decoded;
    try { decoded = decodeURIComponent(clean); } catch { decoded = clean; }
    const target = decoded === ''
      ? join(distPath, 'index.html')
      : decoded.endsWith('/')
        ? join(distPath, decoded, 'index.html')
        : join(distPath, decoded);
    if (!existsSync(target)) failures.push(`Broken local link in ${file}: ${url}`);
  }
}

const techPost = readFileSync(join(distPath, 'posts/attention-and-kv-cache/index.html'), 'utf8');
for (const marker of ['katex-display', 'astro-code', '<table', 'data-footnote-ref']) {
  if (!techPost.includes(marker)) failures.push(`Technical Markdown marker missing: ${marker}`);
}

const searchableOutput = files
  .filter((path) => /\.(html|xml)$/.test(path))
  .map((path) => readFileSync(path, 'utf8'))
  .join('\n');
if (searchableOutput.includes('draft-example') || searchableOutput.includes('一篇尚未完成的文章')) {
  failures.push('Draft content leaked into production output');
}

const sitemap = readFileSync(join(distPath, 'sitemap-0.xml'), 'utf8');
const rss = readFileSync(join(distPath, 'rss.xml'), 'utf8');
if (!sitemap.includes('https://chenwuluqi.github.io/wjc.github.io/')) failures.push('Sitemap base URL is incorrect');
if (!rss.includes('https://chenwuluqi.github.io/wjc.github.io/posts/')) failures.push('RSS post URLs are incorrect');

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Verified ${htmlFiles.length} HTML pages and ${files.length} generated files.`);
console.log('Base paths, internal links, Markdown features, RSS, Sitemap, OG image, and draft exclusion are valid.');
