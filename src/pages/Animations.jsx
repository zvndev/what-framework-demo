import { signal, effect, useRef } from 'what-framework';

function SpringDemo() {
  const boxRef = useRef(null);

  // Spring physics: plain vars for targets/velocities, signals for display values
  const xPos = signal(0);
  const scaleVal = signal(1);
  let xTarget = 0, xVel = 0;
  let scaleTarget = 1, scaleVel = 0;
  let rafId = null;

  function tick() {
    // Not inside an effect — signal reads here don't create subscriptions
    const xDisp = xPos() - xTarget;
    xVel += (-120 * xDisp - 20 * xVel) * 0.016;

    const sDisp = scaleVal() - scaleTarget;
    scaleVel += (-200 * sDisp - 15 * scaleVel) * 0.016;

    xPos(xPos() + xVel * 0.016);
    scaleVal(scaleVal() + scaleVel * 0.016);

    if (Math.abs(xVel) < 0.01 && Math.abs(xDisp) < 0.01 &&
        Math.abs(scaleVel) < 0.01 && Math.abs(sDisp) < 0.01) {
      xPos(xTarget);
      scaleVal(scaleTarget);
      xVel = scaleVel = 0;
      rafId = null;
      return;
    }
    rafId = requestAnimationFrame(tick);
  }

  function setX(v) {
    xTarget = v;
    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  function setScale(v) {
    scaleTarget = v;
    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  // Direct DOM update via effect — smooth 60fps, no component re-render
  // Read signals BEFORE the null check so effect always subscribes
  effect(() => {
    const x = xPos();
    const s = scaleVal();
    const el = boxRef.current;
    if (el) el.style.transform = `translateX(${x}px) scale(${s})`;
  });

  return (
    <div class="card">
      <h2>Spring Physics</h2>
      <p>Click the box or buttons to trigger spring animations.</p>
      <div class="animation-stage">
        <div class="spring-box" ref={boxRef}
          onclick={() => { setScale(1.5); setTimeout(() => setScale(1), 150); }}>
          Click me
        </div>
      </div>
      <div class="btn-group">
        <button class="btn" onclick={() => setX(xTarget - 100)}>Left</button>
        <button class="btn" onclick={() => setX(0)}>Center</button>
        <button class="btn" onclick={() => setX(xTarget + 100)}>Right</button>
        <button class="btn btn-primary" onclick={() => {
          setScale(2);
          setTimeout(() => setScale(1), 200);
        }}>Bounce</button>
      </div>
    </div>
  );
}

function ProgressDemo() {
  const barRef = useRef(null);
  const progress = signal(0);
  const animating = signal(false);

  function start() {
    if (animating()) return;
    animating(true);
    progress(0);
    let t0;
    function step(ts) {
      if (!t0) t0 = ts;
      const pct = Math.min((ts - t0) / 2000, 1);
      progress((1 - Math.pow(1 - pct, 3)) * 100);
      if (pct < 1) requestAnimationFrame(step);
      else animating(false);
    }
    requestAnimationFrame(step);
  }

  // Direct DOM update for progress bar width
  // Read signal BEFORE null check to ensure subscription
  effect(() => {
    const p = progress();
    const el = barRef.current;
    if (el) el.style.width = `${p}%`;
  });

  return (
    <div class="card">
      <h2>Tween / Easing</h2>
      <p>Smooth progress bar with cubic ease-out, driven by a signal.</p>
      <div class="progress-bar-outer">
        <div class="progress-bar-inner" ref={barRef} />
      </div>
      <p class="muted">{() => `${Math.round(progress())}%`}</p>
      <button class="btn btn-primary" onclick={start}>
        {() => animating() ? 'Animating...' : 'Start'}
      </button>
    </div>
  );
}

function StaggerDemo() {
  const visible = signal(false);
  const listRef = useRef(null);

  // Toggle CSS classes via effect + DOM ref
  effect(() => {
    const show = visible();
    if (listRef.current) {
      listRef.current.querySelectorAll('.stagger-item').forEach(el => {
        el.classList.toggle('visible', show);
      });
    }
  });

  return (
    <div class="card">
      <h2>Staggered Entry</h2>
      <p>CSS transitions triggered by signal state change.</p>
      <button class="btn btn-primary" onclick={() => visible(!visible())}>
        {() => visible() ? 'Hide' : 'Show'}
      </button>
      <div class="stagger-list" ref={listRef}>
        {['Signals', 'Components', 'Effects', 'Routing', 'Stores'].map((item, i) => (
          <div class="stagger-item" style={`transition-delay: ${i * 80}ms`}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Animations() {
  return (
    <div class="page">
      <h1>Animations</h1>
      <p class="subtitle">Springs, tweens, and CSS transitions — all driven by signals</p>
      <SpringDemo />
      <ProgressDemo />
      <StaggerDemo />
    </div>
  );
}
