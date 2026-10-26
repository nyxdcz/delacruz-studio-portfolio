const main = document.querySelector('main');
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
const email = 'nyxdcz@gmail.com';
const siteBase = new URL(document.baseURI).pathname;
const relativePath = location.pathname.startsWith(siteBase) ? '/' + location.pathname.slice(siteBase.length) : location.pathname;
const path = relativePath.replace(/\/+$/, '') || '/';
const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function resolveSitePaths(root) {
  root.querySelectorAll('a[href],img[src]').forEach(element => {
    const attribute = element.tagName === 'IMG' ? 'src' : 'href';
    const value = element.getAttribute(attribute);
    if (value.startsWith('#')) element.setAttribute(attribute, location.pathname + value);
    else if (siteBase !== '/' && value.startsWith('/') && !value.startsWith('//') && !value.startsWith(siteBase)) {
      element.setAttribute(attribute, siteBase + value.slice(1));
    }
  });
}
resolveSitePaths(document);

function closeMenu(returnFocus = false) {
  nav.classList.remove('is-open');
  menu.setAttribute('aria-expanded', 'false');
  menu.innerHTML = 'Menu <span aria-hidden="true">☰</span>';
  if (returnFocus) menu.focus();
}
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') === 'false';
  nav.classList.toggle('is-open', open);
  menu.setAttribute('aria-expanded', String(open));
  menu.innerHTML = open ? 'Close <span aria-hidden="true">×</span>' : 'Menu <span aria-hidden="true">☰</span>';
});
nav.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') closeMenu(true); });
document.addEventListener('click', e => { if (!nav.contains(e.target) && !menu.contains(e.target)) closeMenu(); });

const featuredIds = [1, 8, 11, 4];
const displayTitles = {1:'MSG Farm',8:'Wrap Technologies Inc.',11:'Bañas Residence',4:'Verde Plant-Based Café & Resto'};
const displayTypes = {'MASTER PLAN':'Master planning','LANDSCAPING':'Landscape design','RESIDENTIAL':'Residential design','INTERIOR':'Interior design','RENOVATION':'Renovation','BRAND IDENTITY':'Brand identity'};
const services = [
  {title:'Architectural design',focus:'Concept & planning',description:'Concept development, spatial planning, and presentation drawings for residential and commercial projects.',project:11},
  {title:'Landscape design',focus:'Site & planting',description:'Site planning, planting design, and outdoor spaces that respond to their surroundings.',project:8},
  {title:'Interior design',focus:'Space & materials',description:'Space planning, material choices, and design proposals for homes and hospitality spaces.',project:4},
  {title:'3D visualization',focus:'Modeling & rendering',description:'3D modeling and photorealistic renderings to communicate the design before it is built.',project:1}
];

