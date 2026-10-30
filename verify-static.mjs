import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {join} from 'node:path';
const output=process.argv[2]||'dist';
const configuredBase='/' + (process.env.SITE_BASE_PATH||'').split('/').filter(Boolean).join('/') + '/';
const base=process.argv[3]||(configuredBase==='//'?'/':configuredBase);
const projects=JSON.parse(await readFile('dist/projects.json','utf8'));
const routes=['','contact','tool','tool/software','projects',...projects.map(p=>`projects/${p.id}`)];
await access(join(output,'assets/studio-grain.svg'));
await access(join(output,'studio.css'));
const touchIcon=await readFile(join(output,'apple-touch-icon.png'));
assert.equal(touchIcon.subarray(0,8).toString('hex'),'89504e470d0a1a0a','Home Screen icon must be a PNG');
assert.equal(touchIcon.readUInt32BE(16),180,'Home Screen icon must be 180 px wide');
assert.equal(touchIcon.readUInt32BE(20),180,'Home Screen icon must be 180 px tall');
function verifyTouchIcon(html,route){
  const icon=html.match(/<link\s+rel="apple-touch-icon"\s+sizes="180x180"\s+href="([^"]+)"\s*>/);
  assert(icon,`${route}: Apple Home Screen icon declaration missing`);
  assert.equal(new URL(icon[1],`https://portfolio.invalid${base}`).pathname,`${base}apple-touch-icon.png`,`${route}: Home Screen icon points outside the site base`);
}
for(const route of routes){
  const html=await readFile(join(output,route,'index.html'),'utf8');
  verifyTouchIcon(html,route);
  assert(html.includes('href="studio.css?v=continuous-grain-2"'),`${route}: studio styling missing`);
  assert(html.includes('aria-label="Footer pages"')&&html.includes('aria-label="Social profiles"'),`${route}: footer groups missing`);
  const main=html.match(/<main[^>]*>([\s\S]*?)<\/main>/)?.[1];
  assert(main?.includes('<h1'),`${route}: content absent from delivered HTML`);
  assert(!main.includes('Loading the portfolio'),`${route}: loading shell delivered`);
  assert(html.includes(`<base href="${base}">`),`${route}: incorrect base`);
  assert(!html.includes('portfolio-build.invalid'),`${route}: build origin leaked`);
  assert(!html.includes(`${base}${base.slice(1)}`)||base==='/',`${route}: duplicated prefix`);
  for(const match of html.matchAll(/(?:href|src)="(\/[^"#?]*)[^\"]*"/g)){
    const value=match[1];assert(value.startsWith(base),`${route}: unprefixed local destination ${value}`);
    const relative=value.slice(base.length);
    if(relative&&!relative.endsWith('/'))await access(join(output,relative));
  }
  if(route==='projects')assert.equal((main.match(/class="editorial-project"/g)||[]).length,12,'gallery must contain all projects');
  if(route===''||route==='contact'){
    assert(main.includes('type="email"')&&main.includes('name="message"'),'inquiry fields missing');
    assert(main.includes('class="studio-email-bar"')&&main.includes('mailto:nyxdcz@gmail.com'),'visible contact email missing');
    assert(main.includes('aria-label="Copy email address"'),'email copy control missing');
    assert(main.includes('name="location"'),'project location field missing');
    assert(html.includes('.menu-toggle,.studio-inquiry,.studio-email-bar button{display:none}'),'no-script actions must not run without handlers');
    assert(main.includes('Open email draft'),'inquiry must explain email-draft action');
  }
  if(route.startsWith('projects/'))assert(main.includes('class="detail-image"'),'case study image absent');
}
verifyTouchIcon(await readFile(join(output,'404.html'),'utf8'),'404');
console.log(`Verified static content, route destinations, assets and inquiry fallback across ${routes.length} pages at ${base}.`);
