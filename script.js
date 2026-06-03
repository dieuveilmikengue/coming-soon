/* ── Countdown ── */
const launch = new Date('2026-07-01T00:00:00');

function pad(n){
  return String(n).padStart(2, '0');
}

function setAndFlip(id, val){
  const el = document.getElementById(id);

  if(el.textContent !== val){
    el.classList.remove('flip');
    void el.offsetWidth;
    el.classList.add('flip');
    el.textContent = val;
  }
}

function tick(){
  const now = new Date();
  const diff = launch - now;

  if(diff <= 0){
    ['cd-days','cd-hours','cd-mins','cd-secs']
      .forEach(id => document.getElementById(id).textContent = '00');
    return;
  }

  setAndFlip('cd-days', pad(Math.floor(diff / 864e5)));
  setAndFlip('cd-hours', pad(Math.floor((diff % 864e5) / 36e5)));
  setAndFlip('cd-mins', pad(Math.floor((diff % 36e5) / 6e4)));
  setAndFlip('cd-secs', pad(Math.floor((diff % 6e4) / 1e3)));

  const start = new Date('2026-01-01');

  const pct = Math.min(
    100,
    Math.max(
      0,
      ((now - start) / (launch - start)) * 100
    )
  );

  document.getElementById('pbar').style.width = pct + '%';
}

tick();
setInterval(tick, 1000);

/* ── Email capture ── */
const notifyBtn = document.getElementById('notify-btn');

notifyBtn.addEventListener('click', notifyMe);

function notifyMe(){
  const inp = document.getElementById('email-input');
  const msg = document.getElementById('sent-msg');
  const wrap = document.getElementById('email-wrap');

  if(!inp.value || !inp.value.includes('@')){
    inp.focus();
    return;
  }

  wrap.style.display = 'none';
  msg.style.display = 'block';

  // TODO : Appel webhook n8n
}

/* ── Particles ── */
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

let W;
let H;
let pts = [];

function resize(){
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

resize();

window.addEventListener('resize', () => {
  resize();
  initPts();
});

function initPts(){
  const count = Math.min(
    80,
    Math.floor(W * H / 11000)
  );

  pts = Array.from({ length: count }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.38,
    vy: (Math.random() - 0.5) * 0.38,
    r: Math.random() * 1.8 + 0.4,
    o: Math.random() * 0.5 + 0.12
  }));
}

initPts();

function draw(){
  ctx.clearRect(0, 0, W, H);

  pts.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;

    if(p.x < 0) p.x = W;
    if(p.x > W) p.x = 0;
    if(p.y < 0) p.y = H;
    if(p.y > H) p.y = 0;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(212,98,26,${p.o})`;
    ctx.fill();
  });

  for(let i = 0; i < pts.length; i++){
    for(let j = i + 1; j < pts.length; j++){
      const dx = pts[i].x - pts[j].x;
      const dy = pts[i].y - pts[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if(dist < 130){
        ctx.beginPath();
        ctx.moveTo(pts[i].x, pts[i].y);
        ctx.lineTo(pts[j].x, pts[j].y);
        ctx.strokeStyle =
          `rgba(212,98,26,${0.14 * (1 - dist / 130)})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(draw);
}

draw();