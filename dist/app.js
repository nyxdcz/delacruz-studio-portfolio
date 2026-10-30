const main = document.querySelector('main');
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
const email = 'nyxdcz@gmail.com';
const siteBase = new URL(document.baseURI).pathname;
const relativePath = location.pathname.startsWith(siteBase) ? '/' + location.pathname.slice(siteBase.length) : location.pathname;
const path = relativePath.replace(/\/+$/, '') || '/';
if (path === '/') document.body.classList.add('home-page');
const navigationType = performance.getEntriesByType('navigation')[0]?.type;
const refreshingPage = navigationType === 'reload';
history.scrollRestoration = refreshingPage ? 'manual' : 'auto';
if (refreshingPage) history.replaceState(history.state, '', location.pathname + location.search);
if (!location.hash && navigationType !== 'back_forward') window.scrollTo({top:0, left:0, behavior:'instant'});
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

document.addEventListener('click', event => {
  const link = event.target.closest('.home-intro-actions .button[href$="#work"]');
  if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const work = document.getElementById('work');
  if (!work) return;
  event.preventDefault();
  closeMenu();
  document.dispatchEvent(new Event('portfolio:work-start'));
  const destination = window.scrollY + work.getBoundingClientRect().top;
  if (location.href !== link.href) history.pushState(history.state, '', link.href);
  work.setAttribute('tabindex', '-1');
  work.focus({preventScroll:true});
  window.scrollTo({top:Math.max(0, destination), left:0, behavior:'instant'});
});

function scrollToSectionHash(hash, behavior = 'instant') {
  if (hash === '#top') window.scrollTo({top:0, left:0, behavior});
  else {
    const target = document.getElementById(hash.slice(1));
    if (target) {
      const clearance = document.querySelector('.site-header').offsetHeight + 24;
      window.scrollTo({top:Math.max(0, window.scrollY + target.getBoundingClientRect().top - clearance), behavior});
    }
  }
}

const backToTop = document.querySelector('.footer-links a[href$="#top"]');
function resetPageOpening(destination = location.href) {
  closeMenu();
  main.focus({preventScroll:true});
  history.replaceState(history.state, '', destination);
  scrollToSectionHash('#top');
  document.dispatchEvent(new Event('portfolio:opening'));
}
backToTop.addEventListener('click', event => {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  resetPageOpening(backToTop.href);
});
document.querySelectorAll('.brand,.footer-logo').forEach(logo => logo.addEventListener('click', event => {
  if (path !== '/' || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  resetPageOpening(event.currentTarget.href);
}));
window.addEventListener('pageshow', () => {
  if (refreshingPage) resetPageOpening();
}, {once:true});

const compactNavigation = matchMedia('(max-width: 799px)');
function setMenuOpen(open) {
  nav.classList.toggle('is-open', open);
  nav.inert = compactNavigation.matches && !open;
  menu.setAttribute('aria-expanded', String(open));
  menu.querySelector('.menu-label').textContent = open ? 'Close' : 'Menu';
}
function closeMenu(returnFocus = false) {
  setMenuOpen(false);
  if (returnFocus) menu.focus();
}
setMenuOpen(false);
compactNavigation.addEventListener('change', () => closeMenu());
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') === 'false';
  setMenuOpen(open);
});
nav.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') closeMenu(true); });
document.addEventListener('click', e => { if (!nav.contains(e.target) && !menu.contains(e.target)) closeMenu(); });


