// Trello Board - Pelatihan Modern JavaScript INIXINDO

// ===== 1. API (Hari 2) =====
// URL relatif: string kosong berarti request ke origin halaman ini,
// mis. "/cards" -> http://localhost:3000/cards.
const API_URL = "";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    const method = options.method ?? "GET";
    throw new Error(`${method} ${path} gagal (status ${response.status})`);
  }

  return response.json();
}

async function getBoards() {
  return request("/boards");
}

async function getLists(boardId) {
  return request(`/lists?boardId=${boardId}&_sort=position`);
}

async function getCards() {
  return request("/cards?_sort=position");
}

async function createList(data) {
  return request("/lists", { method: "POST", body: JSON.stringify(data) });
}

async function createCard(data) {
  return request("/cards", { method: "POST", body: JSON.stringify(data) });
}

async function updateList(id, changes) {
  return request(`/lists/${id}`, {
    method: "PATCH",
    body: JSON.stringify(changes),
  });
}

async function updateCard(id, changes) {
  return request(`/cards/${id}`, {
    method: "PATCH",
    body: JSON.stringify(changes),
  });
}

async function deleteList(id) {
  return request(`/lists/${id}`, { method: "DELETE" });
}

async function deleteCard(id) {
  return request(`/cards/${id}`, { method: "DELETE" });
}

// ===== 2. State dan selector =====
const TITLE_MAX_LENGTH = 80;

const state = {
  board: null,
  lists: [],
  cards: [],
};

// TODO: fungsi pembanding berdasarkan position (untuk toSorted)
const byPosition = (first, second) => 0;

// TODO: list terurut berdasarkan position (tanpa memutasi state!)
function getSortedLists() {
  return [];
}

// TODO: card milik listId, terurut berdasarkan position
function getCardsByList(listId) {
  return [];
}

// TODO: posisi terbesar di items + 1000 (pakai reduce)
function getNextPosition(items) {
  return 1000;
}

// TODO: judul tidak kosong dan paling banyak TITLE_MAX_LENGTH karakter.
// Validasi di browser hanya untuk kenyamanan; server tetap wajib memvalidasi.
function isValidTitle(title) {
  return true;
}

// ===== 3. Referensi elemen DOM =====
const boardTitleEl = document.querySelector("#board-title");
const statusEl = document.querySelector("#status");
const boardEl = document.querySelector("#board");
const addListForm = document.querySelector("#add-list-form");
const editDialog = document.querySelector("#edit-dialog");
const editForm = document.querySelector("#edit-form");

// ===== 4. Render =====
// TODO: <li class="card" draggable data-card-id> dengan .card-title, .card-desc,
// tombol data-action="edit-card" dan "delete-card". Data lewat textContent.
function createCardElement(card) {}

// TODO: <section class="list" data-list-id> dengan header, <ul class="card-list">,
// empty state, dan <form class="add-card-form">.
function createListElement(list, cards) {}

// TODO: judul board + semua list dari state, atau empty board.
function renderBoard() {}

// TODO: tampilkan pesan di #status (sembunyikan bila message === "").
function showStatus(message, type = "info") {}

// TODO: console.error(error) untuk developer, showStatus(pesan umum) untuk
// pengguna. Jangan tampilkan URL/status ke pengguna (OWASP).
function reportError(userMessage, error) {}

// ===== 8. Inisialisasi =====
// TODO: loading -> getBoards -> Promise.all(getLists, getCards) -> state
// -> renderBoard(); tampilkan error bila gagal.
async function init() {}

init();
