const main = document.querySelector('main');
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
const email = 'nyxdcz@gmail.com';
const siteBase = new URL(document.baseURI).pathname;
const relativePath = location.pathname.startsWith(siteBase) ? '/' + location.pathname.slice(siteBase.length) : location.pathname;
const path = relativePath.replace(/\/+$/, '') || '/';
const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const external = 'target="_blank" rel="noopener noreferrer"';

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

const rail = `<aside class="social-rail" aria-label="Social profiles"><a href="https://www.linkedin.com/in/nyco" aria-label="LinkedIn profile" ${external}>in</a><a href="https://www.instagram.com/ny._co" aria-label="Instagram profile" ${external}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6m5.5-3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3"/></svg></a><a href="https://www.facebook.com/share/1BU3EpqYKE/" aria-label="Facebook profile" ${external}>f</a></aside>`;

function projectCards(projects) {
  if (!projects.length) return '<p class="empty-state">No projects have been added yet. <a href="/contact/">Contact nyco about your project.</a></p>';
  return `<div class="project-list">${projects.map(p => `<a class="project-card" href="/projects/${p.id}/" aria-label="View ${escapeHTML(p.title)}"><img src="${p.image}" alt="${escapeHTML(p.title)} architectural project" width="2100" height="1500" loading="lazy"><span class="project-number" aria-hidden="true">${String(p.id).padStart(2,'0')} / 12</span><div class="card-caption"><p class="eyebrow">Location: ${escapeHTML(p.location)}</p><h3>${escapeHTML(p.title)}</h3><span class="card-open" aria-hidden="true">↗</span></div></a>`).join('')}</div>`;
}

function contactInvite() {
  return `<section class="section-shell"><div class="contact-invite"><p class="eyebrow">Have a project in mind?</p><h2 class="section-title">Let’s build something<br>great together.</h2><a class="button" href="/contact/">Let’s Talk <span aria-hidden="true">↗</span></a></div></section>`;
}

function renderHome(projects) {
  main.innerHTML = `<section class="hero" id="intro"><div class="hero-copy"><p class="eyebrow">Short Introduction</p><h1><span>Hi, I’m nyco.</span><strong>Professional Architectural Visualizer</strong><span>based in Palawan, Philippines.</span></h1><p class="hero-description">I’m a freelance Architectural &amp; Landscape Designer working across architecture, landscape design, interiors, master planning, and 3D visualization. I help turn ideas into clear, buildable, and visually engaging designs.</p><div class="hero-actions"><a class="button" href="https://online.fliphtml5.com/kfcfk/PORTFOLIO-wmZT/" ${external}>View Portfolio <span aria-hidden="true">↗</span></a><a class="button" href="https://www.linkedin.com/in/nyxdcz" ${external}>LinkedIn <span aria-hidden="true">↗</span></a></div></div><div class="hero-portrait"><img src="/assets/portrait.png" alt="nyco, architectural and landscape designer" width="904" height="1500" fetchpriority="high"></div>${rail}</section>
  <section class="tools-strip" id="tools" aria-labelledby="tools-label"><h2 class="eyebrow" id="tools-label">The tools I reach for, day to day.</h2><div class="tool-graphics"><a href="/tool/software/" aria-label="View my software: AutoCAD, SketchUp, Lumion, Enscape, Photoshop, and Canva"><img src="/assets/tools-1.png" alt="AutoCAD, SketchUp, Lumion, Enscape, Photoshop, and Canva" width="2317" height="98" loading="lazy"></a><a href="/tool/software/" aria-label="View the software collection"><img src="/assets/tools-2.png" alt="Design and visualization software collection" width="2317" height="98" loading="lazy"></a></div><div class="tools-detail-link"><a href="/tool/software/">View my software</a></div></section>
  <section class="about section-shell" id="about"><div class="about-layout"><div class="section-heading"><p class="eyebrow">About me</p><h2>My Story</h2></div><div class="about-copy"><p>I'm a freelance Architectural &amp; Landscape Designer and Professional Architectural Visualizer based in Palawan, Philippines. I began working in the design field in 2015 while completing my Bachelor of Science in Architecture at Palawan State University.</p><p>My work includes architectural design, landscape design, master planning, spatial planning, interior design, 3D modeling, and high-quality architectural visualization for residential, commercial, hospitality, and mixed-use projects. I support each project from site analysis and concept development to presentation drawings, photorealistic renderings, and design documentation.</p><p>I believe good design begins with understanding the site, the client, and the purpose of the project. My approach combines careful planning, practical design thinking, and clear visual communication to create spaces that are thoughtful, buildable, and connected to their surroundings.</p><p>I work independently and collaborate with architects, developers, property owners, interior designers, and multidisciplinary teams. Every project is different, but my goal remains the same: to transform strong ideas into functional, context-driven, and visually engaging spaces.</p><p class="motto">Nurture Concept.<br>Yield Results.</p></div></div></section>
  <section class="work section-shell" id="work"><div class="section-heading"><p class="eyebrow">Selected Work</p><h2 class="section-title">A few projects I’m<br>proud to have shaped.</h2></div>${projectCards(projects)}</section>${contactInvite()}`;
}

