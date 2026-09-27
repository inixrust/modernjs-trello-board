// Trello Board - kondisi akhir Hari 3 (satu berkas, pessimistic update)

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

const byPosition = (first, second) => first.position - second.position;

function getSortedLists() {
  return state.lists.toSorted(byPosition);
}

function getCardsByList(listId) {
  return state.cards
    .filter((card) => card.listId === listId)
    .toSorted(byPosition);
}

function getNextPosition(items) {
  const maxPosition = items.reduce(
    (max, item) => Math.max(max, item.position),
    0,
  );
  return maxPosition + 1000;
}

// Validasi di browser hanya untuk kenyamanan pengguna.
// Server sungguhan tetap wajib memvalidasi ulang.
function isValidTitle(title) {
  return title !== "" && title.length <= TITLE_MAX_LENGTH;
}

// ===== 3. Referensi elemen DOM =====
const boardTitleEl = document.querySelector("#board-title");
const statusEl = document.querySelector("#status");
const boardEl = document.querySelector("#board");
const addListForm = document.querySelector("#add-list-form");
const editDialog = document.querySelector("#edit-dialog");
const editForm = document.querySelector("#edit-form");

// ===== 4. Render =====
function createCardElement(card) {
  const li = document.createElement("li");
  li.className = "card";
  li.draggable = true;
  li.dataset.cardId = card.id;
  li.innerHTML = `
    <p class="card-title"></p>
    <p class="card-desc"></p>
    <div class="card-actions">
      <button type="button" data-action="edit-card">Edit</button>
      <button type="button" data-action="delete-card">Hapus</button>
    </div>`;
  li.querySelector(".card-title").textContent = card.title;

  const descEl = li.querySelector(".card-desc");
  descEl.textContent = card.description ?? "";
  if (!card.description) descEl.remove();
  return li;
}

function createListElement(list, cards) {
  const section = document.createElement("section");
  section.className = "list";
  section.dataset.listId = list.id;
  section.innerHTML = `
    <header class="list-header">
      <h2 class="list-title"></h2>
      <span class="list-count"></span>
      <button type="button" class="icon-button" data-action="delete-list"
        aria-label="Hapus list">&times;</button>
    </header>
    <ul class="card-list"></ul>
    <form class="add-card-form">
      <input name="title" placeholder="Judul card baru"
        aria-label="Judul card baru" required>
      <button type="submit">+ Card</button>
    </form>`;
  section.querySelector(".list-title").textContent = list.title;
  section.querySelector(".list-count").textContent = cards.length;
  section.querySelector("input").maxLength = TITLE_MAX_LENGTH;

  const cardListEl = section.querySelector(".card-list");
  if (cards.length === 0) {
    cardListEl.innerHTML = `<li class="empty">Belum ada card</li>`;
    return section;
  }
  cardListEl.append(...cards.map(createCardElement));
  return section;
}

function renderBoard() {
  boardTitleEl.textContent = state.board
    ? state.board.title
    : "Board tidak ditemukan";

  const lists = getSortedLists();
  if (lists.length === 0) {
    boardEl.innerHTML = `
      <p class="empty-board">Belum ada list. Buat list pertama.</p>`;
    return;
  }

  const listElements = lists.map((list) =>
    createListElement(list, getCardsByList(list.id)),
  );
  boardEl.replaceChildren(...listElements);
}

function showStatus(message, type = "info") {
  statusEl.textContent = message;
  statusEl.dataset.type = type;
  statusEl.hidden = message === "";
}

// Pesan umum untuk pengguna; detail teknis hanya ke console.
function reportError(userMessage, error) {
  console.error(error);
  showStatus(userMessage, "error");
}

// ===== 5. Handler (aksi pengguna) =====
async function handleCreateList(title) {
  try {
    const newList = await createList({
      boardId: state.board.id,
      title,
      position: getNextPosition(state.lists),
    });
    state.lists = [...state.lists, newList];
    renderBoard();
  } catch (error) {
    reportError("Gagal menambah list. Coba lagi.", error);
  }
}

async function handleDeleteList(listId) {
  const list = state.lists.find((item) => item.id === listId);
  if (!list) return;

  const cardCount = getCardsByList(listId).length;
  const question = `Hapus list "${list.title}" beserta ${cardCount} card?`;
  if (!confirm(question)) return;

  try {
    await deleteList(listId);
    state.lists = state.lists.filter((item) => item.id !== listId);
    state.cards = state.cards.filter((card) => card.listId !== listId);
    renderBoard();
  } catch (error) {
    reportError("Gagal menghapus list. Coba lagi.", error);
  }
}

async function handleCreateCard(listId, title) {
  try {
    const newCard = await createCard({
      listId,
      title,
      description: "",
      position: getNextPosition(getCardsByList(listId)),
      createdAt: new Date().toISOString(),
    });
    state.cards = [...state.cards, newCard];
    renderBoard();
  } catch (error) {
    reportError("Gagal menambah card. Coba lagi.", error);
  }
}