function cardImage(project, priority = false) {
  return `<img src="${new URL(`assets/project-${project.id}-680.jpg`,document.baseURI).href}" srcset="assets/project-${project.id}-680.jpg 680w, assets/project-${project.id}-1280.jpg 1280w" sizes="(min-width: 1440px) 658px, (min-width: 701px) calc((100vw - 124px) / 2), calc(100vw - 44px)" alt="${escapeHTML(project.title)} design visualization" width="680" height="486" ${priority ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}

function projectCards(projects, priority = false) {
  if (!projects.length) return '<p class="empty-state">No projects have been added yet. <a href="/contact/">Contact nyco about your project.</a></p>';
  return `<div class="editorial-project-grid">${projects.map((p,index) => `<a class="editorial-project" href="/projects/${p.id}/" aria-label="View ${escapeHTML(p.title)}"><div class="editorial-project-photo">${cardImage(p,priority && index<2)}</div><div class="editorial-project-caption"><p class="project-category"><span class="project-index">${String(p.id).padStart(3,'0')}</span> ${escapeHTML(displayTypes[p.type] || p.type)} · ${escapeHTML(p.year)}</p><h3>${escapeHTML(displayTitles[p.id] || p.title)} <span aria-hidden="true">↗</span></h3><p class="project-place">${escapeHTML(p.location.replace(', PHILIPPINES',''))}</p></div></a>`).join('')}</div>`;
}

function renderHome(projects) {
  document.body.classList.add('home-page');
  const featured = featuredIds.map(id=>projects.find(p=>p.id===id)).filter(Boolean);
  main.innerHTML = `<section class="home-intro editorial-shell" id="intro"><div class="home-intro-copy"><p class="eyebrow">Hi, I’m nyco · Palawan, Philippines</p><h1><span>Architectural &amp;</span><span>landscape design.</span><span>Clearly visualized.</span></h1><p class="home-intro-description">From site planning and interiors to detailed 3D visualization, I help turn your ideas into clear, thoughtful designs.</p><div class="home-intro-actions"><a class="button solid" href="/#work">View Projects <span aria-hidden="true">↓</span></a><a class="editorial-text-link" href="/#contact">Discuss a Project</a></div></div><figure class="home-portrait"><img src="${new URL('assets/portrait-preview.png',document.baseURI).href}" srcset="assets/portrait-preview.png 392w, assets/portrait.png 904w" sizes="(min-width: 1435px) 330px, (min-width: 957px) 23vw, (min-width: 800px) 220px, 1px" alt="nyco, architectural and landscape designer" width="392" height="650"></figure></section>
  <section class="home-work editorial-shell" id="work"><div class="editorial-heading"><div><p class="eyebrow">Selected Work</p><h2>A few projects<br>I’ve shaped.</h2></div><span class="section-index">[${String(projects.length).padStart(2,'0')}]</span></div>${projectCards(featured,true)}<details class="all-projects"><summary>View all ${projects.length} projects</summary><div class="all-project-index">${projects.map(p=>`<a href="/projects/${p.id}/"><span class="index-number">${String(p.id).padStart(3,'0')}</span><span>${escapeHTML(displayTitles[p.id] || p.title)}</span><span class="index-type">${escapeHTML(displayTypes[p.type] || p.type)}</span><span aria-hidden="true">↗</span></a>`).join('')}</div><a class="editorial-text-link" href="/projects/">Open the complete gallery</a></details></section>
  <section class="home-services editorial-shell" id="services"><div class="editorial-heading"><div><p class="eyebrow">How I can help</p><h2>Services<span class="heading-count">[04]</span></h2></div><p class="section-aside">From the first idea<br>to a clearer picture.</p></div><div class="service-rows">${services.map((service,index)=>{const project=projects.find(p=>p.id===service.project);return `<details class="service-row"><summary><span class="service-index">[${String(index+1).padStart(2,'0')}]</span><h3>${service.title}</h3><span class="service-focus">${service.focus}</span><span class="service-toggle" aria-hidden="true"></span></summary><div class="service-content"><div><p>${service.description}</p>${project?`<a class="editorial-text-link" href="/projects/${project.id}/">View ${escapeHTML(displayTitles[project.id] || project.title)} <span aria-hidden="true">↗</span></a>`:''}</div>${project?`<a class="service-example" href="/projects/${project.id}/" aria-label="View ${escapeHTML(project.title)}">${cardImage(project)}</a>`:''}</div></details>`;}).join('')}</div><div class="home-tools" id="tools"><p><strong>The tools I reach for:</strong> AutoCAD, SketchUp, Lumion, Enscape, Photoshop, and Canva.</p><a class="editorial-text-link" href="/tool/software/">View my software</a></div></section>
  <section class="home-about editorial-shell" id="about"><div><p class="eyebrow">The person behind the work</p><h2>Hi, I’m nyco.</h2></div><div><p class="about-lead">I’m a freelance Architectural &amp; Landscape Designer and Professional Architectural Visualizer based in Palawan, Philippines.</p><p class="about-description">I began working in the design field in 2015 while completing my Bachelor of Science in Architecture at Palawan State University. I work independently and collaborate with architects, developers, property owners, and design teams.</p><p class="about-motto">Nurture Concept. Yield Results.</p></div></section>
  <section class="home-contact" id="contact"><div class="editorial-shell"><p class="eyebrow">Let’s talk about your project</p><h2>Have a space<br>in mind?</h2><div class="home-contact-actions"><a class="button contact-email-button" href="mailto:${email}">Email me <span aria-hidden="true">↗</span></a></div><a class="home-inquiry" href="/contact/">Use the project inquiry form <span aria-hidden="true">↗</span></a></div></section>`;
}

function renderProject(projects, id) {
  const p = projects.find(project => project.id === id);
  if (!p) return renderNotFound();
  document.title = `${p.title} | Dela Cruz Studio.`;
  const next = projects[(projects.indexOf(p) + 1) % projects.length];
  main.innerHTML = `<article class="detail section-shell"><p class="eyebrow detail-index">Project ${String(p.id).padStart(3,'0')}</p><h1>${escapeHTML(p.title)}</h1><div class="detail-meta"><p>Location: ${escapeHTML(p.location)}</p><p><span>Date: ${escapeHTML(p.year)}</span><span>Type: ${escapeHTML(p.type)}</span></p></div><div class="detail-actions"><a class="button" href="/#work">Back to projects</a><a class="button" href="/contact/">Let’s Talk <span aria-hidden="true">↗</span></a></div><img class="detail-image" src="${p.image}" alt="${escapeHTML(p.title)} design visualization" fetchpriority="high"><div class="detail-story"><span class="eyebrow">${p.id === 12 ? 'Concept' : 'About the project'}</span><div class="detail-story-text">${p.description.replace(/^CONCEPT\n\n/,'').split(/\n\n/).map(text=>`<p>${escapeHTML(text)}</p>`).join('')}</div></div><a class="next-project" href="/projects/${next.id}/"><div><span class="eyebrow">Next project</span><strong>${escapeHTML(next.title)}</strong></div><span aria-hidden="true">↗</span></a></article>`;
}

function renderContact() {
  document.title = 'Contact | Dela Cruz Studio.';
  main.innerHTML = `<section class="contact-page section-shell"><div><p class="eyebrow">Project inquiry</p><h1>Have a space in mind?</h1><p class="contact-description">Tell me about your site, the type of space, and the design help you need.</p><a class="button contact-email-button" href="mailto:${email}">Email me <span aria-hidden="true">↗</span></a></div><form class="contact-form" aria-label="Project inquiry form"><div class="form-field"><label for="name">Name</label><input id="name" name="name" autocomplete="name" placeholder="Your name" required maxlength="160"></div><div class="form-field"><label for="email">Email</label><input id="email" name="email" type="email" autocomplete="email" placeholder="Your email address" required maxlength="254"></div><div class="form-field"><label for="message">Message</label><textarea id="message" name="message" placeholder="Tell me about your project" required maxlength="5000"></textarea></div><p class="form-note">This form opens a draft in your email app. Review it and send it from there.</p><div class="form-actions"><button class="button solid" type="submit">Open email draft <span aria-hidden="true">↗</span></button></div><p class="form-status" id="form-status" role="status"></p></form></section>`;
  document.querySelector('form').addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = new FormData(form);
    const name = fields.get('name').trim();
    const reply = fields.get('email').trim();
    const message = fields.get('message').trim();
    if (!name || !reply || !message) {
      document.querySelector('#form-status').textContent = 'Please enter your name, email address, and a message.';
      return;
    }
    const subject = encodeURIComponent(`Project inquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nReply to: ${reply}`);
    const draft = document.createElement('a');
    draft.href = `mailto:${email}?subject=${subject}&body=${body}`;
    draft.click();
    document.querySelector('#form-status').textContent = 'Your email app should open with a draft. If it doesn’t, use the Email me button. Your message has not been sent by this website.';
  });
}

function renderSoftware() {
  document.title = 'Software | Dela Cruz Studio.';
  main.innerHTML = `<section class="software-page section-shell"><p class="eyebrow">Tools</p><h1>The software I reach for, day to day.</h1><ul class="software-list">${['AutoCAD','SketchUp','Lumion','Enscape','Photoshop','Canva'].map((tool,i)=>`<li id="${tool.toLowerCase()}">${tool}<span aria-hidden="true">${String(i+1).padStart(2,'0')}</span></li>`).join('')}</ul><a class="button" href="/#tools">Back to the portfolio</a></section>`;
}

function renderNotFound() {
  document.title = 'Page not found | Dela Cruz Studio.';
  main.innerHTML = `<section class="error-state"><p class="eyebrow">404</p><h1>This page isn’t here.</h1><p>Return to the portfolio to browse the projects or get in touch.</p><a class="button" href="/">Return home</a></section>`;
}

function imageFallbacks() {
  document.querySelectorAll('main img').forEach(image => {
    const showFallback = () => {
      const message = document.createElement('span');
      message.className = 'image-fallback';
      message.textContent = `${image.alt || 'Portfolio image'} could not load. Refresh the page to try again.`;
      image.replaceWith(message);
    };
    image.addEventListener('error', showFallback, {once:true});
  });
}

async function start() {
  try {
    if (path === '/contact') renderContact();
    else if (path === '/tool' || path === '/tool/software') renderSoftware();
    else if (path === '/' || path === '/projects' || /^\/projects\/\d+$/.test(path)) {
      const response = await fetch(new URL('projects.json', document.baseURI));
      if (!response.ok) throw new Error('Portfolio data unavailable');
      const projects = await response.json();
      if (!Array.isArray(projects)) throw new Error('Invalid portfolio data');
      document.querySelectorAll('[data-work-count]').forEach(label=>{label.textContent=`[${projects.length}]`;});
      if (path === '/') renderHome(projects);
      else if (path === '/projects') {
        document.title = 'Projects | Dela Cruz Studio.';
        main.innerHTML = `<section class="work gallery-index section-shell" id="work"><div class="section-heading"><p class="eyebrow">Selected Work</p><h1 class="section-title">A few projects I’m proud to have shaped.</h1></div>${projectCards(projects)}</section>`;
      } else renderProject(projects, Number(path.split('/').pop()));
    } else renderNotFound();
    resolveSitePaths(main);
    imageFallbacks();
    if (location.hash) requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView());
  } catch (error) {
    main.innerHTML = `<section class="error-state" role="alert"><h1>The portfolio couldn’t load.</h1><p>Refresh the page to try again, or contact <a href="mailto:${email}">Email me</a>.</p><button class="button" id="retry">Try again</button></section>`;
    document.querySelector('#retry').addEventListener('click', () => location.reload());
  }
}
start();