function renderProject(projects, id) {
  const p = projects.find(project => project.id === id);
  if (!p) return renderNotFound();
  document.title = `${p.title} | Dela Cruz Studio.`;
  const next = projects[(projects.indexOf(p) + 1) % projects.length];
  main.innerHTML = `<article class="detail section-shell"><h1>${escapeHTML(p.title)}</h1><div class="detail-meta"><p>Location: ${escapeHTML(p.location)}</p><p><span>Date: ${escapeHTML(p.year)}</span><span>Type: ${escapeHTML(p.type)}</span></p></div><div class="detail-actions"><a class="button" href="/#work">Back to projects</a><a class="button" href="/contact/">Let’s Talk <span aria-hidden="true">↗</span></a></div><div class="detail-story"><span class="eyebrow">${p.id === 12 ? 'Concept' : 'About the project'}</span><div class="detail-story-text">${p.description.replace(/^CONCEPT\n\n/,'').split(/\n\n/).map(text=>`<p>${escapeHTML(text)}</p>`).join('')}</div></div><img class="detail-image" src="${p.image}" alt="${escapeHTML(p.title)} design visualization" fetchpriority="high"><a class="next-project" href="/projects/${next.id}/"><div><span class="eyebrow">Next project</span><strong>${escapeHTML(next.title)}</strong></div><span aria-hidden="true">↗</span></a></article>`;
}

function renderContact() {
  document.title = 'Contact | Dela Cruz Studio.';
  main.innerHTML = `<section class="contact-page section-shell"><div><p class="eyebrow">Contact</p><h1>Let’s build something great together.</h1><p class="contact-description">Have a project in mind, a role to fill, or just want to say hello? Drop a message and I’ll get back to you within a couple of days.</p><a class="email-address" href="mailto:${email}">${email}</a><div class="email-tools"><button class="text-button" type="button" id="copy-email">Copy email address</button><span role="status" id="copy-status"></span></div></div><form class="contact-form" aria-label="Project inquiry form"><div class="form-field"><label for="name">Name</label><input id="name" name="name" autocomplete="name" placeholder="Your name" required maxlength="160"></div><div class="form-field"><label for="email">Email</label><input id="email" name="email" type="email" autocomplete="email" placeholder="Your email address" required maxlength="254"></div><div class="form-field"><label for="message">Message</label><textarea id="message" name="message" placeholder="Tell me about your project" required maxlength="5000"></textarea></div><p class="form-note">This form opens a draft in your email app addressed to ${email}. Review it and send it from there.</p><div class="form-actions"><button class="button solid" type="submit">Open email draft <span aria-hidden="true">↗</span></button></div><p class="form-status" id="form-status" role="status"></p></form></section>`;
  document.querySelector('#copy-email').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(email); document.querySelector('#copy-status').textContent = 'Email address copied.'; }
    catch { document.querySelector('#copy-status').textContent = `Select and copy the address above: ${email}`; }
  });
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
    document.querySelector('#form-status').textContent = 'Your email app should open with a draft. If it doesn’t, email the address above directly. Your message has not been sent by this website.';
  });
}

function renderSoftware() {
  document.title = 'Software | Dela Cruz Studio.';
  main.innerHTML = `<section class="software-page section-shell"><p class="eyebrow">Tools</p><h1>The software I reach for, day to day.</h1><ul class="software-list">${['AutoCAD','SketchUp','Lumion','Enscape','Photoshop','Canva'].map((tool,i)=>`<li>${tool}<span aria-hidden="true">${String(i+1).padStart(2,'0')}</span></li>`).join('')}</ul><a class="button" href="/#tools">Back to the portfolio</a></section>`;
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
    if (image.complete && image.naturalWidth === 0) showFallback();
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
    main.innerHTML = `<section class="error-state" role="alert"><h1>The portfolio couldn’t load.</h1><p>Refresh the page to try again, or contact <a href="mailto:${email}">${email}</a>.</p><button class="button" id="retry">Try again</button></section>`;
    document.querySelector('#retry').addEventListener('click', () => location.reload());
  }
}
start();