async function handleUpdateCard(cardId, changes) {
  try {
    const updatedCard = await updateCard(cardId, changes);
    state.cards = state.cards.map((card) =>
      card.id === cardId ? updatedCard : card,
    );
    renderBoard();
  } catch (error) {
    reportError("Gagal menyimpan card. Coba lagi.", error);
  }
}

async function handleDeleteCard(cardId) {
  try {
    await deleteCard(cardId);
    state.cards = state.cards.filter((card) => card.id !== cardId);
    renderBoard();
  } catch (error) {
    reportError("Gagal menghapus card. Coba lagi.", error);
  }
}

async function handleMoveCard({ cardId, targetListId }) {
  const card = state.cards.find((item) => item.id === cardId);
  if (!card || card.listId === targetListId) return;

  const position = getNextPosition(getCardsByList(targetListId));
  await handleUpdateCard(cardId, { listId: targetListId, position });
}

function openEditDialog(cardId) {
  const card = state.cards.find((item) => item.id === cardId);
  if (!card) return;

  editDialog.dataset.cardId = cardId;
  editForm.elements.title.value = card.title;
  editForm.elements.description.value = card.description ?? "";
  editDialog.showModal();
}

// ===== 6. Event listener (event delegation) =====
boardEl.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const listId = Number(button.closest(".list").dataset.listId);
  const cardEl = button.closest(".card");
  const cardId = cardEl ? Number(cardEl.dataset.cardId) : null;

  switch (button.dataset.action) {
    case "edit-card":
      openEditDialog(cardId);
      break;
    case "delete-card":
      handleDeleteCard(cardId);
      break;
    case "delete-list":
      handleDeleteList(listId);
      break;
  }
});

// Tombol submit dinonaktifkan selama request agar klik ganda tidak
// membuat data ganda.
async function whileDisabled(form, action) {
  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  try {
    return await action();
  } finally {
    button.disabled = false;
  }
}

boardEl.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.target;
  const title = form.elements.title.value.trim();
  if (!isValidTitle(title)) return;

  const listId = Number(form.closest(".list").dataset.listId);
  whileDisabled(form, () => handleCreateCard(listId, title));
});

addListForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const title = addListForm.elements.title.value.trim();
  if (!isValidTitle(title)) return;

  await whileDisabled(addListForm, () => handleCreateList(title));
  addListForm.reset();
});

editForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const cardId = Number(editDialog.dataset.cardId);
  const title = editForm.elements.title.value.trim();
  const description = editForm.elements.description.value.trim();
  if (!isValidTitle(title)) return;

  const changes = { title, description };
  await whileDisabled(editForm, () => handleUpdateCard(cardId, changes));
  editDialog.close();
});

const cancelButton = editForm.querySelector('[data-action="cancel-edit"]');
cancelButton.addEventListener("click", () => editDialog.close());

// ===== 7. Drag & drop =====
let draggedCardId = null;

boardEl.addEventListener("dragstart", (event) => {
  const cardEl = event.target.closest(".card");
  if (!cardEl) return;

  draggedCardId = Number(cardEl.dataset.cardId);
  event.dataTransfer.setData("text/plain", cardEl.dataset.cardId);
  event.dataTransfer.effectAllowed = "move";
  cardEl.classList.add("is-dragging");
});

boardEl.addEventListener("dragover", (event) => {
  const listEl = event.target.closest(".list");
  if (!listEl || draggedCardId === null) return;

  event.preventDefault(); // tanpa ini, event drop tidak akan terjadi
  event.dataTransfer.dropEffect = "move";
  boardEl.querySelectorAll(".list").forEach((element) => {
    element.classList.toggle("is-over", element === listEl);
  });
});

boardEl.addEventListener("drop", (event) => {
  const listEl = event.target.closest(".list");
  if (!listEl) return;

  event.preventDefault();
  const cardId = Number(event.dataTransfer.getData("text/plain"));
  const targetListId = Number(listEl.dataset.listId);
  handleMoveCard({ cardId, targetListId });
});

boardEl.addEventListener("dragend", () => {
  draggedCardId = null;
  const marked = boardEl.querySelectorAll(".is-dragging, .is-over");
  marked.forEach((element) => {
    element.classList.remove("is-dragging", "is-over");
  });
});

// ===== 8. Inisialisasi =====
async function init() {
  showStatus("Memuat board...", "loading");
  try {
    const boards = await getBoards();
    state.board = boards[0] ?? null;

    if (state.board) {
      const [lists, cards] = await Promise.all([
        getLists(state.board.id),
        getCards(),
      ]);
      const listIds = lists.map((list) => list.id);
      state.lists = lists;
      state.cards = cards.filter((card) => listIds.includes(card.listId));
    }

    renderBoard();
    showStatus("");
  } catch (error) {
    const message = "Gagal memuat board. Muat ulang halaman.";
    reportError(message, error);
  }
}

init();
