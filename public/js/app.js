// Trello Board - Pelatihan Modern JavaScript INIXINDO - satu berkas, versi Hari 4 sesi 1
// (disusun agar mudah dipecah menjadi ES Modules di fitur 07)

// ===== 1. api =====
// satu-satunya module yang berbicara dengan server.
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

// ===== 2. state =====
// sumber kebenaran data di browser + fungsi baca (selector).
// Module ini tidak menyentuh DOM dan tidak memanggil API.
const TITLE_MAX_LENGTH = 80;

const state = {
  board: null,
  lists: [],
  cards: [],
  status: "idle", // "idle" | "loading" | "ready" | "error"
  message: "",
};

const byPosition = (first, second) => first.position - second.position;

function findCard(cardId) {
  return state.cards.find((card) => card.id === cardId);
}

function findList(listId) {
  return state.lists.find((list) => list.id === listId);
}

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
// Server sungguhan WAJIB memvalidasi ulang (OWASP: jangan percaya klien).
function isValidTitle(title) {
  return title !== "" && title.length <= TITLE_MAX_LENGTH;
}

// ===== 3. render =====
// mengubah state menjadi DOM. Tidak memanggil API.

const elements = {
  boardTitle: document.querySelector("#board-title"),
  status: document.querySelector("#status"),
  toast: document.querySelector("#toast"),
  board: document.querySelector("#board"),
  addListForm: document.querySelector("#add-list-form"),
  editDialog: document.querySelector("#edit-dialog"),
  editForm: document.querySelector("#edit-form"),
};

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

function renderStatus() {
  const { status, message } = state;
  elements.status.hidden = status === "ready";
  elements.status.dataset.type = status;
  elements.status.textContent =
    status === "loading" ? "Memuat board..." : message;

  if (status === "error") {
    const retryButton = document.createElement("button");
    retryButton.type = "button";
    retryButton.dataset.action = "retry";
    retryButton.textContent = "Coba lagi";
    elements.status.append(retryButton);
  }
}

function renderBoard() {
  if (state.status !== "ready") {
    elements.board.replaceChildren();
    return;
  }
  elements.boardTitle.textContent = state.board
    ? state.board.title
    : "Board tidak ditemukan";

  const lists = getSortedLists();
  if (lists.length === 0) {
    elements.board.innerHTML = `
      <p class="empty-board">Belum ada list. Buat list pertama.</p>`;
    return;
  }
  const listElements = lists.map((list) =>
    createListElement(list, getCardsByList(list.id)),
  );
  elements.board.replaceChildren(...listElements);
}

function render() {
  renderStatus();
  renderBoard();
}

let toastTimer = null;

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    elements.toast.hidden = true;
  }, 4000);
}

// Pesan untuk pengguna dibuat umum; detail teknis hanya ke console
// (OWASP: jangan tampilkan detail sistem kepada pengguna).
function reportError(userMessage, error) {
  console.error(error);
  showToast(userMessage);
}

function openEditDialog(card) {
  elements.editDialog.dataset.cardId = card.id;
  elements.editForm.elements.title.value = card.title;
  elements.editForm.elements.description.value = card.description ?? "";
  elements.editDialog.showModal();
}

// ===== 4. board =====
// memuat board beserta list dan card-nya.

async function loadBoard() {
  state.status = "loading";
  render();

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

    state.status = "ready";
    state.message = "";
  } catch (error) {
    console.error(error);
    state.status = "error";
    state.message = "Gagal memuat board. Periksa koneksi, lalu coba lagi.";
  } finally {
    render();
  }
}

// ===== 5. list =====
// aksi untuk list: tambah dan hapus.

async function addList(title) {
  try {
    const newList = await createList({
      boardId: state.board.id,
      title,
      position: getNextPosition(state.lists),
    });
    state.lists = [...state.lists, newList];
    render();
  } catch (error) {
    reportError("Gagal menambah list. Coba lagi.", error);
  }
}

async function removeList(listId) {
  const list = findList(listId);
  if (!list) return;

  const cardCount = getCardsByList(listId).length;
  const question = `Hapus list "${list.title}" beserta ${cardCount} card?`;
  if (!confirm(question)) return;

  try {
    // JSON Server 0.17 ikut menghapus card yang listId-nya = listId ini
    await deleteList(listId);
    state.lists = state.lists.filter((item) => item.id !== listId);
    state.cards = state.cards.filter((card) => card.listId !== listId);
    render();
  } catch (error) {
    reportError("Gagal menghapus list. Coba lagi.", error);
  }
}

// ===== 6. card =====
// aksi untuk card: tambah, edit, hapus, pindah.

async function addCard(listId, title) {
  try {
    const newCard = await createCard({
      listId,
      title,
      description: "",
      position: getNextPosition(getCardsByList(listId)),
      createdAt: new Date().toISOString(),
    });
    state.cards = [...state.cards, newCard];
    render();
  } catch (error) {
    reportError("Gagal menambah card. Coba lagi.", error);
  }
}

function startEditCard(cardId) {
  const card = findCard(cardId);
  if (!card) return;
  openEditDialog(card);
}

