# What Framework Demo

A standalone demo app showcasing [What Framework](https://github.com/zvndev/what-fw) — the closest framework to vanilla JS.

## Features Demonstrated

- **Home** — Counter with `signal()` and `computed()`
- **Reactivity** — Signals, computed values, effects, batch updates, timer with `useRef`
- **Todo App** — Store-like state, derived values, list rendering, filters
- **Data Fetching** — Async data with signals, loading/error states, debounced GitHub search
- **Animations** — Spring physics, tweens with easing, CSS staggered transitions
- **Forms** — Controlled inputs, real-time validation with computed, dynamic fields
- **Dashboard** — Animated number counters, mini bar charts, activity feed
- **Theme** — Live palette switching via CSS custom properties driven by signals

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Stack

- **What Framework 0.5.1** — Signals, components, fine-grained reactivity
- **Vite** — Dev server and build tool
- **JSX** — Classic transform with `h()` / `Fragment`

## How It Works

What Framework components run **once**. Signal reads create subscriptions that update the DOM directly — no virtual DOM, no re-renders.

```jsx
import { signal, computed, mount } from 'what-framework';

function Counter() {
  const count = signal(0);
  const doubled = computed(() => count() * 2);

  return (
    <div>
      <p>{() => `Count: ${count()}, Doubled: ${doubled()}`}</p>
      <button onclick={() => count(count() + 1)}>+</button>
    </div>
  );
}

mount(<Counter />, '#app');
```

Key differences from React:
- `signal()` instead of `useState` — read with `sig()`, write with `sig(newVal)`
- Event handlers are **lowercase**: `onclick`, not `onClick`
- Reactive text needs `{() => expression}` wrapper
- No dependency arrays — effects auto-track signals
- No `useCallback`/`useMemo` needed
