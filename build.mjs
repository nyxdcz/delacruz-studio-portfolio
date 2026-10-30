import {readFile, writeFile, mkdir, access, cp} from 'node:fs/promises';
import {join} from 'node:path';
import {renderStaticPage} from './render-static.mjs';

const projects = JSON.parse(await readFile('dist/projects.json', 'utf8'));
const html = await readFile('dist/index.html', 'utf8');
const rendererSource = await readFile('dist/app.js', 'utf8');
const output = process.env.SITE_OUTPUT_DIR || 'dist';
const basePath = '/' + (process.env.SITE_BASE_PATH || '').split('/').filter(Boolean).join('/') + '/';
const normalizedBase = basePath === '//' ? '/' : basePath;
if (!/^\/[a-zA-Z0-9_./-]*$/.test(normalizedBase) || normalizedBase.includes('..')) throw new Error('Invalid site base path');
const pageHTML = html.replace('<base href="/">', `<base href="${normalizedBase}">`);
if (output !== 'dist') await cp('dist', output, {recursive:true});
await cp('licenses',join(output,'licenses'),{recursive:true});
function routeHTML(route) {
  const rendered = renderStaticPage(rendererSource, projects, route, normalizedBase);
  return pageHTML.replace(/<main id="main" tabindex="-1">[\s\S]*?<\/main>/, () => `<main id="main" tabindex="-1">${rendered.content}</main>`)
    .replace(/<title>[\s\S]*?<\/title>/, () => `<title>${rendered.title.replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}</title>`)
    .replace(/(href|src)="(\/(?!\/)[^"]*)"/g, (_, attribute, value) => `${attribute}="${value.startsWith(normalizedBase) ? value : normalizedBase + value.slice(1)}"`);
}
await writeFile(join(output, 'index.html'), routeHTML(''));
const routes = ['contact', 'tool', 'tool/software', 'projects', ...projects.map(p => `projects/${p.id}`)];
for (const route of routes) {
  const folder = join(output, route);
  await mkdir(folder, {recursive:true});
  await writeFile(join(folder, 'index.html'), routeHTML(route));
}
await writeFile(join(output, '404.html'), routeHTML('404'));
await writeFile(join(output, '.nojekyll'), '');
await writeFile(join(output, '_headers'), '/assets/*\n  Cache-Control: public, max-age=86400\n/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n');
await access(join(output, 'apple-touch-icon.png'));
for (const p of projects) {
  await access(join(output, p.image));
  for (const width of [680,1280]) await access(join(output,'assets',`project-${p.id}-${width}.jpg`));
}
for (const name of ['logo.png','favicon-dark.png','favicon-light.png','portrait.png','portrait-preview.png','tools-1.png','tools-2.png','montreal-regular.woff2','montreal-medium.woff2','montreal-bold.woff2','inter-display-regular.woff2','inter-display-medium.woff2','martian-mono.woff2']) await access(join(output,'assets',name));
console.log(`Prepared ${routes.length + 1} pages at ${normalizedBase} in ${output} and verified all portfolio assets.`);
