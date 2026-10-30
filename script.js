/* =========================================================
   MOHAMED WASIM — AI ENGINEER PORTFOLIO
   Vanilla JS — no frameworks
   ========================================================= */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(hover: none), (max-width: 860px)').matches;

/* ---------------------------------------------------------
   1. PRELOADER
   --------------------------------------------------------- */
(function preloader(){
  const pre = document.getElementById('preloader');
  const fill = document.getElementById('preloaderFill');
  const pct = document.getElementById('preloaderPercent');
  const netGroup = document.getElementById('preloaderNet');

  // Build a tiny animated neural-net graphic for the preloader
  const layers = [3, 4, 3];
  const pts = [];
  layers.forEach((count, li) => {
    const x = 30 + li * 90;
    for(let i=0;i<count;i++){
      const y = 40 + i * (160/(count-1||1));
      pts.push({x,y,li});
    }
  });
  pts.forEach((p,i) => {
    pts.forEach(q => {
      if(q.li === p.li+1){
        const line = document.createElementNS('http://www.w3.org/2000/svg','line');
        line.setAttribute('x1',p.x); line.setAttribute('y1',p.y);
        line.setAttribute('x2',q.x); line.setAttribute('y2',q.y);
        netGroup.appendChild(line);
      }
    });
  });
  pts.forEach(p => {
    const c = document.createElementNS('http://www.w3.org/2000/svg','circle');
    c.setAttribute('cx',p.x); c.setAttribute('cy',p.y); c.setAttribute('r',5);
    netGroup.appendChild(c);
  });

  let progress = 0;
  const target = 100;
  const tick = () => {
    progress += Math.random()*9 + 4;
    if(progress >= target){
      progress = target;
      fill.style.width = '100%';
      pct.textContent = '100%';
      setTimeout(()=>{
        pre.classList.add('done');
        document.body.style.overflow='';
        startPageAnimations();
      }, 350);
      return;
    }
    fill.style.width = progress + '%';
    pct.textContent = Math.floor(progress) + '%';
    setTimeout(tick, 120 + Math.random()*120);
  };
  document.body.style.overflow = 'hidden';
  setTimeout(tick, 300);

  // Safety net: never block the site for more than 4s
  setTimeout(()=>{
    if(!pre.classList.contains('done')){
      pre.classList.add('done');
      document.body.style.overflow='';
      startPageAnimations();
    }
  }, 4000);
})();

/* ---------------------------------------------------------
   2. CUSTOM STAR CURSOR + SPARKLE TRAIL
   --------------------------------------------------------- */
