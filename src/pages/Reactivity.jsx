import { signal, computed, effect, batch, useRef, untrack } from 'what-framework';

export function Reactivity() {
  // --- Signals ---
  const name = signal('World');
  const greeting = computed(() => `Hello, ${name()}!`);

  // --- Effect log ---
  const logText = signal('');

  effect(() => {
    const n = name();
    // Use untrack to read logText without subscribing (prevents circular dep)
    const prev = untrack(() => logText());
    const lines = prev ? prev.split('\n') : [];
    lines.push(`Name changed to: "${n}"`);
    // Keep last 6 entries
    logText(lines.slice(-6).join('\n'));
  });

  // --- Batch demo ---
  const x = signal(0);
  const y = signal(0);
  const position = computed(() => `(${x()}, ${y()})`);
  const batchCount = signal(0);
  const noBatchCount = signal(0);

  function moveWithoutBatch() {
    x(x() + 1);
    y(y() + 1);
    noBatchCount(noBatchCount() + 2);
    // Two separate signal writes = two effect runs
  }

  function moveWithBatch() {
    batch(() => {
      x(x() + 10);
      y(y() + 10);
    });
    batchCount(batchCount() + 1);
    // Batched: both writes trigger one effect run
  }

  // --- Timer demo ---
  const elapsed = signal(0);
  const timerRef = useRef(null);
  const running = signal(false);

  function toggleTimer() {
    if (running()) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      running(false);
    } else {
      timerRef.current = setInterval(() => elapsed(elapsed() + 1), 100);
      running(true);
    }
  }

  return (
    <div class="page">
      <h1>Reactivity</h1>
      <p class="subtitle">Signals, computed values, effects, and batch updates</p>

      <div class="card">
        <h2>Signals & Computed</h2>
        <p>Type a name — the greeting updates reactively via <code>computed()</code>.</p>
        <input
          type="text"
          class="input"
          value="World"
          oninput={(e) => name(e.target.value)}
          placeholder="Enter your name"
        />
        <p class="result">{greeting()}</p>
      </div>

      <div class="card">
        <h2>Effects</h2>
        <p>Effects auto-track signal dependencies. No dependency arrays needed.</p>
        <pre class="log">{logText() || '(type above to see effect log)'}</pre>
      </div>

      <div class="card">
        <h2>Batch Updates</h2>
        <p>
          Without <code>batch()</code>, each signal write triggers a separate update.
          With batch, multiple writes collapse into one.
        </p>
        <p>{`Position: ${position()}`}</p>
        <p class="muted">
          {`Without batch: ${noBatchCount()} effect runs | With batch: ${batchCount()} effect runs`}
        </p>
        <div class="btn-group">
          <button class="btn" onclick={moveWithoutBatch}>Move +1,+1 (no batch)</button>
          <button class="btn btn-primary" onclick={moveWithBatch}>Move +10,+10 (batched)</button>
        </div>
      </div>

      <div class="card">
        <h2>Timer (useRef + signal)</h2>
        <p>
          <code>useRef</code> persists the interval ID. <code>signal</code> drives the display.
        </p>
        <p class="timer">{(elapsed() / 10).toFixed(1)}s</p>
        <div class="btn-group">
          <button class="btn btn-primary" onclick={toggleTimer}>
            {running() ? 'Stop' : 'Start'}
          </button>
          <button class="btn" onclick={() => { elapsed(0); }}>Reset</button>
        </div>
      </div>
    </div>
  );
}
