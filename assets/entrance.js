const entrance = document.querySelector('#campus-entrance');
const frame = entrance.querySelector('.entrance-frame');
const content = document.querySelector('#campus-content');
const header = document.querySelector('#site-header');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const copy = entrance.querySelector('.entrance-copy');
const arrival = entrance.querySelector('.entrance-arrival');
const shade = entrance.querySelector('.entrance-shade');
const flash = entrance.querySelector('.entrance-flash');
const exit = entrance.querySelector('.entrance-exit');
const progressBar = entrance.querySelector('.entrance-progress span');
const topline = entrance.querySelector('.entrance-topline');
const bottom = entrance.querySelector('.entrance-bottom');
const clamp = n => Math.max(0,Math.min(1,n));
const smooth = (a,b,n) => { const t=clamp((n-a)/(b-a)); return t*t*(3-2*t); };
let scene = null, raf = 0, active = false, loading = false, failed = false;
let position = 0, target = 0, start = 0, distance = 1;

function measure() {
  document.body.style.setProperty('--entrance-header', `${header.getBoundingClientRect().height}px`);
  start = entrance.offsetTop - header.getBoundingClientRect().height;
  distance = Math.max(1, entrance.offsetHeight - frame.offsetHeight);
  scene?.resize();
  schedule();
}
function apply(p) {
  content.style.setProperty('--content-reveal', smooth(.85,.97,p));
  content.inert = p < .85;
  const intro = 1 - smooth(.015,.20,p);
  copy.style.opacity = intro;
  copy.style.transform = `translateY(${-p*100}px)`;
  // Prevent keyboard focus from landing on a control after it fades away.
  copy.inert = intro < .05;
  arrival.style.opacity = smooth(.68,.76,p) * (1-smooth(.85,.95,p));
  arrival.style.transform = `scale(${1+Math.max(0,p-.7)*.25})`;
  shade.style.opacity = 1-smooth(.1,.35,p)*.8;
  // Brief light bloom hides the scene boundary without a loading screen.
  flash.style.opacity = smooth(.56,.638,p) * (1-smooth(.646,.71,p));
  exit.style.opacity = smooth(.90,1,p);
  topline.style.opacity = 1-smooth(.08,.25,p);
  bottom.style.opacity = 1-smooth(.9,.98,p);
  bottom.inert = p > .98;
  progressBar.style.transform = `scaleX(${p})`;
}
function tick() {
  raf = 0;
  if (!scene || document.hidden || !active) return;
  target = clamp((window.scrollY-start)/distance);
  // Frame-rate independent damping; catch up immediately after a large jump.
  const now = performance.now();
  const dt = Math.min(64,now-(tick.last || now-16));
  tick.last = now;
  if (Math.abs(target-position) > .35) position = target;
  else position += (target-position)*(1-Math.exp(-dt/75));
  if (Math.abs(target-position)<.0003) position=target;
  apply(position); scene.render(position);
  if (position !== target) raf=requestAnimationFrame(tick);
}
function schedule() {
  if (scene && active && !document.hidden && !raf) raf=requestAnimationFrame(tick);
}
function reset() {
  cancelAnimationFrame(raf); raf=0;
  scene?.dispose(); scene=null;
  entrance.classList.remove('is-ready','is-enhanced');
  for (const element of [copy,arrival,shade,flash,exit,topline,bottom,progressBar]) element.removeAttribute('style');
  copy.inert=false; bottom.inert=false; content.inert=false;
  content.style.removeProperty('--content-reveal');
  measure();
}
async function enhance() {
  if (reducedMotion.matches || loading || scene || failed || navigator.connection?.saveData) return;
  loading=true;
  try {
    // No 3D download or GPU work for reduced motion or data-saving visitors.
    const {createCampusScene}=await import('./campus-scene.js');
    const result=await createCampusScene(entrance.querySelector('.entrance-canvas'),new URL('./images/campus-clean.webp',import.meta.url).href);
    if (reducedMotion.matches) { result.dispose(); return; }
    scene=result;
    scene.canvas.addEventListener('webglcontextlost',event=>{
      event.preventDefault(); failed=true; reset();
    },{once:true});
    // Don't move a visitor who already skipped/read beyond the static hero.
    if (window.scrollY > entrance.offsetTop + entrance.offsetHeight - header.offsetHeight) {
      scene.dispose(); scene=null; return;
    }
    entrance.classList.add('is-enhanced');
    measure();
    position=clamp((window.scrollY-start)/distance);
    apply(position); scene.render(position);
    entrance.classList.add('is-ready');
    schedule();
  } catch (error) {
    failed=true; reset();
    console.warn('Campus entrance: using the still-photo fallback.',error);
  } finally { loading=false; }
}
// The page retains normal wheel, touch, keyboard and browser-history behavior.
window.addEventListener('scroll',schedule,{passive:true});
window.addEventListener('resize',measure,{passive:true});
document.addEventListener('visibilitychange',schedule);
window.addEventListener('pageshow',measure);
new ResizeObserver(measure).observe(header);
new IntersectionObserver(entries=>{
  active=entries[0].isIntersecting;
  if (active) { tick.last=0; schedule(); }
  else { cancelAnimationFrame(raf); raf=0; }
},{rootMargin:'100px'}).observe(entrance);
reducedMotion.addEventListener('change',()=>{
  if (reducedMotion.matches) reset(); else enhance();
});
for (const link of entrance.querySelectorAll('a[href="#campus-content"]')) {
  link.addEventListener('click',event=>{
    event.preventDefault();
    // Instant skip is deliberate: no forced journey for keyboard/touch users.
    if (scene) { position=1; apply(1); scene.render(1); }
    content.scrollIntoView({behavior:'instant',block:'start'});
    content.focus({preventScroll:true});
    history.replaceState(null,'','#campus-content');
  });
}
measure();
// A direct fragment link must land on the content without subsequent layout shift.
if (location.hash !== '#campus-content') enhance();