if(!isTouch){
  const star = document.getElementById('cursorStar');
  const glow = document.getElementById('cursorGlow');
  const canvas = document.getElementById('sparkleCanvas');
  const ctx = canvas.getContext('2d');

  function resizeCanvas(){ canvas.width = innerWidth; canvas.height = innerHeight; }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  let mouseX = innerWidth/2, mouseY = innerHeight/2;
  let starX = mouseX, starY = mouseY; // lagging "magnetic" position
  let glowX = mouseX, glowY = mouseY;
  let particles = [];

  window.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    if(Math.random() > 0.55){
      particles.push({
        x: mouseX, y: mouseY,
        vx: (Math.random()-0.5)*1.2,
        vy: (Math.random()-0.5)*1.2 - 0.4,
        life: 1,
        size: Math.random()*2.5 + 1.5,
        hue: ['#00E5FF','#8B5CF6','#EC4899','#FACC15'][Math.floor(Math.random()*4)]
      });
    }
  });

  window.addEventListener('mousedown', ()=> star.classList.add('click'));
  window.addEventListener('mouseup', ()=> star.classList.remove('click'));

  // Magnetic pull toward interactive elements
  let magnetTarget = null;
  document.querySelectorAll('.magnetic, .btn, .nav-link, .social-icon, .chip, .node').forEach(el=>{
    el.addEventListener('mouseenter', ()=>{ magnetTarget = el; });
    el.addEventListener('mouseleave', ()=>{ if(magnetTarget===el) magnetTarget=null; });
  });
  document.querySelectorAll('[data-tilt], .project-card, .cert-card, .bento-card, .ai-chat-card').forEach(el=>{
    el.addEventListener('mouseenter', ()=> star.classList.add('hover-card'));
    el.addEventListener('mouseleave', ()=> star.classList.remove('hover-card'));
  });
  document.querySelectorAll('a, button, .node').forEach(el=>{
    el.addEventListener('mouseenter', ()=> star.classList.add('hover-link'));
    el.addEventListener('mouseleave', ()=> star.classList.remove('hover-link'));
  });

  function animateCursor(){
    let tx = mouseX, ty = mouseY;
    if(magnetTarget){
      const r = magnetTarget.getBoundingClientRect();
      tx = r.left + r.width/2;
      ty = r.top + r.height/2;
    }
    starX += (tx - starX) * 0.22;
    starY += (ty - starY) * 0.22;
    glowX += (mouseX - glowX) * 0.14;
    glowY += (mouseY - glowY) * 0.14;

    star.style.transform = `translate(${starX}px, ${starY}px) translate(-50%,-50%)`;
    glow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%,-50%)`;

    // particles
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p=>{
      p.x += p.vx; p.y += p.vy; p.life -= 0.018;
      ctx.globalAlpha = Math.max(p.life,0);
      ctx.fillStyle = p.hue;
      ctx.shadowColor = p.hue; ctx.shadowBlur = 8;
      drawStarShape(ctx, p.x, p.y, p.size);
    });
    particles = particles.filter(p=>p.life>0);
    ctx.globalAlpha = 1; ctx.shadowBlur = 0;

    requestAnimationFrame(animateCursor);
  }
  function drawStarShape(ctx,x,y,s){
    ctx.beginPath();
    for(let i=0;i<5;i++){
      const a = (Math.PI*2*i)/5 - Math.PI/2;
      const xa = x + Math.cos(a)*s, ya = y + Math.sin(a)*s;
      const a2 = a + Math.PI/5;
      const xb = x + Math.cos(a2)*(s*0.45), yb = y + Math.sin(a2)*(s*0.45);
      if(i===0) ctx.moveTo(xa,ya); else ctx.lineTo(xa,ya);
      ctx.lineTo(xb,yb);
    }
    ctx.closePath(); ctx.fill();
  }
  animateCursor();
}

/* ---------------------------------------------------------
   3. RIPPLE ON BUTTONS
   --------------------------------------------------------- */
document.querySelectorAll('.btn').forEach(btn=>{
  btn.addEventListener('click', function(e){
    const rect = this.getBoundingClientRect();
    const r = document.createElement('span');
    r.className='ripple';
    r.style.left = (e.clientX-rect.left)+'px';
    r.style.top = (e.clientY-rect.top)+'px';
    this.appendChild(r);
    setTimeout(()=>r.remove(),650);
  });
});

/* ---------------------------------------------------------
   4. MAGNETIC BUTTON OFFSET (subtle pull toward cursor)
   --------------------------------------------------------- */
if(!isTouch){
  document.querySelectorAll('.magnetic').forEach(el=>{
    el.addEventListener('mousemove', e=>{
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width/2;
      const y = e.clientY - r.top - r.height/2;
      el.style.transform = `translate(${x*0.18}px, ${y*0.35}px)`;
    });
    el.addEventListener('mouseleave', ()=>{ el.style.transform=''; });
  });
}

/* ---------------------------------------------------------
   5. NAVBAR — scroll state, active link, mobile menu
   --------------------------------------------------------- */
const navbar = document.getElementById('navbar');
const navLinks = document.getElementById('navLinks');
const navBurger = document.getElementById('navBurger');

window.addEventListener('scroll', ()=>{
  navbar.classList.toggle('scrolled', window.scrollY > 30);
  updateScrollProgress();
  updateActiveNav();
}, { passive:true });

navBurger.addEventListener('click', ()=>{
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a=>{
  a.addEventListener('click', ()=> navLinks.classList.remove('open'));
});

const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');
function updateActiveNav(){
  let current = sections[0]?.id;
  sections.forEach(sec=>{
    const top = sec.getBoundingClientRect().top;
    if(top < window.innerHeight*0.4) current = sec.id;
  });
  navItems.forEach(a=> a.classList.toggle('active', a.dataset.nav === current));
}

/* ---------------------------------------------------------
   6. SCROLL PROGRESS BAR
   --------------------------------------------------------- */
const scrollProgress = document.getElementById('scrollProgress');
function updateScrollProgress(){
  const h = document.documentElement;
  const pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
  scrollProgress.style.width = pct + '%';
}

/* ---------------------------------------------------------
   7. RESUME BUTTON PLACEHOLDER NOTICE
   --------------------------------------------------------- */
['resumeBtn','resumeBtnHero'].forEach(id=>{
  const el = document.getElementById(id);
  if(el) el.addEventListener('click', e=>{
    if(el.getAttribute('href') === '#'){
      e.preventDefault();
      alert('Add your resume PDF link here — replace the href on the Resume button (#resumeBtn / #resumeBtnHero) in index.html.');
    }
  });
});

/* ---------------------------------------------------------
   8. BACK TO TOP + FOOTER YEAR
   --------------------------------------------------------- */
document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('backToTop').addEventListener('click', ()=>{
  window.scrollTo({ top:0, behavior: reduceMotion ? 'auto' : 'smooth' });
});

/* ---------------------------------------------------------
   9. SCROLL REVEAL (IntersectionObserver)
   --------------------------------------------------------- */
const revealEls = document.querySelectorAll('.reveal-up, .hero-title');
const revealObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el=> revealObserver.observe(el));

/* ---------------------------------------------------------
   10. ANIMATED COUNTERS
   --------------------------------------------------------- */
function animateCounter(el){
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1400;
  const start = performance.now();
  function frame(now){
    const p = Math.min((now-start)/duration, 1);
    const eased = 1 - Math.pow(1-p, 3);
    el.textContent = Math.floor(eased*target) + suffix;
    if(p < 1) requestAnimationFrame(frame);
    else el.textContent = target + suffix;
  }
  requestAnimationFrame(frame);
}
const counterObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('.stat-num, .counter-big').forEach(el=> counterObserver.observe(el));

/* ---------------------------------------------------------
   11. HERO TAGLINE TYPEWRITER ROTATOR
   --------------------------------------------------------- */
const taglines = [
  'Aspiring Full Stack Developer',
  'Quick learner, problem solver, and AI enthusiast.',
  'Iot and AI enthusiast.',
  'Aspiring ML Engineer.'
];
const rotatorEl = document.getElementById('rotatorText');
let tIdx = 0, cIdx = 0, deleting = false;
function typeLoop(){
  const word = taglines[tIdx];
  if(!deleting){
    cIdx++;
    rotatorEl.textContent = word.slice(0, cIdx);
    if(cIdx === word.length){ deleting = true; setTimeout(typeLoop, 1800); return; }
  } else {
    cIdx--;
    rotatorEl.textContent = word.slice(0, cIdx);
    if(cIdx === 0){ deleting=false; tIdx = (tIdx+1)%taglines.length; setTimeout(typeLoop, 300); return; }
  }
  setTimeout(typeLoop, deleting ? 30 : 55);
}

/* ---------------------------------------------------------
   12. HERO CANVAS — neural network particle field
   --------------------------------------------------------- */
function initHeroCanvas(){
  const canvas = document.getElementById('heroCanvas');
  const ctx = canvas.getContext('2d');
  let w,h,nodes;
  function size(){
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }
  function makeNodes(){
    const count = Math.min(Math.floor((w*h)/16000), 70);
    nodes = Array.from({length: count}, ()=>({
      x: Math.random()*w, y: Math.random()*h,
      vx: (Math.random()-0.5)*0.25, vy: (Math.random()-0.5)*0.25,
      r: Math.random()*1.6 + 0.6
    }));
  }
  size(); makeNodes();
  window.addEventListener('resize', ()=>{ size(); makeNodes(); });

  const colors = ['rgba(139,92,246,', 'rgba(0,229,255,', 'rgba(236,72,153,'];
  function draw(){
    ctx.clearRect(0,0,w,h);
    nodes.forEach(n=>{
      n.x += n.vx; n.y += n.vy;
      if(n.x<0||n.x>w) n.vx*=-1;
      if(n.y<0||n.y>h) n.vy*=-1;
    });
    for(let i=0;i<nodes.length;i++){
      for(let j=i+1;j<nodes.length;j++){
        const a=nodes[i], b=nodes[j];
        const d = Math.hypot(a.x-b.x, a.y-b.y);
        if(d < 130){
          ctx.strokeStyle = `rgba(0,229,255,${(1-d/130)*0.18})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
        }
      }
    }
    nodes.forEach((n,i)=>{
      ctx.beginPath();
      ctx.fillStyle = colors[i%colors.length] + '0.8)';
      ctx.arc(n.x,n.y,n.r,0,Math.PI*2);
      ctx.fill();
    });
    if(!reduceMotion) requestAnimationFrame(draw);
  }
  draw();
}

