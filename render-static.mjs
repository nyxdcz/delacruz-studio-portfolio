import {runInNewContext} from 'node:vm';

export function renderStaticPage(source, projects, route, basePath) {
  const definitionsStart = source.indexOf('const featuredIds =');
  const definitionsEnd = source.indexOf('function imageFallbacks()');
  const escapeDefinition = source.split('\n').find(line => line.startsWith('const escapeHTML ='));
  if (definitionsStart < 0 || definitionsEnd < definitionsStart || !escapeDefinition) {
    throw new Error('Page renderer boundaries changed; update static rendering before building.');
  }
  const main = {innerHTML:''};
  const document = {
    title:'Dela Cruz Studio.',
    baseURI:`https://portfolio-build.invalid${basePath}`,
    body:{classList:{add(){}}},
    querySelector(){return {addEventListener(){}};}
  };
  const calls = {
    '':'renderHome(projects)',
    projects:'renderGallery(projects)',
    contact:'renderContact()',
    tool:'renderSoftware()',
    'tool/software':'renderSoftware()',
    '404':'renderNotFound()'
  };
  const projectRoute = /^projects\/(\d+)$/.exec(route);
  const call = projectRoute ? `renderProject(projects,${Number(projectRoute[1])})` : calls[route];
  if (!call) throw new Error(`Unknown static route: ${route}`);
  runInNewContext(`${escapeDefinition}\n${source.slice(definitionsStart,definitionsEnd)}\n${call};`,
    {main,document,projects,URL,email:'nyxdcz@gmail.com'}, {timeout:1000});
  const content = main.innerHTML
    .replaceAll('https://portfolio-build.invalid','');
  if (!content.includes('<h1')) throw new Error(`Static route has no heading: ${route}`);
  return {content,title:document.title};
}
