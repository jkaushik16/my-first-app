import React, { useEffect, useMemo, useState } from "https://esm.sh/react@18.2.0?min";
import ReactDOM from "https://esm.sh/react-dom@18.2.0/client?min";

const STORAGE_KEY = "jatin.todo.react.v2";

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const save = (items) => localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

function App() {
  const [items, setItems] = useState(() => load());
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => save(items), [items]);

  const activeCount = useMemo(() => items.filter((t) => !t.done).length, [items]);
  const doneCount = items.length - activeCount;

  const filtered = useMemo(() => {
    if (filter === "active") return items.filter((t) => !t.done);
    if (filter === "done") return items.filter((t) => t.done);
    return items;
  }, [items, filter]);

  const addTodo = (e) => {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    setItems((prev) => [
      { id: crypto.randomUUID(), text: value, done: false, createdAt: Date.now() },
      ...prev,
    ]);
    setText("");
  };

  const toggle = (id) => setItems((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const remove = (id) => setItems((prev) => prev.filter((t) => t.id !== id));
  const clearDone = () => setItems((prev) => prev.filter((t) => !t.done));

  return (
    <div className="app">
      <div className="glass">
        <header className="header">
          <div>
            <p className="tag">ai.jatinkaushik.com /todo</p>
            <h1>Todo Flow</h1>
            <p className="sub">Fast, clean, and local-first. Your tasks stay in this browser only.</p>
          </div>
          <div className="stats">
            <span>{activeCount} active</span>
            <span>{doneCount} done</span>
          </div>
        </header>

        <form className="row" onSubmit={addTodo}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What needs to get done?"
            maxLength={140}
            autoFocus
          />
          <button>Add</button>
        </form>

        <div className="filters">
          <button className={filter === "all" ? "on" : ""} onClick={() => setFilter("all")}>All</button>
          <button className={filter === "active" ? "on" : ""} onClick={() => setFilter("active")}>Active</button>
          <button className={filter === "done" ? "on" : ""} onClick={() => setFilter("done")}>Done</button>
          <button className="ghost" onClick={clearDone} disabled={doneCount === 0}>Clear done</button>
        </div>

        <ul className="list">
          {filtered.length === 0 ? (
            <li className="empty">No tasks here yet ✨</li>
          ) : (
            filtered.map((todo) => (
              <li key={todo.id} className={todo.done ? "item done" : "item"}>
                <label>
                  <input type="checkbox" checked={todo.done} onChange={() => toggle(todo.id)} />
                  <span>{todo.text}</span>
                </label>
                <button className="danger" onClick={() => remove(todo.id)}>Delete</button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
