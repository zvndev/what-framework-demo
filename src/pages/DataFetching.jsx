import { signal } from 'what-framework';

function UserCard({ user }) {
  return (
    <div class="user-card">
      <img
        src={user.avatar_url}
        alt={user.login}
        class="avatar"
        width="64"
        height="64"
      />
      <div>
        <h3>{user.login}</h3>
        <p class="muted">{user.html_url}</p>
        {user.bio ? <p>{user.bio}</p> : null}
        <div class="user-stats">
          <span>{`Repos: ${user.public_repos}`}</span>
          <span>{`Followers: ${user.followers}`}</span>
        </div>
      </div>
    </div>
  );
}

function GithubSearch() {
  const query = signal('');
  const result = signal(null);
  const searching = signal(false);
  const searchError = signal(null);
  let debounceTimer;

  function search(username) {
    clearTimeout(debounceTimer);
    if (!username.trim()) {
      result(null);
      return;
    }
    debounceTimer = setTimeout(async () => {
      searching(true);
      searchError(null);
      try {
        const res = await fetch(`https://api.github.com/users/${username}`);
        if (!res.ok) throw new Error(`User "${username}" not found`);
        result(await res.json());
      } catch (err) {
        searchError(err.message);
        result(null);
      } finally {
        searching(false);
      }
    }, 400);
  }

  return (
    <div class="card">
      <h2>GitHub User Search</h2>
      <p>Type a GitHub username — debounced fetch with loading & error states.</p>
      <input
        type="text"
        class="input"
        placeholder="Search GitHub users..."
        oninput={(e) => { query(e.target.value); search(e.target.value); }}
      />
      {searching() ? <p class="loading">Searching...</p> : null}
      {searchError() ? <p class="error">{searchError()}</p> : null}
      {result() ? <UserCard user={result()} /> : null}
    </div>
  );
}

function RepoList() {
  const data = signal(null);
  const error = signal(null);
  const loading = signal(true);

  // Fetch on mount — runs once since component doesn't re-render
  fetch('https://api.github.com/repositories?since=1000&per_page=8')
    .then(r => { if (!r.ok) throw new Error('Failed to fetch'); return r.json(); })
    .then(repos => { data(repos); loading(false); })
    .catch(err => { error(err.message); loading(false); });

  return (
    <div class="card">
      <h2>Public Repos (auto-fetch)</h2>
      <p>Data loaded on mount with signals for loading/error/data states.</p>
      {loading() ? <p class="loading">Loading repos...</p> : null}
      {error() ? <p class="error">{error()}</p> : null}
      {data() ? (
        <ul class="repo-list">
          {data().slice(0, 8).map(repo => (
            <li class="repo-item" key={repo.id}>
              <a href={repo.html_url} target="_blank" rel="noopener">
                {repo.full_name || repo.name}
              </a>
              <span class="muted">{` #${repo.id}`}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function DataFetching() {
  return (
    <div class="page">
      <h1>Data Fetching</h1>
      <p class="subtitle">Async data with signals — loading states, error handling, debounced search</p>
      <GithubSearch />
      <RepoList />
    </div>
  );
}
