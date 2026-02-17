import { signal, computed, effect } from 'what-framework';

const PALETTES = {
  midnight: {
    label: 'Midnight',
    bg: '#0a0a0b', card: '#141416', hover: '#1c1c20',
    border: '#2a2a2e', text: '#e4e4e7', muted: '#71717a',
    primary: '#3b82f6', accent: '#8b5cf6',
  },
  ocean: {
    label: 'Ocean',
    bg: '#0c1222', card: '#111827', hover: '#1a2332',
    border: '#1e3a5f', text: '#e0f2fe', muted: '#7dd3fc',
    primary: '#0ea5e9', accent: '#06b6d4',
  },
  forest: {
    label: 'Forest',
    bg: '#071209', card: '#0d1f12', hover: '#132a18',
    border: '#1a3d22', text: '#dcfce7', muted: '#86efac',
    primary: '#22c55e', accent: '#10b981',
  },
  sunset: {
    label: 'Sunset',
    bg: '#1a0a0a', card: '#271010', hover: '#331818',
    border: '#4c1d1d', text: '#fee2e2', muted: '#fca5a5',
    primary: '#f43f5e', accent: '#f97316',
  },
  lavender: {
    label: 'Lavender',
    bg: '#0f0b1e', card: '#161127', hover: '#1e1733',
    border: '#2d2251', text: '#ede9fe', muted: '#c4b5fd',
    primary: '#8b5cf6', accent: '#a78bfa',
  },
};

function ColorSwatch({ color, label }) {
  return (
    <div class="swatch">
      <div class="swatch-color" style={`background: ${color}`} />
      <span class="swatch-label">{label}</span>
      <span class="swatch-hex">{color}</span>
    </div>
  );
}

function PreviewCard({ palette }) {
  return (
    <div class="preview-card" style={`
      background: ${palette.card};
      border-color: ${palette.border};
      color: ${palette.text};
    `}>
      <div class="preview-header">
        <div class="preview-dot" style={`background: ${palette.primary}`} />
        <span>Preview Component</span>
      </div>
      <p style={`color: ${palette.muted}`}>
        This card renders in the selected palette using inline styles driven by signals.
      </p>
      <div class="preview-bar" style={`background: ${palette.border}`}>
        <div class="preview-fill" style={`background: ${palette.primary}; width: 68%`} />
      </div>
      <div class="preview-tags">
        <span class="preview-tag" style={`background: ${palette.primary}22; color: ${palette.primary}; border-color: ${palette.primary}44`}>Signal</span>
        <span class="preview-tag" style={`background: ${palette.accent}22; color: ${palette.accent}; border-color: ${palette.accent}44`}>Reactive</span>
      </div>
    </div>
  );
}

export function Theme() {
  const current = signal('midnight');
  const palette = computed(() => PALETTES[current()]);

  effect(() => {
    const p = palette();
    const root = document.documentElement;
    root.style.setProperty('--bg', p.bg);
    root.style.setProperty('--bg-card', p.card);
    root.style.setProperty('--bg-hover', p.hover);
    root.style.setProperty('--border', p.border);
    root.style.setProperty('--text', p.text);
    root.style.setProperty('--text-muted', p.muted);
    root.style.setProperty('--primary', p.primary);
  });

  return (
    <div class="page">
      <h1>Theme Switcher</h1>
      <p class="subtitle">Live CSS variable updates via signals — no page reload, no re-render</p>

      <div class="palette-grid">
        {Object.entries(PALETTES).map(([key, p]) => (
          <button
            class={`palette-btn ${current() === key ? 'palette-active' : ''}`}
            style={`--p-bg: ${p.bg}; --p-primary: ${p.primary}; --p-border: ${p.border}; --p-text: ${p.text}`}
            onclick={() => current(key)}
          >
            <div class="palette-preview">
              <div class="palette-dot" style={`background: ${p.primary}`} />
              <div class="palette-dot" style={`background: ${p.accent}`} />
              <div class="palette-dot" style={`background: ${p.muted}`} />
            </div>
            <span class="palette-name">{p.label}</span>
          </button>
        ))}
      </div>

      <PreviewCard palette={palette()} />

      <div class="card">
        <h2>Active Palette</h2>
        <div class="swatch-grid">
          <ColorSwatch color={palette().bg} label="Background" />
          <ColorSwatch color={palette().card} label="Card" />
          <ColorSwatch color={palette().border} label="Border" />
          <ColorSwatch color={palette().text} label="Text" />
          <ColorSwatch color={palette().muted} label="Muted" />
          <ColorSwatch color={palette().primary} label="Primary" />
          <ColorSwatch color={palette().accent} label="Accent" />
        </div>
      </div>
    </div>
  );
}