function setupScrollHeader() {
  const header = document.querySelector('.site-header');
  const revealZone = document.createElement('div');
  revealZone.className = 'header-reveal-zone';
  revealZone.hidden = true;
  revealZone.setAttribute('aria-hidden', 'true');
  header.after(revealZone);
  let previousY = Math.max(0, window.scrollY);
  let framePending = false;
  let pointerInside = false;
  let openingIntro = path === '/' && previousY <= 2 && (!location.hash || location.hash === '#top');

  const setHidden = hidden => {
    header.classList.toggle('is-over-content', window.scrollY > header.offsetHeight);
    header.classList.toggle('is-scroll-hidden', hidden);
    document.body.classList.toggle('is-opening-intro', openingIntro);
    revealZone.hidden = !hidden || openingIntro;
  };
  const update = () => {
    framePending = false;
    const y = Math.max(0, window.scrollY);
    const delta = y - previousY;
    if (openingIntro && y > 2) openingIntro = false;
    if (openingIntro) {
      setHidden(true);
      previousY = y;
      return;
    }
    const interacting = pointerInside || menu.getAttribute('aria-expanded') === 'true' || header.querySelector(':focus-visible');
    if (y <= header.offsetHeight || interacting) {
      setHidden(false);
    } else if (Math.abs(delta) >= 8) {
      setHidden(delta > 0);
    } else {
      return;
    }
    previousY = y;
  };
  window.addEventListener('scroll', () => {
    if (!framePending) {
      framePending = true;
      requestAnimationFrame(update);
    }
  }, {passive:true});
  header.addEventListener('pointerenter', event => {
    if (event.pointerType !== 'touch') pointerInside = true;
    setHidden(false);
  });
  header.addEventListener('pointerleave', () => { pointerInside = false; });
  header.addEventListener('focusin', () => {
    openingIntro = false;
    setHidden(false);
  });
  document.addEventListener('portfolio:opening', () => {
    previousY = 0;
    pointerInside = false;
    openingIntro = path === '/';
    setHidden(openingIntro);
  });
  document.addEventListener('portfolio:work-start', () => {
    openingIntro = false;
    pointerInside = false;
    setHidden(true);
  });
  revealZone.addEventListener('pointerenter', () => setHidden(false));
  window.addEventListener('resize', () => {
    previousY = Math.max(0, window.scrollY);
    setHidden(openingIntro);
  });
  if (openingIntro) setHidden(true);
}
setupScrollHeader();

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
  return `<div class="editorial-project-grid">${projects.map((p,index) => `<a class="editorial-project" href="/projects/${p.id}/" aria-label="View ${escapeHTML(p.title)}"><div class="editorial-project-photo">${cardImage(p,priority && index<2)}</div><div class="editorial-project-caption"><p class="project-category"><span class="project-index">${String(p.id).padStart(3,'0')}</span> ${escapeHTML(displayTypes[p.type] || p.type)} · ${escapeHTML(p.year)}</p><h3>${escapeHTML(displayTitles[p.id] || p.title)} <span class="action-arrow" aria-hidden="true">↗</span></h3><p class="project-place">${escapeHTML(p.location.replace(', PHILIPPINES',''))}</p></div></a>`).join('')}</div>`;
}

function openingSocialLinks() {
  const profiles = [
    {name:'LinkedIn',url:'https://www.linkedin.com/in/nyxdcz',icon:'<path d="M20.45 2H3.55C2.69 2 2 2.68 2 3.52v16.96c0 .84.69 1.52 1.55 1.52h16.9c.86 0 1.55-.68 1.55-1.52V3.52c0-.84-.69-1.52-1.55-1.52ZM7.93 18.75H4.98V9.2h2.95v9.55ZM6.45 7.9a1.71 1.71 0 1 1 0-3.42 1.71 1.71 0 0 1 0 3.42Zm12.3 10.85H15.8V14.1c0-1.11-.02-2.54-1.55-2.54-1.55 0-1.79 1.21-1.79 2.46v4.73H9.51V9.2h2.83v1.3h.04a3.1 3.1 0 0 1 2.79-1.53c2.98 0 3.58 1.96 3.58 4.51v5.27Z"/>'},
    {name:'Instagram',url:'https://www.instagram.com/nycotopia',icon:'<g fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/></g><circle cx="17.5" cy="6.5" r="1.1"/>'},
    {name:'Facebook',url:'https://www.facebook.com/share/1BU3EpqYKE/',icon:'<path d="M13.4 22v-9.12h3.06l.46-3.56H13.4V7.05c0-1.03.29-1.73 1.76-1.73h1.88V2.14A25.1 25.1 0 0 0 14.3 2c-2.72 0-4.58 1.66-4.58 4.71v2.61H6.65v3.56h3.07V22h3.68Z"/>'}
  ];
  return `<div class="hero-social-links" role="group" aria-label="Social profiles">${profiles.map(profile=>`<a class="hero-social-link" href="${profile.url}" aria-label="${profile.name}" title="${profile.name}" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true" focusable="false">${profile.icon}</svg></a>`).join('')}</div>`;
}

function contactContent(standalone = false) {
  const heading = standalone ? 'h1' : 'h2';
  return `<div class="studio-contact-layout editorial-shell">
    <div class="studio-contact-copy">
      <${heading}>Say hello.</${heading}>
      <p class="contact-invitation">Tell me about your site, what you’re planning, and the design support you need.</p>
      <div class="studio-email-bar"><a href="mailto:${email}">${email}</a><button type="button" aria-label="Copy email address">Copy</button></div>
      <p class="studio-copy-status" role="status"></p>
      <p class="contact-location">Based in Palawan, Philippines.</p>
      <div class="studio-contact-links">${openingSocialLinks()}</div>
    </div>
    <form class="studio-inquiry" aria-label="Project inquiry">
      <div class="form-pair">
        <div class="form-field"><label for="studio-name">Name</label><input id="studio-name" name="name" autocomplete="name" placeholder="Your name" maxlength="160" required></div>
        <div class="form-field"><label for="studio-email">Email</label><input id="studio-email" name="email" type="email" autocomplete="email" placeholder="Your email address" maxlength="254" required></div>
      </div>
      <div class="form-field"><label for="studio-message">What are you planning?</label><textarea id="studio-message" name="message" placeholder="A little about your site and what you have in mind" maxlength="5000" required></textarea></div>
      <div class="form-field"><label for="studio-location">Project location <span>(optional)</span></label><input id="studio-location" name="location" autocomplete="off" placeholder="City or municipality" maxlength="200"></div>
      <p class="form-note">This opens a draft in your email app. You can review it before sending.</p>
      <button class="button solid" type="submit">Open email draft <span class="action-arrow" aria-hidden="true">↗</span></button>
      <p class="form-status" role="status"></p>
    </form>
  </div>`;
}

