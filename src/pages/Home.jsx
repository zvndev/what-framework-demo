import { signal, computed } from 'what-framework';
import { Link } from 'what-framework/router';

export function Home() {
  const count = signal(0);
  const doubled = computed(() => count() * 2);

  return (
    <div class="page">
      <div class="hero">
        <h1>What Framework</h1>
        <p class="subtitle">The closest framework to vanilla JS</p>
        <p class="description">
          Signals, components, fine-grained reactivity — no virtual DOM.
          Components run <strong>once</strong>. Signal reads create subscriptions
          that update the DOM directly.
        </p>
      </div>

      <div class="card">
        <h2>Quick Counter</h2>
        <p>This counter demonstrates the basics: <code>signal()</code> and <code>computed()</code>.</p>
        <div class="counter-demo">
          <button class="btn" onclick={() => count(count() - 1)}>-</button>
          <span class="count">{() => count()}</span>
          <button class="btn" onclick={() => count(count() + 1)}>+</button>
        </div>
        <p class="muted">{() => `Doubled: ${doubled()}`}</p>
      </div>

      <div class="feature-grid">
        <Link href="/reactivity" class="feature-card">
          <h3>Reactivity</h3>
          <p>Signals, computed values, effects, batch updates</p>
        </Link>
        <Link href="/todos" class="feature-card">
          <h3>Todo App</h3>
          <p>Store, derived state, list rendering, forms</p>
        </Link>
        <Link href="/data" class="feature-card">
          <h3>Data Fetching</h3>
          <p>Async resources, loading states, error handling</p>
        </Link>
        <Link href="/animations" class="feature-card">
          <h3>Animations</h3>
          <p>Springs, tweens, transitions</p>
        </Link>
        <Link href="/forms" class="feature-card">
          <h3>Forms</h3>
          <p>Form state, validation, controlled inputs</p>
        </Link>
        <Link href="/dashboard" class="feature-card">
          <h3>Dashboard</h3>
          <p>Animated counters, live stats, mini charts</p>
        </Link>
        <Link href="/theme" class="feature-card">
          <h3>Theme</h3>
          <p>Live palette switching via CSS variables</p>
        </Link>
      </div>
    </div>
  );
}
