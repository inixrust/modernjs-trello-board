// Todo List - mini proyek Hari 1: State -> Render -> DOM -> Event

// ===== State =====
const state = {
  todos: [
    { id: 1, text: "Belajar let dan const", done: true },
    { id: 2, text: "Latihan map dan filter", done: false },
    { id: 3, text: "Pahami event delegation", done: false },
  ],
  filter: "all", // "all" | "active" | "done"
};

// ===== Referensi DOM =====
const form = document.querySelector("#todo-form");
const input = document.querySelector("#todo-input");
const counterEl = document.querySelector("#char-counter");
const listEl = document.querySelector("#todo-list");
const summaryEl = document.querySelector("#summary");
const filterEl = document.querySelector("#filter");

// ===== Render =====
function getVisibleTodos() {
  const { todos, filter } = state;
  if (filter === "active") return todos.filter((todo) => !todo.done);
  if (filter === "done") return todos.filter((todo) => todo.done);
  return todos;
}

function getNextId() {
  return state.todos.reduce((max, todo) => Math.max(max, todo.id), 0) + 1;
}

function createTodoElement(todo) {
  const li = document.createElement("li");
  li.dataset.id = todo.id;
  li.classList.toggle("done", todo.done);
  li.innerHTML = `
    <label><input type="checkbox"> <span></span></label>
    <button type="button" data-action="delete">Hapus</button>`;
  li.querySelector("input").checked = todo.done;
  li.querySelector("span").textContent = todo.text;
  return li;
}

function render() {
  const doneCount = state.todos.filter((todo) => todo.done).length;
  summaryEl.textContent = `${doneCount}/${state.todos.length} selesai`;

  const visibleTodos = getVisibleTodos();
  if (visibleTodos.length === 0) {
    listEl.innerHTML = `<li class="empty">Tidak ada todo</li>`;
    return;
  }
  listEl.replaceChildren(...visibleTodos.map(createTodoElement));
}

// ===== Event =====
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (text === "") return;

  const newTodo = { id: getNextId(), text, done: false };
  state.todos = [...state.todos, newTodo];
  form.reset();
  counterEl.textContent = "0/60";
  render();
});

input.addEventListener("input", () => {
  counterEl.textContent = `${input.value.length}/60`;
});

listEl.addEventListener("change", (event) => {
  if (event.target.type !== "checkbox") return;
  const id = Number(event.target.closest("li").dataset.id);
  state.todos = state.todos.map((todo) =>
    todo.id === id ? { ...todo, done: !todo.done } : todo,
  );
  render();
});

listEl.addEventListener("click", (event) => {
  if (event.target.dataset.action !== "delete") return;
  const id = Number(event.target.closest("li").dataset.id);
  state.todos = state.todos.filter((todo) => todo.id !== id);
  render();
});

filterEl.addEventListener("change", () => {
  state.filter = filterEl.value;
  render();
});

render();
