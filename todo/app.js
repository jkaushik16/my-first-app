import React, { useEffect, useMemo, useState } from "https://esm.sh/react@18.2.0?min";
import ReactDOM from "https://esm.sh/react-dom@18.2.0?min";

const STORAGE_KEY = "ai-jatinkaushik-todos";
const FILTERS = [
  { label: "All", predicate: () => true },
  { label: "Active", predicate: (todo) => !todo.done },
  { label: "Completed", predicate: (todo) => todo.done },
];

const loadTodos = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.warn("todo: failed to parse stored data", error);
    return [];
  }
};

const saveTodos = (payload) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
};

const useTodos = () => {
  const [items, setItems] = useState(() => loadTodos());

  useEffect(() => {
    const handler = (event) => {
      if (event.key === STORAGE_KEY) {
        setItems(loadTodos());
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const add = (text) => {
    const next = [...items, { id: crypto.randomUUID(), text, done: false, created: Date.now() }];
    setItems(next);
    saveTodos(next);
  };

  const toggle = (id) => {
    const next = items.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo));
    setItems(next);
    saveTodos(next);
  };

  const remove = (id) => {
    const next = items.filter((todo) => todo.id !== id);
    setItems(next);
    saveTodos(next);
  };

  const clearCompleted = () => {
    const next = items.filter((todo) => !todo.done);
    setItems(next);
    saveTodos(next);
  };

  return { items, add, toggle, remove, clearCompleted };
};

const Badge = ({ count }) => (
  <span className="pill">{count} pending</span>
);

const TodoApp = () => {
  const { items, add, toggle, remove, clearCompleted } = useTodos();
  const [filterIndex, setFilterIndex] = useState(0);
  const [draft, setDraft] = useState("");

  const filtered = useMemo(() => items.filter(FILTERS[filterIndex].predicate), [items, filterIndex]);

  const hasCompleted = items.some((item) => item.done);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;
    add(trimmed);
    setDraft("");
  };

  return (
    <div className="todo-app">
      <form className="todo-form" onSubmit={handleSubmit}>
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Create a new task"
          autoComplete="off"
        />
        <button type="submit">Add</button>
      </form>

      <div className="meta">
        <div className="filters">
          {FILTERS.map((filter, index) => (
            <button
              key={filter.label}
              type="button"
              className={index === filterIndex ? "active" : ""}
              onClick={() => setFilterIndex(index)}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <Badge count={items.filter((todo) => !todo.done).length} />
      </div>

      <ul className="todo-list">
        {filtered.length === 0 ? (
          <li className="empty">No tasks here yet.</li>
        ) : (
          filtered.map((todo) => (
            <li key={todo.id} className={todo.done ? "done" : ""}>
              <div>
                <button className="circle" type="button" onClick={() => toggle(todo.id)}>
                  {todo.done ? "✔" : ""}
                </button>
                <span>{todo.text}</span>
              </div>
              <div className="controls">
                <span className="timestamp">{new Date(todo.created).toLocaleTimeString([], { timeStyle: "short" })}</span>
                <button type="button" onClick={() => remove(todo.id)}>Remove</button>
              </div>
            </li>
          ))
        )}
      </ul>

      {hasCompleted && (
        <div className="clear">
          <button type="button" onClick={clearCompleted}>
            Clear completed
          </button>
        </div>
      )}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<TodoApp />);
