import { signal, computed, effect, useRef } from 'what-framework';

function AnimatedNumber({ value, label, prefix = '', suffix = '', color = 'var(--primary)' }) {
  const displayed = signal(0);
  const rafRef = useRef(null);

  effect(() => {
    const target = value();
    const start = displayed();
    const startTime = performance.now();
    const duration = 600;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    function tick(now) {
      const t = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      displayed(Math.round(start + (target - start) * ease));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
  });

  return (
    <div class="stat-card" style={`--accent: ${color}`}>
      <div class="stat-value">
        {() => `${prefix}${displayed().toLocaleString()}${suffix}`}
      </div>
      <div class="stat-label">{label}</div>
    </div>
  );
}

function MiniChart({ data, color = 'var(--primary)' }) {
  const max = Math.max(...data);
  return (
    <div class="mini-chart">
      {data.map((v, i) => (
        <div
          class="chart-bar"
          style={`height: ${(v / max) * 100}%; background: ${color}; animation-delay: ${i * 40}ms`}
        />
      ))}
    </div>
  );
}

function ActivityFeed() {
  const events = signal([
    { id: 1, text: 'New user signed up', time: '2m ago', type: 'user' },
    { id: 2, text: 'Deployment completed', time: '5m ago', type: 'deploy' },
    { id: 3, text: 'Revenue milestone reached', time: '12m ago', type: 'revenue' },
    { id: 4, text: 'Bug report resolved', time: '18m ago', type: 'fix' },
    { id: 5, text: 'New feature shipped', time: '25m ago', type: 'ship' },
  ]);

  const icons = { user: '\u{1F464}', deploy: '\u{1F680}', revenue: '\u{1F4B0}', fix: '\u{1F41B}', ship: '\u{2728}' };

  return (
    <div class="activity-feed">
      <h3>Recent Activity</h3>
      <ul class="feed-list">
        {events().map((ev, i) => (
          <li class="feed-item" style={`animation-delay: ${i * 60}ms`}>
            <span class="feed-icon">{icons[ev.type]}</span>
            <span class="feed-text">{ev.text}</span>
            <span class="feed-time">{ev.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Dashboard() {
  const users = signal(12847);
  const revenue = signal(48920);
  const requests = signal(2340000);
  const uptime = signal(99.97);

  const chartData = [45, 62, 38, 71, 55, 80, 64, 92, 78, 85, 69, 95];

  function simulate() {
    users(users() + Math.floor(Math.random() * 50) + 10);
    revenue(revenue() + Math.floor(Math.random() * 500) + 100);
    requests(requests() + Math.floor(Math.random() * 10000) + 5000);
    uptime(+(99.9 + Math.random() * 0.09).toFixed(2));
  }

  return (
    <div class="page">
      <h1>Dashboard</h1>
      <p class="subtitle">Animated stats, live counters, mini charts — all signal-driven</p>

      <div class="stat-grid">
        <AnimatedNumber value={users} label="Total Users" color="#8b5cf6" />
        <AnimatedNumber value={revenue} label="Revenue" prefix="$" color="#22c55e" />
        <AnimatedNumber value={requests} label="API Requests" color="#3b82f6" />
        <AnimatedNumber value={uptime} label="Uptime" suffix="%" color="#f59e0b" />
      </div>

      <div class="btn-group">
        <button class="btn btn-primary" onclick={simulate}>Simulate Activity</button>
      </div>

      <div class="dashboard-grid">
        <div class="card chart-card">
          <h2>Weekly Traffic</h2>
          <MiniChart data={chartData} color="var(--primary)" />
        </div>
        <ActivityFeed />
      </div>
    </div>
  );
}