function renderHome(projects) {
  document.body.classList.add('home-page');
  const featured = featuredIds.map(id=>projects.find(p=>p.id===id)).filter(Boolean);
  main.innerHTML = `<section class="home-intro editorial-shell" id="intro"><div class="home-intro-copy"><p class="eyebrow">Hi, I’m Nyco from Palawan, Philippines.</p><h1><span>Architectural &amp;</span><span>landscape design.</span><span>Clearly visualized.</span></h1><p class="home-intro-description">From site planning and landscape design to detailed 3D visualization, my work connects spaces with the way people live and use them.</p><div class="home-intro-actions"><a class="button solid" href="/#work">View Projects <span class="intro-down-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" focusable="false"><path d="M12 3v18m-6-6 6 6 6-6"/></svg></span></a>${openingSocialLinks()}</div></div><figure class="home-portrait"><img src="${new URL('assets/portrait-preview.png',document.baseURI).href}" srcset="assets/portrait-preview.png 392w, assets/portrait.png 904w" sizes="(min-width: 1435px) 330px, (min-width: 957px) 23vw, (min-width: 800px) 220px, 1px" alt="nyco, architectural and landscape designer" width="392" height="650"></figure></section>
  <section class="home-work editorial-shell" id="work"><div class="editorial-heading"><div><p class="eyebrow">Selected Work</p><h2>A few projects<br>I’ve shaped.</h2></div><span class="section-index">[${String(projects.length).padStart(2,'0')}]</span></div>${projectCards(featured,true)}<details class="all-projects"><summary>View all ${projects.length} projects</summary><div class="all-project-index">${projects.map(p=>`<a href="/projects/${p.id}/"><span class="index-number">${String(p.id).padStart(3,'0')}</span><span>${escapeHTML(displayTitles[p.id] || p.title)}</span><span class="index-type">${escapeHTML(displayTypes[p.type] || p.type)}</span><span class="action-arrow" aria-hidden="true">↗</span></a>`).join('')}</div><a class="outline-index-link complete-gallery-link" href="/projects/">Open the complete gallery</a></details></section>
  <section class="home-services editorial-shell" id="services"><div class="editorial-heading"><h2>Services<span class="heading-count">[04]</span></h2><p class="section-aside">Site planning, planting design,<br>and 3D visualization.</p></div><div class="service-rows">${services.map((service,index)=>{const project=projects.find(p=>p.id===service.project);return `<details class="service-row"><summary><span class="service-index">[${String(index+1).padStart(2,'0')}]</span><h3>${service.title}</h3><span class="service-focus">${service.focus}</span><span class="service-toggle" aria-hidden="true"></span></summary><div class="service-content"><div><p>${service.description}</p>${project?`<a class="editorial-text-link" href="/projects/${project.id}/">View ${escapeHTML(displayTitles[project.id] || project.title)} <span class="action-arrow" aria-hidden="true">↗</span></a>`:''}</div>${project?`<a class="service-example" href="/projects/${project.id}/" aria-label="View ${escapeHTML(project.title)}">${cardImage(project)}</a>`:''}</div></details>`;}).join('')}</div><div class="home-tools" id="tools"><p><strong>The tools I reach for:</strong> AutoCAD, SketchUp, Lumion, Enscape, Photoshop, and Canva.</p><a class="editorial-text-link" href="/tool/software/">View my software</a></div></section>
  <section class="home-about editorial-shell" id="about" aria-labelledby="about-heading"><div><p class="eyebrow">The person behind the work</p><h2 id="about-heading">Hi, I’m Nyco.</h2></div><div><p class="about-lead">I’m a freelance Architectural &amp; Landscape Designer and Professional Architectural Visualizer based in Palawan, Philippines.</p><div class="about-story story-copy" id="my-story"><p>I began working in design in 2015 while completing my Bachelor of Science in Architecture at Palawan State University.</p><p>My work covers site and master planning, landscape and architectural design, interiors, and 3D visualization. I develop concepts, presentation drawings, photorealistic renderings, and design documentation.</p><p>I work independently and collaborate with architects, developers, property owners, and design teams, starting with the site, the client’s needs, and the purpose of each space.</p><p class="story-motto">Nurture Concept. Yield Results.</p></div></div></section>
  <section class="studio-contact" id="contact">${contactContent()}</section>`;
}

