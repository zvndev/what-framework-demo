import { signal, effect, useRef } from 'what-framework';

// Simple spring physics using signals
function useSpring(initial, config = {}) {
  const { stiffness = 170, damping = 26, mass = 1 } = config;
  const target = signal(initial);
  const current = signal(initial);
  const velocity = useRef(0);
  const rafRef = useRef(null);

  function animate() {
    const displacement = current() - target();
    const springForce = -stiffness * displacement;
    const dampingForce = -damping * velocity.current;
    const acceleration = (springForce + dampingForce) / mass;

    velocity.current += acceleration * 0.016;
    const next = current() + velocity.current * 0.016;

    if (Math.abs(velocity.current) < 0.01 && Math.abs(displacement) < 0.01) {
      current(target());
      velocity.current = 0;
      rafRef.current = null;
      return;
    }

    current(next);
    rafRef.current = requestAnimationFrame(animate);
  }

  function set(val) {
    target(val);
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(animate);
    }
  }

  return { current, set, target };
}

function SpringDemo() {
  const scale = useSpring(1, { stiffness: 200, damping: 15 });
  const x = useSpring(0, { stiffness: 120, damping: 20 });

  return (
    <div class="card">
      <h2>Spring Physics</h2>
      <p>Click the box or buttons to trigger spring animations.</p>

      <div class="animation-stage">
        <div
          class="spring-box"
          style={`transform: translateX(${x.current()}px) scale(${scale.current()})`}
          onclick={() => {
            scale.set(1.5);
            setTimeout(() => scale.set(1), 150);
          }}
        >
          Click me
        </div>
      </div>

      <div class="btn-group">
        <button class="btn" onclick={() => x.set(x.target() - 100)}>Left</button>
        <button class="btn" onclick={() => x.set(0)}>Center</button>
        <button class="btn" onclick={() => x.set(x.target() + 100)}>Right</button>
        <button class="btn btn-primary" onclick={() => {
          scale.set(2);
          setTimeout(() => scale.set(1), 200);
        }}>Bounce</button>
      </div>
    </div>
  );
}

function ProgressDemo() {
  const progress = signal(0);
  const animating = signal(false);

  function animate() {
    if (animating()) return;
    animating(true);
    progress(0);

    let start;
    function step(ts) {
      if (!start) start = ts;
      const elapsed = ts - start;
      const pct = Math.min(elapsed / 2000, 1);
      const eased = 1 - Math.pow(1 - pct, 3);
      progress(eased * 100);

      if (pct < 1) {
        requestAnimationFrame(step);
      } else {
        animating(false);
      }
    }
    requestAnimationFrame(step);
  }

  return (
    <div class="card">
      <h2>Tween / Easing</h2>
      <p>Smooth progress bar with cubic ease-out, driven by a signal.</p>

      <div class="progress-bar-outer">
        <div
          class="progress-bar-inner"
          style={`width: ${progress()}%`}
        />
      </div>
      <p class="muted">{() => `${Math.round(progress())}%`}</p>

      <button class="btn btn-primary" onclick={animate}>
        {() => animating() ? 'Animating...' : 'Start'}
      </button>
    </div>
  );
}

function StaggerDemo() {
  const visible = signal(false);
  const items = ['Signals', 'Components', 'Effects', 'Routing', 'Stores'];

  return (
    <div class="card">
      <h2>Staggered Entry</h2>
      <p>CSS transitions triggered by signal state change.</p>

      <button class="btn btn-primary" onclick={() => visible(!visible())}>
        {() => visible() ? 'Hide' : 'Show'}
      </button>

      <div class="stagger-list">
        {items.map((item, i) => (
          <div
            class={`stagger-item ${visible() ? 'visible' : ''}`}
            style={`transition-delay: ${i * 80}ms`}
          >
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