/* ---------------------------------------------------------
   13. TILT EFFECT for [data-tilt] elements
   --------------------------------------------------------- */
if(!isTouch){
  document.querySelectorAll('[data-tilt]').forEach(el=>{
    el.addEventListener('mousemove', e=>{
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left)/r.width - 0.5;
      const py = (e.clientY - r.top)/r.height - 0.5;
      el.style.transform = `perspective(900px) rotateX(${(-py*7).toFixed(2)}deg) rotateY(${(px*9).toFixed(2)}deg) translateY(-4px)`;
    });
    el.addEventListener('mouseleave', ()=>{ el.style.transform = ''; });
  });
}

/* ---------------------------------------------------------
   14. SKILLS CONSTELLATION — connecting lines + tooltip
   --------------------------------------------------------- */
function initSkillsConstellation(){
  const wrap = document.getElementById('skillsConstellation');
  const svg = document.getElementById('constellationLines');
  const tooltip = document.getElementById('skillTooltip');
  const tipName = tooltip.querySelector('.skill-tooltip-name');
  const tipFill = document.getElementById('skillTooltipFill');
  const tipLevel = document.getElementById('skillTooltipLevel');
  if(!wrap) return;

  function drawLines(){
    if(window.innerWidth <= 760){ svg.innerHTML=''; return; }
    const rect = wrap.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`);
    svg.innerHTML = '';
    const clusters = wrap.querySelectorAll('.cluster');
    const centers = [];
    clusters.forEach(c=>{
      const nodes = c.querySelectorAll('.node');
      const pts = [];
      nodes.forEach(n=>{
        const r = n.getBoundingClientRect();
        pts.push({ x: r.left + r.width/2 - rect.left, y: r.top + r.height/2 - rect.top });
      });
      // connect nodes within the same cluster sequentially (constellation feel)
      for(let i=0;i<pts.length-1;i++){
        addLine(pts[i], pts[i+1]);
      }
      if(pts.length) centers.push(pts[0]);
    });
    // connect cluster anchors lightly to hint at a shared graph
    for(let i=0;i<centers.length;i++){
      const a = centers[i], b = centers[(i+1)%centers.length];
      addLine(a,b,0.12);
    }
    function addLine(a,b,opacity){
      const line = document.createElementNS('http://www.w3.org/2000/svg','line');
      line.setAttribute('x1',a.x); line.setAttribute('y1',a.y);
      line.setAttribute('x2',b.x); line.setAttribute('y2',b.y);
      if(opacity) line.style.stroke = `rgba(0,229,255,${opacity})`;
      svg.appendChild(line);
    }
  }
  drawLines();
  window.addEventListener('resize', drawLines);

  wrap.querySelectorAll('.node').forEach(node=>{
    node.addEventListener('mousemove', e=>{
      const wrapRect = wrap.getBoundingClientRect();
      tooltip.style.left = (e.clientX - wrapRect.left) + 'px';
      tooltip.style.top = (e.clientY - wrapRect.top) + 'px';
    });
    node.addEventListener('mouseenter', ()=>{
      const level = node.dataset.level;
      tipName.textContent = node.dataset.skill;
      tipLevel.textContent = level + '%';
      tooltip.classList.add('show');
      requestAnimationFrame(()=> tipFill.style.width = level + '%');
    });
    node.addEventListener('mouseleave', ()=>{
      tooltip.classList.remove('show');
      tipFill.style.width = '0%';
    });
  });
}

/* ---------------------------------------------------------
   15. PROJECTS — drag-to-scroll horizontal track
   --------------------------------------------------------- */
function initProjectDrag(){
  const wrap = document.querySelector('.project-track-wrap');
  if(!wrap) return;
  let isDown=false, startX=0, scrollStart=0, moved=false;

  const start = (x)=>{ isDown=true; moved=false; startX=x; scrollStart=wrap.scrollLeft; wrap.classList.add('dragging'); };
  const move = (x)=>{
    if(!isDown) return;
    const dx = x - startX;
    if(Math.abs(dx) > 4) moved = true;
    wrap.scrollLeft = scrollStart - dx;
  };
  const end = ()=>{ isDown=false; wrap.classList.remove('dragging'); };

  wrap.addEventListener('mousedown', e=> start(e.pageX));
  window.addEventListener('mousemove', e=> move(e.pageX));
  window.addEventListener('mouseup', end);

  wrap.addEventListener('touchstart', e=> start(e.touches[0].pageX), {passive:true});
  wrap.addEventListener('touchmove', e=> move(e.touches[0].pageX), {passive:true});
  wrap.addEventListener('touchend', end);

  // Prevent accidental link click after a drag
  wrap.querySelectorAll('a').forEach(a=>{
    a.addEventListener('click', e=>{ if(moved) e.preventDefault(); });
  });

  // mouse wheel -> horizontal scroll
  wrap.addEventListener('wheel', e=>{
    if(Math.abs(e.deltaY) > Math.abs(e.deltaX)){
      wrap.scrollLeft += e.deltaY;
      e.preventDefault();
    }
  }, { passive:false });
}

/* ---------------------------------------------------------
   16. EXPERIENCE TIMELINE — beam fill on scroll
   --------------------------------------------------------- */
function initTimelineBeam(){
  const timeline = document.getElementById('timeline');
  const fill = document.getElementById('timelineBeamFill');
  if(!timeline) return;
  function update(){
    const rect = timeline.getBoundingClientRect();
    const vh = window.innerHeight;
    const total = rect.height;
    const visible = Math.min(Math.max(vh*0.6 - rect.top, 0), total);
    fill.style.height = (visible/total*100) + '%';
  }
  window.addEventListener('scroll', update, { passive:true });
  update();
}

/* ---------------------------------------------------------
   17. CONTACT FORM — client-side only (no backend wired up)
   --------------------------------------------------------- */
function initContactForm(){
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const btnText = document.getElementById('contactBtnText');
  if(!form) return;
  form.addEventListener('submit', e=>{
    e.preventDefault();
    btnText.textContent = 'Sending...';
    setTimeout(()=>{
      btnText.textContent = 'Send Message';
      status.textContent = 'Thanks — this demo form isn\u2019t wired to a backend yet. Connect it to your email service or a form API (e.g. Formspree) to go live.';
      form.reset();
    }, 900);
  });
}

/* ---------------------------------------------------------
   18. AI ASSISTANT CARD — canned rule-based replies
   --------------------------------------------------------- */
function initAiChat(){
  const body = document.getElementById('aiChatBody');
  const chipsWrap = document.getElementById('aiChatChips');
  if(!body) return;
  const answers = {
    stack: "Python, TensorFlow &amp; PyTorch for modeling, OpenCV for vision, and JavaScript/Node + Flutter for shipping the product layer.",
    intern: "Yes — actively looking for AI/ML engineering internships and full-time new-grad roles. [EDIT: confirm availability dates here].",
    resume: "Hit the \u201cResume\u201d button in the navbar — [EDIT: link it to your hosted PDF].",
    project: "VisionGuard, a real-time object detection system — it's the one that took the most debugging and taught me the most about latency."
  };
  chipsWrap.querySelectorAll('.chip').forEach(chip=>{
    chip.addEventListener('click', ()=>{
      const q = chip.dataset.q;
      const userMsg = document.createElement('div');
      userMsg.className = 'ai-msg ai-msg-user';
      userMsg.textContent = chip.textContent;
      body.appendChild(userMsg);

      chip.disabled = true;

      const botMsg = document.createElement('div');
      botMsg.className = 'ai-msg ai-msg-bot';
      botMsg.innerHTML = '<span class="rotator-cursor">|</span>';
      body.appendChild(botMsg);
      body.scrollTop = body.scrollHeight;

      setTimeout(()=>{
        botMsg.innerHTML = answers[q] || "I don't have an answer for that yet.";
        body.scrollTop = body.scrollHeight;
      }, 500);
    });
  });
}

/* ---------------------------------------------------------
   19. KICK EVERYTHING OFF (called once preloader finishes)
   --------------------------------------------------------- */
function startPageAnimations(){
  document.querySelectorAll('.hero .reveal-up, .hero-title').forEach(el=> el.classList.add('in-view'));
  typeLoop();
  initHeroCanvas();
  initSkillsConstellation();
  initProjectDrag();
  initTimelineBeam();
  initContactForm();
  initAiChat();
  updateActiveNav();
  updateScrollProgress();
}