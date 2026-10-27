(() => {
  const main = document.querySelector('main');
  const reducedPreference = matchMedia('(prefers-reduced-motion: reduce)');
  const mobilePreference = matchMedia('(max-width: 799px)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const base = new URL(document.baseURI);
  const projectURL = id => new URL(`projects/${id}/`, base).href;
  const assetURL = name => new URL(`assets/${name}`, base).href;
  const escape = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const titles = {1:'MSG Farm',8:'Wrap Technologies Inc.',11:'Bañas Residence',4:'Verde Plant-Based Café & Resto'};
  const title = p => titles[p.id] || p.title;
  let initialized = false;
  let reduced = reducedPreference.matches;
  let scrollFrame = 0;
  let wheelFrame = 0;
  let wheelVisible = false;
  let wheelHovering = false;
  let angle = -18;
  let targetAngle = angle;
  let previousTime = 0;
  let idleUntil = 0;
  let dragging = false;
  let dragged = false;
  let dragX = 0;
  let dragAngle = 0;
  let orbit;
  let wheel;
  let scene;
  let mobileTrack;
  let statementWords = [];
  let focusScroll;
  let focusImage;
  let toolsSection;
  let toolsRows = [];
  let toolsFrame = 0;
  let toolsVisible = false;
  let toolsHovering = false;
  let toolsFocused = false;
  let toolsLastTime = 0;

  function picture(p, className = '') {
    return `<img class="${className}" src="${assetURL(`project-${p.id}-680.jpg`)}" srcset="${assetURL(`project-${p.id}-680.jpg`)} 680w, ${assetURL(`project-${p.id}-1280.jpg`)} 1280w" sizes="(max-width: 799px) 82vw, 500px" width="680" height="486" alt="${escape(title(p))} design visualization" loading="lazy" decoding="async">`;
  }

  function paintWheel() {
    if (wheel) wheel.style.transform = `rotateX(-18deg) rotateZ(-8deg) rotateY(${angle}deg)`;
  }

  function runWheel(time) {
    wheelFrame = 0;
    if (!wheelVisible || reduced || mobilePreference.matches || document.hidden) return;
    const delta = previousTime ? Math.min(time - previousTime, 50) : 0;
    previousTime = time;
    const focused = wheel.contains(document.activeElement);
    if (!dragging && !focused && !wheelHovering && time > idleUntil) targetAngle -= delta * .006;
    if (!dragging) angle += (targetAngle - angle) * .1;
    paintWheel();
    wheelFrame = requestAnimationFrame(runWheel);
  }

  function startWheel() {
    if (!wheelFrame && wheelVisible && !reduced && !mobilePreference.matches) {
      previousTime = 0;
      wheelFrame = requestAnimationFrame(runWheel);
    }
  }

  function rotate(direction) {
    if (mobilePreference.matches) {
      mobileTrack.scrollBy({left:direction * mobileTrack.clientWidth * .86,behavior:reduced?'instant':'smooth'});
      return;
    }
    targetAngle += direction * -28;
    idleUntil = performance.now() + 4500;
    if (reduced) { angle = targetAngle; paintWheel(); }
    else startWheel();
  }

  function setupOrbit(projects) {
    const selected = [1,8,11,4,3,10].map(id => projects.find(p=>p.id===id)).filter(Boolean);
    orbit = document.createElement('section');
    orbit.className = 'project-orbit intro-projects';
    orbit.id = 'motion-showcase';
    orbit.setAttribute('aria-labelledby','orbit-heading');
    orbit.innerHTML = `<div class="orbit-topline"><h2 id="orbit-heading" class="orbit-title">Explore selected projects</h2></div><div class="orbit-scene" role="group" aria-label="Selected projects. Drag or use left and right arrow keys."><div class="orbit-wheel">${selected.map((p,i)=>`<a class="orbit-card" href="${projectURL(p.id)}" style="--card-angle:${(i-(selected.length-1)/2)*28}deg" data-angle="${(i-(selected.length-1)/2)*28}" aria-label="View ${escape(title(p))}">${picture(p)}<span class="orbit-caption"><span>${String(p.id).padStart(3,'0')}</span>${escape(title(p))}<span class="action-arrow" aria-hidden="true">↗</span></span></a>`).join('')}</div></div><div class="orbit-mobile" aria-label="Swipe through selected projects">${selected.map(p=>`<a class="orbit-mobile-card" href="${projectURL(p.id)}">${picture(p)}<span class="orbit-caption"><span>${String(p.id).padStart(3,'0')}</span>${escape(title(p))}<span class="action-arrow" aria-hidden="true">↗</span></span></a>`).join('')}</div><div class="orbit-bottomline"><p class="orbit-instruction"><span class="orbit-desktop-hint">Drag to explore<br>Choose a project to view</span><span class="orbit-mobile-hint">Swipe to explore<br>Tap a project to view</span></p></div>`;
    document.querySelector('.home-intro').append(orbit);
    scene = orbit.querySelector('.orbit-scene');
    wheel = orbit.querySelector('.orbit-wheel');
    mobileTrack = orbit.querySelector('.orbit-mobile');
    scene.addEventListener('pointerenter',()=>{wheelHovering=true;});
    scene.addEventListener('pointerleave',()=>{wheelHovering=false;});
    scene.addEventListener('keydown',event=>{
      if(!['ArrowLeft','ArrowRight'].includes(event.key))return;
      event.preventDefault();
      rotate(event.key==='ArrowLeft'?-1:1);
    });
    scene.addEventListener('pointerdown',event=>{
      if (event.button!==0) return;
      dragging=true; dragged=false; dragX=event.clientX; dragAngle=angle;
    });
    scene.addEventListener('pointermove',event=>{
      if (!dragging) return;
      const distance=event.clientX-dragX;
      if (Math.abs(distance)>5) {
        dragged=true;
        if (!scene.hasPointerCapture(event.pointerId)) scene.setPointerCapture(event.pointerId);
        scene.classList.add('is-dragging');
      }
      angle=dragAngle+distance*.28; targetAngle=angle; paintWheel();
    });
    const release=()=>{
      dragging=false; scene.classList.remove('is-dragging'); idleUntil=performance.now()+4500;
      setTimeout(()=>{dragged=false;},0);
    };
    scene.addEventListener('pointerup',release);
    scene.addEventListener('pointercancel',release);
    scene.addEventListener('lostpointercapture',release);
    scene.addEventListener('dragstart',event=>event.preventDefault());
    scene.addEventListener('click',event=>{if(dragged)event.preventDefault();},true);
    window.addEventListener('pointerup',release);
    wheel.querySelectorAll('a').forEach(card=>card.addEventListener('focus',()=>{
      const desired=-Number(card.dataset.angle);
      targetAngle=desired+Math.round((angle-desired)/360)*360;
      if(reduced){angle=targetAngle;paintWheel();}
    }));
    new IntersectionObserver(entries=>{
      wheelVisible=entries[0].isIntersecting;
      if(wheelVisible)startWheel();
      else {cancelAnimationFrame(wheelFrame);wheelFrame=0;}
    },{threshold:.08}).observe(scene);
    const primary=document.querySelector('.home-intro-actions .button');
    primary.href=new URL('#work',base).href;
    paintWheel();
  }

  function setupAboutPortrait() {
    const intro=document.querySelector('.home-intro');
    const about=document.querySelector('.home-about');
    const portrait=intro.querySelector('.home-portrait');
    const heading=about.children[0];
    const biography=about.children[1];
    heading.classList.add('about-heading');
    biography.classList.add('about-biography');
    const content=document.createElement('div');
    content.className='about-content';
    content.append(heading,biography);
    const portraitImage=portrait.querySelector('img');
    if(portraitImage)portraitImage.sizes='(max-width: 642px) 28vw, (max-width: 799px) 180px, (max-width: 1199px) 32vw, (max-width: 1421px) 38vw, 540px';
    about.replaceChildren(content,portrait);
    intro.classList.add('intro-with-orbit');
  }

  function setupServices(projects) {
    const projectIds=[11,8,4,1];
    document.querySelectorAll('.service-row').forEach((row,index)=>{
      const original=row.querySelector('.service-content');
      const description=original.querySelector('p').textContent;
      const p=projects.find(p=>p.id===projectIds[index]);
      if(!p)return;
      const examples=[p,...projects.filter(other=>other.type===p.type&&other.id!==p.id)].slice(0,3);
      const prefix=`service-${index}`;
      const panel=document.createElement('div');
      panel.className='service-motion-content';
      panel.innerHTML=`<div class="service-tabs" role="tablist" aria-label="${escape(row.querySelector('h3').textContent)} content"><button type="button" role="tab" id="${prefix}-images-tab" aria-controls="${prefix}-images" aria-selected="true">Images</button><span aria-hidden="true">/</span><button type="button" role="tab" id="${prefix}-description-tab" aria-controls="${prefix}-description" aria-selected="false" tabindex="-1">Description</button></div><div class="service-tab-stage"><div class="service-image-panel" id="${prefix}-images" role="tabpanel" aria-labelledby="${prefix}-images-tab">${examples.map(example=>`<a href="${projectURL(example.id)}" class="service-motion-example">${picture(example)}<span>${escape(title(example))} <span class="action-arrow" aria-hidden="true">↗</span></span></a>`).join('')}</div><div class="service-description-panel" id="${prefix}-description" role="tabpanel" aria-labelledby="${prefix}-description-tab" hidden><p>${escape(description)}</p><a class="editorial-text-link" href="${projectURL(p.id)}">View ${escape(title(p))} <span class="action-arrow" aria-hidden="true">↗</span></a></div></div>`;
      original.replaceWith(panel);
      const summary=row.querySelector('summary');
      let drawerAnimation;
      let expanded=row.open;
      summary.addEventListener('click',event=>{
        event.preventDefault();
        expanded=!expanded;
        const start=row.getBoundingClientRect().height;
        row.style.height=`${start}px`;
        drawerAnimation?.cancel();
        if(reduced){
          row.open=expanded;
          row.style.height='';
          row.style.overflow='';
          return;
        }
        row.open=true;
        row.style.height='';
        const end=expanded?row.getBoundingClientRect().height:summary.getBoundingClientRect().height+1;
        row.style.overflow='hidden';
        drawerAnimation=row.animate([{height:`${start}px`},{height:`${end}px`}],{duration:300,easing:'cubic-bezier(.22,1,.36,1)'});
        drawerAnimation.onfinish=()=>{
          row.open=expanded;
          row.style.height='';
          row.style.overflow='';
          drawerAnimation=null;
        };
      });
      const tabs=[...panel.querySelectorAll('[role="tab"]')];
      function activate(tab,focus=false){
        tabs.forEach(button=>{
          const active=button===tab;
          button.setAttribute('aria-selected',String(active));
          button.tabIndex=active?0:-1;
          const content=document.getElementById(button.getAttribute('aria-controls'));
          content.hidden=!active;
          if(active&&!reduced)content.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:300,easing:'ease-out'});
        });
        if(focus)tab.focus();
      }
      tabs.forEach((tab,i)=>{
        tab.addEventListener('click',()=>activate(tab));
        tab.addEventListener('keydown',event=>{
          if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
          event.preventDefault();
          const next=event.key==='Home'?0:event.key==='End'?1:(i+1)%2;
          activate(tabs[next],true);
        });
      });
    });
  }

  function paintToolsRow(row){
    const cycle=row.track.firstElementChild.getBoundingClientRect().width;
    if(cycle<=0)return;
    row.offset=((row.offset%cycle)-cycle)%cycle;
    row.track.style.transform=`translate3d(${row.offset}px,0,0)`;
  }

  function runTools(time){
    toolsFrame=0;
    if(!toolsVisible||reduced||toolsHovering||toolsFocused||document.hidden||toolsRows.some(row=>row.dragging))return;
    const delta=toolsLastTime?Math.min(time-toolsLastTime,50):0;
    toolsLastTime=time;
    toolsRows.forEach(row=>{row.offset+=row.speed*delta/1000;paintToolsRow(row);});
    toolsFrame=requestAnimationFrame(runTools);
  }

  function refreshToolsMotion(){
    if(!toolsSection)return;
    cancelAnimationFrame(toolsFrame);
    toolsFrame=0;
    toolsLastTime=0;
    if(toolsVisible&&!reduced&&!toolsHovering&&!toolsFocused&&!document.hidden)toolsFrame=requestAnimationFrame(runTools);
  }

  function setupToolsAndStory(){
    const software=[
      {name:'AutoCAD',center:125}, {name:'SketchUp',center:483},
      {name:'Lumion',center:839}, {name:'Enscape',center:1196},
      {name:'Photoshop',center:1558}, {name:'Canva',center:1917}
    ];
    const link=(tool,hidden)=>`<a class="tool-logo-link" href="${new URL(`tool/software/#${tool.name.toLowerCase()}`,base).href}" aria-label="Explore ${tool.name}" ${hidden?'tabindex="-1" aria-hidden="true"':''}><span class="tool-logo" aria-hidden="true" style="background-position:${(tool.center-43.5)/1961*100}% center"></span><span class="tool-logo-label" aria-hidden="true">${tool.name}</span></a>`;
    const cycle=(items,row,clone)=>`<div class="tools-cycle" ${clone?'aria-hidden="true"':''}>${[...items,...items].map((tool,i)=>link(tool,row>0||clone||i>=6)).join('')}</div>`;
    toolsSection=document.createElement('section');
    toolsSection.id='tools';
    toolsSection.className='tools-carousel';
    toolsSection.setAttribute('aria-labelledby','tools-heading');
    toolsSection.setAttribute('aria-roledescription','carousel');
    const second=[...software.slice(4),...software.slice(0,4)];
    toolsSection.innerHTML=`<div class="tools-carousel-heading editorial-shell"><h2 id="tools-heading">The tools I reach for, day to day.</h2></div><div class="tools-lanes">${[software,second].map((items,row)=>`<div class="tools-lane" data-tools-row="${row}" ${row?'aria-hidden="true"':''}><div class="tools-track">${cycle(items,row,false)}${cycle(items,row,true)}</div></div>`).join('')}</div><div class="tools-carousel-footer editorial-shell"><a class="outline-index-link" href="${new URL('tool/software/',base).href}">View my software</a></div>`;
    document.querySelector('.home-tools')?.remove();
    document.querySelector('.home-about').before(toolsSection);
    toolsRows=[...toolsSection.querySelectorAll('.tools-lane')].map((lane,i)=>({lane,track:lane.querySelector('.tools-track'),offset:i?-500:0,speed:i?24:-28,dragging:false,dragged:false,startX:0,startOffset:0}));
    toolsRows.forEach(row=>{
      paintToolsRow(row);
      row.lane.addEventListener('pointerdown',event=>{
        if(event.button!==0)return;
        row.dragging=true;row.dragged=false;row.startX=event.clientX;row.startOffset=row.offset;
        refreshToolsMotion();
      });
      row.lane.addEventListener('pointermove',event=>{
        if(!row.dragging)return;
        const distance=event.clientX-row.startX;
        if(Math.abs(distance)>5){
          row.dragged=true;
          if(!row.lane.hasPointerCapture(event.pointerId))row.lane.setPointerCapture(event.pointerId);
          row.lane.classList.add('is-dragging');
        }
        row.offset=row.startOffset+distance;paintToolsRow(row);
      });
      const release=()=>{
        row.dragging=false;row.lane.classList.remove('is-dragging');
        refreshToolsMotion();
        setTimeout(()=>{row.dragged=false;},0);
      };
      row.lane.addEventListener('pointerup',release);
      row.lane.addEventListener('pointercancel',release);
      row.lane.addEventListener('lostpointercapture',release);
      row.lane.addEventListener('dragstart',event=>event.preventDefault());
      row.lane.addEventListener('click',event=>{if(row.dragged)event.preventDefault();},true);
      row.lane.querySelectorAll('a:not([tabindex="-1"])').forEach((anchor,i)=>anchor.addEventListener('focus',()=>{
        const cell=anchor.getBoundingClientRect().width;
        row.offset=Math.min(0,row.lane.clientWidth/2-(i+.5)*cell);
        paintToolsRow(row);
      }));
    });
    toolsSection.addEventListener('pointerenter',()=>{toolsHovering=true;refreshToolsMotion();});
    toolsSection.addEventListener('pointerleave',()=>{toolsHovering=false;toolsRows.forEach(row=>{row.dragging=false;});refreshToolsMotion();});
    toolsSection.addEventListener('focusin',event=>{toolsFocused=event.target.classList.contains('tool-logo-link');refreshToolsMotion();});
    toolsSection.addEventListener('focusout',()=>setTimeout(()=>{toolsFocused=toolsSection.contains(document.activeElement)&&document.activeElement.classList.contains('tool-logo-link');refreshToolsMotion();},0));
    new IntersectionObserver(entries=>{toolsVisible=entries[0].isIntersecting;refreshToolsMotion();},{threshold:.05}).observe(toolsSection);
    const introduction="I'm a freelance Architectural & Landscape Designer and Professional Architectural Visualizer based in Palawan, Philippines.";
    const paragraphs=[
      "I began working in the design field in 2015 while completing my Bachelor of Science in Architecture at Palawan State University.",
      "My work includes architectural design, landscape design, master planning, spatial planning, interior design, 3D modeling, and high-quality architectural visualization for residential, commercial, hospitality, and mixed-use projects. I support each project from site analysis and concept development to presentation drawings, photorealistic renderings, and design documentation.",
      "I believe good design begins with understanding the site, the client, and the purpose of the project. My approach combines careful planning, practical design thinking, and clear visual communication to create spaces that are thoughtful, buildable, and connected to their surroundings.",
      "I work independently and collaborate with architects, developers, property owners, interior designers, and multidisciplinary teams. Every project is different, but my goal remains the same: to transform strong ideas into functional, context-driven, and visually engaging spaces."
    ];
    const about=document.querySelector('.home-about');
    about.classList.add('combined-about');
    about.setAttribute('aria-labelledby','about-heading');
    about.querySelector('.about-content').innerHTML=`<header class="about-heading"><p class="eyebrow">The person behind the work</p><h2 id="about-heading">Hi, I’m Nyco.</h2></header><div class="about-biography"><p class="about-lead">${escape(introduction)}</p><div class="about-story story-copy" id="my-story">${paragraphs.map(p=>`<p>${escape(p)}</p>`).join('')}<p class="story-motto">Nurture Concept. Yield Results.</p></div></div>`;
  }

  function setupFocus(projects){
    const p=projects.find(p=>p.id===8)||projects[0];
    if(!p)return;
    const section=document.createElement('section');
    section.className='focus-study editorial-shell';
    section.innerHTML=`<div class="editorial-heading"><div><p class="eyebrow">Design in focus</p><h2>A closer look.</h2></div><span class="section-index">[${String(p.id).padStart(3,'0')}]</span></div><div class="focus-scroll"><div class="focus-sticky"><a class="focus-image" href="${projectURL(p.id)}" aria-label="View ${escape(title(p))}">${picture(p)}<span class="focus-caption"><span>${escape(title(p))}</span><span>Explore this project <span class="action-arrow" aria-hidden="true">↗</span></span></span></a></div></div>`;
    document.querySelector('.home-about').before(section);
    focusScroll=section.querySelector('.focus-scroll');
    focusImage=section.querySelector('.focus-image');
  }

  function setupRollingText(){
    document.querySelectorAll('#main-nav a,.home-intro-actions a,.editorial-text-link').forEach(link=>{
      if(link.querySelector('.roll-window'))return;
      const label=link.textContent.trim();
      if(!link.hasAttribute('aria-label'))link.setAttribute('aria-label',label);
      [...link.childNodes].filter(n=>n.nodeType===Node.TEXT_NODE&&n.textContent.trim()).forEach(node=>{
        const wrapper=document.createElement('span');
        wrapper.className='roll-window';
        wrapper.setAttribute('aria-hidden','true');
        const letters=[...node.textContent.trim()].map((letter,i)=>`<span style="--letter:${Math.min(i,18)}">${letter===' '?'&nbsp;':escape(letter)}</span>`).join('');
        wrapper.innerHTML=`<span class="roll-line">${letters}</span><span class="roll-line roll-copy">${letters}</span>`;
        node.replaceWith(wrapper);
      });
    });
  }

  function setupReveals(){
    const elements=[...document.querySelectorAll('.home-work .editorial-heading h2,.editorial-project,.service-row,.home-about h2,.home-contact h2,.focus-study .editorial-heading h2')];
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}});
    },{threshold:.1,rootMargin:'0px 0px -24px 0px'});
    elements.forEach((element,i)=>{
      element.classList.add('motion-reveal');
      element.style.setProperty('--reveal-delay',`${element.classList.contains('editorial-project')?i%2*80:0}ms`);
      observer.observe(element);
    });
  }

  function setupStatement(){
    const statement=document.querySelector('.about-lead');
    statement.innerHTML=statement.textContent.split(/\s+/).map(word=>`<span class="statement-word">${escape(word)}</span>`).join(' ');
    statementWords=[...statement.children];
  }

  function setupCursor(){
    const cursor=document.createElement('div');
    cursor.className='project-cursor';
    cursor.textContent='[ VIEW PROJECT ]';
    cursor.setAttribute('aria-hidden','true');
    document.body.append(cursor);
    document.addEventListener('pointermove',event=>{
      const active=finePointer.matches&&!reduced&&event.target.closest('.editorial-project-photo,.orbit-card,.focus-image,.service-motion-example');
      cursor.classList.toggle('is-visible',Boolean(active));
      if(active){cursor.style.left=`${event.clientX}px`;cursor.style.top=`${event.clientY}px`;}
    },{passive:true});
    document.addEventListener('pointerleave',()=>cursor.classList.remove('is-visible'));
    window.addEventListener('scroll',()=>cursor.classList.remove('is-visible'),{passive:true});
  }

  function updateScroll(){
    scrollFrame=0;
    const height=innerHeight;
    if(focusScroll){
      const rect=focusScroll.getBoundingClientRect();
      const progress=Math.max(0,Math.min(1,-rect.top/Math.max(1,rect.height-height)));
      focusImage.style.setProperty('--focus-scale',reduced||mobilePreference.matches?1:.68+.32*progress);
    }
    const statement=document.querySelector('.about-lead');
    if(statement){
      const rect=statement.getBoundingClientRect();
      const progress=Math.max(0,Math.min(1,(height*.86-rect.top)/(height*.43+rect.height*.2)));
      statementWords.forEach((word,i)=>word.classList.toggle('is-read',reduced||i/statementWords.length<progress));
    }
  }

  function scheduleScroll(){if(!scrollFrame)scrollFrame=requestAnimationFrame(updateScroll);}

  function updateMotion(){
    reduced=reducedPreference.matches;
    document.body.classList.toggle('motion-reduced',reduced);
    cancelAnimationFrame(wheelFrame);wheelFrame=0;
    if(reduced)document.querySelectorAll('.motion-reveal').forEach(n=>n.classList.add('is-visible'));
    else startWheel();
    refreshToolsMotion();
    updateScroll();
  }

  async function initialize(){
    if(initialized||!document.querySelector('.home-work'))return;
    initialized=true;
    try {
      const response=await fetch(new URL('projects.json',base));
      if(!response.ok)throw new Error('Project data unavailable');
      const projects=await response.json();
      setupOrbit(projects);
      setupAboutPortrait();
      setupToolsAndStory();
      setupServices(projects);
      setupFocus(projects);
      setupRollingText();
      setupStatement();
      setupReveals();
      setupCursor();
      document.body.classList.add('motion-ready');
      updateMotion();
      window.addEventListener('scroll',scheduleScroll,{passive:true});
      window.addEventListener('resize',scheduleScroll,{passive:true});
      window.addEventListener('resize',()=>toolsRows.forEach(paintToolsRow),{passive:true});
      reducedPreference.addEventListener('change',updateMotion);
      mobilePreference.addEventListener('change',updateMotion);
      document.addEventListener('visibilitychange',()=>{
        if(document.hidden){cancelAnimationFrame(wheelFrame);wheelFrame=0;}
        else startWheel();
        refreshToolsMotion();
      });
      if(location.hash){
        await document.fonts.ready;
        document.getElementById(location.hash.slice(1))?.scrollIntoView({behavior:'instant'});
      }
    } catch(error){
      console.error('Motion preview could not initialize',error);
    }
  }
  const observer=new MutationObserver(()=>{if(document.querySelector('.home-work')){observer.disconnect();initialize();}});
  if(document.querySelector('.home-work'))initialize();
  else observer.observe(main,{childList:true});
})();