async function editCard(cardId, changes) {
  try {
    const updatedCard = await updateCard(cardId, changes);
    state.cards = state.cards.map((card) =>
      card.id === cardId ? updatedCard : card,
    );
    render();
    return true;
  } catch (error) {
    reportError("Gagal menyimpan card. Coba lagi.", error);
    return false;
  }
}

async function removeCard(cardId) {
  try {
    await deleteCard(cardId);
    state.cards = state.cards.filter((card) => card.id !== cardId);
    render();
  } catch (error) {
    reportError("Gagal menghapus card. Coba lagi.", error);
  }
}

// Optimistic update: UI berubah dulu, server menyusul,
// rollback bila gagal.
async function moveCard({ cardId, targetListId }) {
  const card = findCard(cardId);
  if (!card || card.listId === targetListId) return;

  const changes = {
    listId: targetListId,
    position: getNextPosition(getCardsByList(targetListId)),
  };

  state.cards = state.cards.map((item) =>
    item.id === cardId ? { ...item, ...changes } : item,
  );
  render();

  try {
    await updateCard(cardId, changes);
  } catch (error) {
    // rollback HANYA card ini, agar pemindahan lain tidak ikut hilang.
    // `card` masih object lama karena state tidak pernah dimutasi.
    state.cards = state.cards.map((item) =>
      item.id === cardId ? card : item,
    );
    render();
    reportError("Gagal memindahkan card, posisi dikembalikan.", error);
  }
}

// ===== 7. events =====
// menghubungkan event DOM dengan aksi.
// Tidak memanggil API secara langsung.

function getIds(element) {
  const listEl = element.closest(".list");
  const cardEl = element.closest(".card");
  return {
    listId: listEl ? Number(listEl.dataset.listId) : null,
    cardId: cardEl ? Number(cardEl.dataset.cardId) : null,
  };
}

// Tombol submit dinonaktifkan selama request berjalan agar klik ganda
// tidak membuat data ganda.
async function whileDisabled(form, action) {
  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  try {
    return await action();
  } finally {
    button.disabled = false;
  }
}

function setupClickAndSubmit() {
  elements.board.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const { listId, cardId } = getIds(button);
    const actions = {
      "edit-card": () => startEditCard(cardId),
      "delete-card": () => removeCard(cardId),
      "delete-list": () => removeList(listId),
    };
    actions[button.dataset.action]?.();
  });

  elements.board.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = event.target.elements.title.value.trim();
    if (!isValidTitle(title)) return;

    const { listId } = getIds(event.target);
    whileDisabled(event.target, () => addCard(listId, title));
  });

  elements.status.addEventListener("click", (event) => {
    if (event.target.dataset.action === "retry") loadBoard();
  });
}

function setupForms() {
  elements.addListForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const title = elements.addListForm.elements.title.value.trim();
    if (!isValidTitle(title)) return;

    await whileDisabled(event.target, () => addList(title));
    elements.addListForm.reset();
  });

  elements.editForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const fields = elements.editForm.elements;
    const cardId = Number(elements.editDialog.dataset.cardId);
    const title = fields.title.value.trim();
    const description = fields.description.value.trim();
    if (!isValidTitle(title)) return;

    const changes = { title, description };
    const saved = await whileDisabled(event.target, () =>
      editCard(cardId, changes),
    );
    if (saved) elements.editDialog.close();
  });

  elements.editForm
    .querySelector('[data-action="cancel-edit"]')
    .addEventListener("click", () => elements.editDialog.close());
}

function clearDragClasses() {
  const marked = elements.board.querySelectorAll(".is-dragging, .is-over");
  marked.forEach((element) => {
    element.classList.remove("is-dragging", "is-over");
  });
}

function setupDragAndDrop() {
  let draggedCardId = null;

  elements.board.addEventListener("dragstart", (event) => {
    const cardEl = event.target.closest(".card");
    if (!cardEl) return;
    draggedCardId = Number(cardEl.dataset.cardId);
    event.dataTransfer.setData("text/plain", cardEl.dataset.cardId);
    event.dataTransfer.effectAllowed = "move";
    cardEl.classList.add("is-dragging");
  });

  elements.board.addEventListener("dragover", (event) => {
    const listEl = event.target.closest(".list");
    if (!listEl || draggedCardId === null) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    elements.board.querySelectorAll(".list").forEach((element) => {
      element.classList.toggle("is-over", element === listEl);
    });
  });

  elements.board.addEventListener("drop", (event) => {
    const listEl = event.target.closest(".list");
    if (!listEl) return;
    event.preventDefault();
    const cardId = Number(event.dataTransfer.getData("text/plain"));
    // render ulang bisa membuat dragend tidak sampai ke board
    draggedCardId = null;
    clearDragClasses();
    moveCard({ cardId, targetListId: Number(listEl.dataset.listId) });
  });

  elements.board.addEventListener("dragend", () => {
    draggedCardId = null;
    clearDragClasses();
  });
}

function setupEvents() {
  setupClickAndSubmit();
  setupForms();
  setupDragAndDrop();
}

// ===== 8. app =====
// titik masuk aplikasi. Hanya merangkai module lain.

setupEvents();
loadBoard();
