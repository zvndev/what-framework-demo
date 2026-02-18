import { signal, computed } from 'what-framework';

export function TodoApp() {
  const todos = signal([
    { id: 1, text: 'Learn What Framework', done: true },
    { id: 2, text: 'Build something cool', done: false },
    { id: 3, text: 'Deploy to production', done: false },
  ]);
  const filter = signal('all');
  const newText = signal('');
  let nextId = 4;

  const filtered = computed(() => {
    const f = filter();
    const list = todos();
    if (f === 'active') return list.filter(t => !t.done);
    if (f === 'done') return list.filter(t => t.done);
    return list;
  });

  const stats = computed(() => {
    const list = todos();
    const done = list.filter(t => t.done).length;
    return { total: list.length, done, remaining: list.length - done };
  });

  function addTodo(e) {
    e.preventDefault();
    const text = newText().trim();
    if (!text) return;
    todos([...todos(), { id: nextId++, text, done: false }]);
    newText('');
    e.target.reset();
  }

  function toggleTodo(id) {
    todos(todos().map(t => t.id === id ? { ...t, done: !t.done } : t));
  }

  function removeTodo(id) {
    todos(todos().filter(t => t.id !== id));
  }

  function clearDone() {
    todos(todos().filter(t => !t.done));
  }

  return (
    <div class="page">
      <h1>Todo App</h1>
      <p class="subtitle">Store-like state, derived values, list rendering</p>

      <div class="card">
        <form onsubmit={addTodo} class="todo-form">
          <input
            type="text"
            class="input"
            placeholder="What needs to be done?"
            oninput={(e) => newText(e.target.value)}
          />
          <button type="submit" class="btn btn-primary">Add</button>
        </form>

        <div class="filter-bar">
          <button
            class={`btn btn-sm ${filter() === 'all' ? 'btn-active' : ''}`}
            onclick={() => filter('all')}
          >
            All
          </button>
          <button
            class={`btn btn-sm ${filter() === 'active' ? 'btn-active' : ''}`}
            onclick={() => filter('active')}
          >
            Active
          </button>
          <button
            class={`btn btn-sm ${filter() === 'done' ? 'btn-active' : ''}`}
            onclick={() => filter('done')}
          >
            Done
          </button>
          <span class="muted">{`${stats().remaining} remaining`}</span>
        </div>

        <ul class="todo-list">
          {filtered().map(todo => (
            <li class={`todo-item ${todo.done ? 'done' : ''}`} key={todo.id}>
              <label class="todo-label">
                <input
                  type="checkbox"
                  checked={todo.done}
                  onchange={() => toggleTodo(todo.id)}
                />
                <span>{todo.text}</span>
              </label>
              <button class="btn-icon" onclick={() => removeTodo(todo.id)} title="Remove">
                x
              </button>
            </li>
          ))}
        </ul>

        {stats().done > 0 ? (
          <button class="btn btn-sm" onclick={clearDone}>
            {`Clear ${stats().done} completed`}
          </button>
        ) : null}
      </div>
    </div>
  );
}
