
// Cursor
const cur = document.getElementById('cur');
const ring = document.getElementById('cur-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cur.style.left = mx+'px'; cur.style.top = my+'px'; });
(function animRing(){ rx += (mx-rx)*.1; ry += (my-ry)*.1; ring.style.left=rx+'px'; ring.style.top=ry+'px'; requestAnimationFrame(animRing); })();
document.querySelectorAll('a,button,.sched-card,.transport-card,.g-item,.vendor-chip').forEach(el => {
  el.addEventListener('mouseenter', () => { cur.style.width='6px'; cur.style.height='6px'; ring.style.width='50px'; ring.style.height='50px'; });
  el.addEventListener('mouseleave', () => { cur.style.width='10px'; cur.style.height='10px'; ring.style.width='34px'; ring.style.height='34px'; });
});

// Reveal on scroll
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); obs.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el,i) => {
  const delay = parseFloat(el.style.transitionDelay || '0');
  el.style.transitionDelay = delay + 's';
  obs.observe(el);
});

// Vendor tabs
function switchTab(btn, id) {
  document.querySelectorAll('.vtab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.vendor-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(id).classList.add('active');
}

// Falling petal canvas
const canvas = document.getElementById('petalCanvas');
const ctx = canvas.getContext('2d');
let petals = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

function makePetal() {
  return {
    x: Math.random() * canvas.width,
    y: -20,
    r: Math.random() * 5 + 3,
    vx: (Math.random() - 0.5) * 0.8,
    vy: Math.random() * 1.2 + 0.4,
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.04,
    alpha: Math.random() * 0.5 + 0.2,
    color: Math.random() > 0.5 ? '#f2a7c3' : '#d4608e'
  };
}

for(let i = 0; i < 40; i++) {
  const p = makePetal();
  p.y = Math.random() * canvas.height;
  petals.push(p);
}

function drawPetal(p) {
  ctx.save();
  ctx.globalAlpha = p.alpha;
  ctx.translate(p.x, p.y);
  ctx.rotate(p.angle);
  ctx.beginPath();
  ctx.ellipse(0, 0, p.r, p.r * 0.55, 0, 0, Math.PI * 2);
  ctx.fillStyle = p.color;
  ctx.fill();
  ctx.restore();
}

function tick() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  petals.forEach(p => {
    p.x += p.vx + Math.sin(p.y * 0.01) * 0.3;
    p.y += p.vy;
    p.angle += p.spin;
    drawPetal(p);
    if(p.y > canvas.height + 20) {
      Object.assign(p, makePetal());
    }
  });
  requestAnimationFrame(tick);
}
tick();

  // Photo Grid Lightbox
  const lbSrcs  = ['img/gallery-blossoms-after-dark-crowd.jpg', 'img/gallery-led-ring-performer.jpg', 'img/gallery-fairy-performer.jpg', 'img/gallery-lantern-discovery.jpg', 'img/gallery-cherry-jam-stage.jpg'];
  const lbDescs = ['Blossoms After Dark Crowd', 'LED Ring Performer', 'Fairy Performer', 'Lantern Discovery', 'Cherry Jam Stage'];
  let lbIdx = 0;

  function openLightbox(idx) {
    lbIdx = idx;
    document.getElementById('lbImg').src = lbSrcs[idx];
    document.getElementById('lbCaption').textContent = lbDescs[idx];
    document.getElementById('lb').classList.add('active');
    document.body.style.overflow = 'hidden';
    updateLbDots();
  }

  function closeLightbox(e) {
    if (e && e.target !== document.getElementById('lb') && !e.target.closest('.lb-close')) return;
    document.getElementById('lb').classList.remove('active');
    document.body.style.overflow = '';
  }

  function lbNav(dir, e) {
    if (e) e.stopPropagation();
    lbIdx = (lbIdx + dir + lbSrcs.length) % lbSrcs.length;
    const img = document.getElementById('lbImg');
    img.style.opacity = '0';
    setTimeout(() => {
      img.src = lbSrcs[lbIdx];
      document.getElementById('lbCaption').textContent = lbDescs[lbIdx];
      img.style.opacity = '1';
    }, 150);
    updateLbDots();
  }

  function setLbIdx(i, e) {
    if (e) e.stopPropagation();
    lbIdx = i;
    const img = document.getElementById('lbImg');
    img.style.opacity = '0';
    setTimeout(() => {
      img.src = lbSrcs[lbIdx];
      document.getElementById('lbCaption').textContent = lbDescs[lbIdx];
      img.style.opacity = '1';
    }, 150);
    updateLbDots();
  }

  function updateLbDots() {
    document.querySelectorAll('.lb-dot').forEach((d, i) => {
      d.classList.toggle('on', i === lbIdx);
    });
  }

  document.addEventListener('keydown', e => {
    if (!document.getElementById('lb').classList.contains('active')) return;
    if (e.key === 'ArrowLeft')  lbNav(-1, null);
    if (e.key === 'ArrowRight') lbNav(1, null);
    if (e.key === 'Escape') { document.getElementById('lb').classList.remove('active'); document.body.style.overflow=''; }
  });

  (function() {
    const lb = document.getElementById('lb');
    if (!lb) return;
    let sx = 0;
    lb.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, {passive:true});
    lb.addEventListener('touchend',   e => {
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) lbNav(dx < 0 ? 1 : -1, null);
    }, {passive:true});
  })();
