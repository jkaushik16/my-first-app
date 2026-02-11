const TODO_KEY = "ai-jkaushik-todo";

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");

const readTodos = () => {
  try {
    const raw = localStorage.getItem(TODO_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn("Failed to parse todos", err);
    return [];
  }
};

const persistTodos = (todos) => {
  localStorage.setItem(TODO_KEY, JSON.stringify(todos));
};

const render = () => {
  const todos = readTodos();
  list.innerHTML = "";
  if (!todos.length) {
    const empty = document.createElement("p");
    empty.textContent = "No tasks yet. Add one!";
    empty.style.margin = "0";
    list.appendChild(empty);
    return;
  }
  todos.forEach((item, index) => {
    const li = document.createElement("li");
    const label = document.createElement("span");
    label.textContent = item;
    li.appendChild(label);
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => {
      const next = [...todos.slice(0, index), ...todos.slice(index + 1)];
      persistTodos(next);
      render();
    });
    li.appendChild(removeButton);
    list.appendChild(li);
  });
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  const todos = readTodos();
  todos.push(text);
  persistTodos(todos);
  input.value = "";
  render();
});

window.addEventListener("storage", () => render());

render();
