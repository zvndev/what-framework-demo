import { signal, computed } from 'what-framework';

export function Forms() {
  // --- Controlled form ---
  const name = signal('');
  const email = signal('');
  const role = signal('developer');
  const agree = signal(false);
  const submitted = signal(null);

  const isValid = computed(() => {
    return name().trim().length > 0
      && email().includes('@')
      && agree();
  });

  const errors = computed(() => {
    const e = {};
    if (name().length > 0 && name().trim().length < 2) e.name = 'Name must be at least 2 characters';
    if (email().length > 0 && !email().includes('@')) e.email = 'Enter a valid email';
    if (!agree() && (name() || email())) e.agree = 'You must agree to the terms';
    return e;
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (!isValid()) return;
    submitted({ name: name(), email: email(), role: role() });
    name('');
    email('');
    role('developer');
    agree(false);
  }

  // --- Dynamic fields demo ---
  const fields = signal([{ id: 1, value: '' }]);
  let fieldId = 2;

  function addField() {
    fields([...fields(), { id: fieldId++, value: '' }]);
  }

  function removeField(id) {
    const list = fields().filter(f => f.id !== id);
    fields(list.length ? list : [{ id: fieldId++, value: '' }]);
  }

  function updateField(id, value) {
    fields(fields().map(f => f.id === id ? { ...f, value } : f));
  }

  return (
    <div class="page">
      <h1>Forms</h1>
      <p class="subtitle">Controlled inputs, validation, dynamic fields — all signal-driven</p>

      <div class="card">
        <h2>Registration Form</h2>
        <p>Real-time validation with computed signals. No form library needed.</p>

        <form onsubmit={handleSubmit} class="form">
          <div class="form-group">
            <label>Name</label>
            <input
              type="text"
              class="input"
              placeholder="Your name"
              oninput={(e) => name(e.target.value)}
            />
            {errors().name ? <span class="field-error">{errors().name}</span> : null}
          </div>

          <div class="form-group">
            <label>Email</label>
            <input
              type="email"
              class="input"
              placeholder="you@example.com"
              oninput={(e) => email(e.target.value)}
            />
            {errors().email ? <span class="field-error">{errors().email}</span> : null}
          </div>

          <div class="form-group">
            <label>Role</label>
            <select class="input" onchange={(e) => role(e.target.value)}>
              <option value="developer">Developer</option>
              <option value="designer">Designer</option>
              <option value="manager">Manager</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input
                type="checkbox"
                onchange={(e) => agree(e.target.checked)}
              />
              I agree to the terms
            </label>
            {errors().agree ? <span class="field-error">{errors().agree}</span> : null}
          </div>

          <button
            type="submit"
            class="btn btn-primary"
            disabled={!isValid()}
          >
            Submit
          </button>
        </form>

        {submitted() ? (
          <div class="success-message">
            {`Submitted: ${JSON.stringify(submitted())}`}
          </div>
        ) : null}
      </div>

      <div class="card">
        <h2>Dynamic Fields</h2>
        <p>Add and remove form fields dynamically. Each field is tracked by signal.</p>

        <div class="dynamic-fields">
          {fields().map(field => (
            <div class="field-row" key={field.id}>
              <input
                type="text"
                class="input"
                placeholder={`Field #${field.id}`}
                oninput={(e) => updateField(field.id, e.target.value)}
              />
              <button class="btn-icon" onclick={() => removeField(field.id)} title="Remove">
                x
              </button>
            </div>
          ))}
        </div>

        <button class="btn" onclick={addField}>+ Add Field</button>

        <pre class="code-output">
          {() => JSON.stringify(fields().map(f => f.value).filter(Boolean), null, 2)}
        </pre>
      </div>
    </div>
  );
}