function renderGallery(projects) {
  document.title = 'Projects | Dela Cruz Studio.';
  main.innerHTML = `<section class="work gallery-index section-shell" id="work"><div class="section-heading"><p class="eyebrow">Selected Work</p><h1 class="section-title">A few projects I’m proud to have shaped.</h1></div>${projectCards(projects)}</section>`;
}

function renderProject(projects, id) {
  const p = projects.find(project => project.id === id);
  if (!p) return renderNotFound();
  document.title = `${p.title} | Dela Cruz Studio.`;
  const next = projects[(projects.indexOf(p) + 1) % projects.length];
  main.innerHTML = `<article class="detail section-shell"><p class="eyebrow detail-index">Project ${String(p.id).padStart(3,'0')}</p><h1>${escapeHTML(p.title)}</h1><div class="detail-meta"><p>Location: ${escapeHTML(p.location)}</p><p><span>Date: ${escapeHTML(p.year)}</span><span>Type: ${escapeHTML(p.type)}</span></p></div><div class="detail-actions"><a class="button" href="/#work">Back to projects</a><a class="button" href="/contact/">Let’s Talk <span class="action-arrow" aria-hidden="true">↗</span></a></div><img class="detail-image" src="${p.image}" alt="${escapeHTML(p.title)} design visualization" fetchpriority="high"><div class="detail-story"><span class="eyebrow">${p.id === 12 ? 'Concept' : 'About the project'}</span><div class="detail-story-text">${p.description.replace(/^CONCEPT\n\n/,'').split(/\n\n/).map(text=>`<p>${escapeHTML(text)}</p>`).join('')}</div></div><a class="next-project" href="/projects/${next.id}/"><div><span class="eyebrow">Next project</span><strong>${escapeHTML(next.title)}</strong></div><span class="action-arrow" aria-hidden="true">↗</span></a></article>`;
}

function renderContact() {
  document.title = 'Say hello | Dela Cruz Studio.';
  main.innerHTML = `<section class="studio-contact" id="contact">${contactContent(true)}</section>`;
}

function setupContact() {
  const contact = document.querySelector('.studio-contact');
  if (!contact) return;
  const copyButton = contact.querySelector('.studio-email-bar button');
  const copyStatus = contact.querySelector('.studio-copy-status');
  copyButton.addEventListener('click', async () => {
    copyButton.disabled = true;
    copyButton.textContent = 'Copying…';
    try {
      await navigator.clipboard.writeText(email);
      copyButton.textContent = 'Copied';
      copyStatus.textContent = 'Email address copied.';
    } catch {
      copyButton.textContent = 'Copy';
      copyStatus.textContent = 'Copy wasn’t available. Select the email address to copy it manually.';
    } finally {
      copyButton.disabled = false;
    }
  });
  contact.querySelector('form').addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = new FormData(form);
    const name = fields.get('name').trim();
    const reply = fields.get('email').trim();
    const message = fields.get('message').trim();
    const projectLocation = fields.get('location').trim();
    const status = form.querySelector('.form-status');
    if (!name || !reply || !message) {
      status.textContent = 'Please add your name, email address, and a little about the project.';
      return;
    }
    const subject = encodeURIComponent(`Project inquiry from ${name}`);
    const body = encodeURIComponent(`${message}${projectLocation ? '\n\nProject location: '+projectLocation : ''}\n\nFrom: ${name}\nReply to: ${reply}`);
    const draft = document.createElement('a');
    draft.href = `mailto:${email}?subject=${subject}&body=${body}`;
    draft.click();
    status.textContent = 'Your email app should open with your draft. This website has not sent your message.';
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
      if (path === '/') renderHome(projects);
      else if (path === '/projects') renderGallery(projects);
      else renderProject(projects, Number(path.split('/').pop()));
    } else renderNotFound();
    resolveSitePaths(main);
    setupContact();
    imageFallbacks();
    if (location.hash) requestAnimationFrame(() => scrollToSectionHash(location.hash));
  } catch (error) {
    if (main.querySelector('h1')) return;
    main.innerHTML = `<section class="error-state" role="alert"><h1>The portfolio couldn’t load.</h1><p>Refresh the page to try again, or contact <a href="mailto:${email}">Email me</a>.</p><button class="button" id="retry">Try again</button></section>`;
    document.querySelector('#retry').addEventListener('click', () => location.reload());
  } finally {
    document.body.dataset.pageReady = 'true';
    document.dispatchEvent(new Event('portfolio:ready'));
  }
}
start();
