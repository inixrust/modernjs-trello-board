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
// TODO: id baru = id terbesar di state + 1 (pakai reduce, tanpa variabel let).
function getNextId() {
  return state.todos.length + 1;
}

// TODO: kembalikan todo yang terlihat sesuai state.filter ("all" | "active" | "done").
function getVisibleTodos() {
  return state.todos;
}

// TODO: buat <li data-id="..."> berisi checkbox, teks (pakai textContent!),
// dan tombol data-action="delete". Tambahkan class "done" bila selesai.
function createTodoElement(todo) {
  const li = document.createElement("li");
  li.textContent = todo.text;
  return li;
}

// TODO: perbarui #summary (misalnya "1/3 selesai"), lalu bangun ulang
// #todo-list dari state. Empty state memakai guard clause (return), tanpa else.
function render() {
  listEl.replaceChildren(...getVisibleTodos().map(createTodoElement));
}

// ===== Event =====
// TODO 1: submit pada form -> tambah todo ke state -> render()
// TODO 2: input pada #todo-input -> perbarui #char-counter
// TODO 3: change pada #todo-list (delegation) -> hanya checkbox -> toggle -> render()
// TODO 4: click pada #todo-list (delegation) -> hapus todo -> render()
// TODO 5: change pada #filter -> ubah state.filter -> render()

render();
