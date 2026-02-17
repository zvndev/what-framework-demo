import { mount, signal } from 'what-framework';
import { Router, Link, defineRoutes, navigate, route } from 'what-framework/router';
import { Home } from './pages/Home.jsx';
import { Reactivity } from './pages/Reactivity.jsx';
import { TodoApp } from './pages/TodoApp.jsx';
import { DataFetching } from './pages/DataFetching.jsx';
import { Animations } from './pages/Animations.jsx';
import { Forms } from './pages/Forms.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { Theme } from './pages/Theme.jsx';

// Define routes
const routes = defineRoutes({
  '/': Home,
  '/reactivity': Reactivity,
  '/todos': TodoApp,
  '/data': DataFetching,
  '/animations': Animations,
  '/forms': Forms,
  '/dashboard': Dashboard,
  '/theme': Theme,
});

function Nav() {
  return (
    <nav class="nav">
      <div class="nav-brand">
        <Link href="/" class="brand">What Framework</Link>
        <span class="badge">Demo</span>
      </div>
      <div class="nav-links">
        <Link href="/reactivity">Reactivity</Link>
        <Link href="/todos">Todos</Link>
        <Link href="/data">Data</Link>
        <Link href="/animations">Animations</Link>
        <Link href="/forms">Forms</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/theme">Theme</Link>
      </div>
    </nav>
  );
}

function App() {
  return (
    <div class="app">
      <Nav />
      <main class="content">
        <Router routes={routes} />
      </main>
    </div>
  );
}

mount(<App />, '#app');
