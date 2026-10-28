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
  let wheelFrame = 0;
  let wheelVisible = false;
  let wheelHovering = false;
  let angle = -18;
  let targetAngle = angle;
  let tiltX = 0;
  let tiltY = 0;
  let targetTiltX = 0;
  let targetTiltY = 0;
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
  let toolsSection;
  let toolsRows = [];
  let toolsFrame = 0;
  let toolsVisible = false;
  let toolsHovering = false;
  let toolsFocused = false;
  let toolsLastTime = 0;
  let scrollFrame = 0;
  let statementWords = [];
  let projectCursor;
  let mobileOpeningDismissed = false;
  document.addEventListener('portfolio:opening', () => {
    mobileOpeningDismissed = false;
    angle = targetAngle = -18;
    tiltX = tiltY = targetTiltX = targetTiltY = 0;
    dragging = dragged = wheelHovering = false;
    idleUntil = previousTime = 0;
    scene?.classList.remove('is-dragging');
    paintWheel();
    updateStatement();
  });

  function picture(p, className = '') {
    return `<img class="${className}" src="${assetURL(`project-${p.id}-680.jpg`)}" srcset="${assetURL(`project-${p.id}-680.jpg`)} 680w, ${assetURL(`project-${p.id}-1280.jpg`)} 1280w" sizes="(max-width: 799px) 82vw, 500px" width="680" height="486" alt="${escape(title(p))} design visualization" loading="lazy" decoding="async">`;
  }

  function paintWheel() {
    if (wheel) wheel.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) rotateX(-18deg) rotateZ(-8deg) rotateY(${angle}deg)`;
  }

  function runWheel(time) {
    wheelFrame = 0;
    if (!wheelVisible || reduced || document.hidden || orbit?.inert) return;
    const delta = previousTime ? Math.min(time - previousTime, 50) : 0;
    previousTime = time;
    const focused = wheel.contains(document.activeElement);
    if (!dragging && !focused && !wheelHovering && time > idleUntil) targetAngle -= delta * .006;
    if (!dragging) angle += (targetAngle - angle) * .1;
    tiltX += (targetTiltX - tiltX) * .12;
    tiltY += (targetTiltY - tiltY) * .12;
    paintWheel();
    wheelFrame = requestAnimationFrame(runWheel);
  }

  function startWheel() {
    if (!wheelFrame && wheelVisible && !reduced) {
      previousTime = 0;
      wheelFrame = requestAnimationFrame(runWheel);
    }
  }

  function rotate(direction) {
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
    document.addEventListener('pointermove', event => {
      if (!wheelVisible || !finePointer.matches || reduced || mobilePreference.matches || dragging || event.pointerType === 'touch') return;
      const rect = scene.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, (event.clientX - rect.left - rect.width / 2) / (rect.width / 2)));
      const y = Math.max(-1, Math.min(1, (event.clientY - rect.top - rect.height / 2) / (rect.height / 2)));
      targetTiltX = -y * 10;
      targetTiltY = x * 14;
      startWheel();
    }, {passive:true});

    scene.addEventListener('pointerenter',event=>{if(event.pointerType!=='touch')wheelHovering=true;});
    scene.addEventListener('pointerleave',()=>{wheelHovering=false;});
    scene.addEventListener('keydown',event=>{
      if(!['ArrowLeft','ArrowRight'].includes(event.key))return;
      event.preventDefault();
      rotate(event.key==='ArrowLeft'?-1:1);
    });
    scene.addEventListener('pointerdown',event=>{
      if (event.button!==0) return;
      wheelHovering=false;
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
      targetTiltX = targetTiltY = 0;
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
    if(portraitImage)portraitImage.sizes='(max-width: 359px) 120px, (max-width: 799px) 160px, (max-width: 1199px) 32vw, (max-width: 1421px) 38vw, 540px';
    about.replaceChildren(content,portrait);
    about.classList.add('combined-about');
    intro.classList.add('intro-with-orbit');
  }

  function setupServices(projects) {
    const projectIds=[11,8,4,1];
    document.querySelectorAll('.service-row').forEach((row,index)=>{
      row.addEventListener('toggle',()=>{
        if(!row.open||!mobilePreference.matches)return;
        document.querySelectorAll('.service-row[open]').forEach(other=>{if(other!==row)other.open=false;});
      });
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

  }

  function setupFocus(projects){
    const p=projects.find(p=>p.id===8);
    if(!p)return;
    const section=document.createElement('section');
    section.className='focus-study editorial-shell';
    section.innerHTML=`<div class="editorial-heading"><h2>Planting for a coastal site.</h2><span class="section-index">[${String(p.id).padStart(3,'0')}]</span></div><div class="focus-scroll"><div class="focus-sticky"><div class="focus-project"><a class="focus-image" href="${projectURL(p.id)}" aria-label="View ${escape(title(p))}">${picture(p)}<span class="focus-caption"><span>${escape(title(p))}</span><span>Explore this project <span class="action-arrow" aria-hidden="true">↗</span></span></span></a><p class="focus-detail">For this beachfront property in San Vicente, the planting strategy pairs salt-tolerant shoreline groundcovers with layered planting around the house and casitas. Deep-rooted shrubs, groundcovers, and canopy trees address the driveway slopes.</p></div></div></div>`;
    document.querySelector('.home-about').before(section);
  }

  function setupRollingText(){
    document.querySelectorAll('#main-nav a,.home-intro-actions a,.editorial-text-link,.outline-index-link,.all-projects>summary').forEach(link=>{
      if(link.querySelector('.roll-window'))return;
      if(!link.hasAttribute('aria-label'))link.setAttribute('aria-label',link.textContent.trim());
      [...link.childNodes].filter(node=>node.nodeType===Node.TEXT_NODE&&node.textContent.trim()).forEach(node=>{
        const wrapper=document.createElement('span');
        wrapper.className='roll-window';
        wrapper.setAttribute('aria-hidden','true');
        const letters=[...node.textContent.trim()].map((letter,index)=>`<span style="--letter:${Math.min(index,16)}">${letter===' '?'&nbsp;':escape(letter)}</span>`).join('');
        wrapper.innerHTML=`<span class="roll-line">${letters}</span><span class="roll-line roll-copy">${letters}</span>`;
        node.replaceWith(wrapper);
      });
    });
  }

  function setupReveals(){
    if(!('IntersectionObserver' in window))return;
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}
      });
    },{threshold:.08,rootMargin:'0px 0px -16px 0px'});
    document.querySelectorAll('.home-work .editorial-heading h2,.editorial-project,.service-row,.home-about h2,.home-contact h2,.focus-study .editorial-heading h2').forEach((element,index)=>{
      element.classList.add('motion-reveal');
      element.style.setProperty('--reveal-delay',`${element.classList.contains('editorial-project')?index%2*55:0}ms`);
      if(reduced)element.classList.add('is-visible');
      else observer.observe(element);
      element.addEventListener('focusin',()=>element.classList.add('is-visible'));
    });
  }

  function setupStatement(){
    const statement=document.querySelector('.about-lead');
    if(!statement)return;
    const text=statement.textContent;
    statement.innerHTML=`<span class="statement-accessible">${escape(text)}</span>`+text.split(/\s+/).map(word=>`<span class="statement-word" aria-hidden="true">${escape(word)}</span>`).join(' ');
    statementWords=[...statement.querySelectorAll('.statement-word')];
  }

  function setupCursor(){
    const cursor=document.createElement('div');
    cursor.className='project-cursor';
    cursor.textContent='[ View project ]';
    cursor.setAttribute('aria-hidden','true');
    document.body.append(cursor);
    let frame=0,active=false,x=0,y=0,targetX=0,targetY=0;
    const paint=()=>{
      frame=0;
      if(!active||reduced||!finePointer.matches||document.hidden)return;
      x+=(targetX-x)*.24;
      y+=(targetY-y)*.24;
      cursor.style.setProperty('--cursor-x',`${x}px`);
      cursor.style.setProperty('--cursor-y',`${y}px`);
      if(Math.abs(targetX-x)+Math.abs(targetY-y)>.2)frame=requestAnimationFrame(paint);
    };
    const hide=()=>{active=false;cursor.classList.remove('is-visible');cancelAnimationFrame(frame);frame=0;};
    projectCursor={hide};
    document.addEventListener('pointermove',event=>{
      if(event.pointerType==='touch'||!finePointer.matches||reduced||!event.target.closest('.editorial-project-photo,.orbit-card,.focus-image,.service-motion-example')){hide();return;}
      targetX=Math.max(cursor.offsetWidth/2+8,Math.min(innerWidth-cursor.offsetWidth/2-8,event.clientX));
      targetY=Math.max(cursor.offsetHeight*1.5+8,event.clientY);
      if(!active){x=targetX;y=targetY;}
      active=true;
      cursor.classList.add('is-visible');
      if(!frame)paint();
    },{passive:true});
    document.addEventListener('pointerleave',hide);
    window.addEventListener('scroll',hide,{passive:true});
    window.addEventListener('blur',hide);
    document.addEventListener('visibilitychange',()=>{if(document.hidden)hide();});
  }

  function updateStatement(){
    scrollFrame=0;
    if(orbit){
      if(mobilePreference.matches&&window.scrollY>8)mobileOpeningDismissed=true;
      const hidden=mobilePreference.matches&&mobileOpeningDismissed;
      document.body.classList.toggle('mobile-intro-dismissed',hidden);
      orbit.style.setProperty('--mobile-orbit-opacity',hidden?'0':'1');
      orbit.inert=hidden;
      if(!orbit.inert)startWheel();
    }
    const statement=document.querySelector('.about-lead');
    if(!statement)return;
    const rect=statement.getBoundingClientRect();
    const progress=Math.max(0,Math.min(1,(innerHeight*.88-rect.top)/(innerHeight*.36+rect.height*.3)));
    statementWords.forEach((word,index)=>word.classList.toggle('is-read',reduced||index/statementWords.length<progress));
  }

  function scheduleStatement(){if(!scrollFrame)scrollFrame=requestAnimationFrame(updateStatement);}

  function updateMotion(){
    reduced=reducedPreference.matches;
    document.body.classList.toggle('motion-reduced',reduced);
    if (reduced || mobilePreference.matches || !finePointer.matches) {
      tiltX = tiltY = targetTiltX = targetTiltY = 0;
      paintWheel();
    }
    cancelAnimationFrame(wheelFrame);wheelFrame=0;
    if(!reduced)startWheel();
    refreshToolsMotion();
    if(reduced){
      document.querySelectorAll('.motion-reveal').forEach(element=>element.classList.add('is-visible'));
    }
    if(reduced||!finePointer.matches||mobilePreference.matches)projectCursor?.hide();
    updateStatement();
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
      window.addEventListener('scroll',scheduleStatement,{passive:true});
      window.addEventListener('resize',scheduleStatement,{passive:true});
      window.addEventListener('resize',()=>toolsRows.forEach(paintToolsRow),{passive:true});
      reducedPreference.addEventListener('change',updateMotion);
      mobilePreference.addEventListener('change',updateMotion);
      finePointer.addEventListener('change',updateMotion);
      document.addEventListener('visibilitychange',()=>{
        if(document.hidden){cancelAnimationFrame(wheelFrame);wheelFrame=0;}
        else startWheel();
        refreshToolsMotion();
      });
      if(location.hash){
        await document.fonts.ready;
        scrollToSectionHash(location.hash);
      }
    } catch(error){
      console.error('Motion preview could not initialize',error);
    }
  }
  if(document.body.dataset.pageReady === 'true')initialize();
  else document.addEventListener('portfolio:ready',initialize,{once:true});
})();
