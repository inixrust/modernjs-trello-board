// render.js - mengubah state menjadi DOM. Tidak memanggil API.
import {
  state,
  getSortedLists,
  getCardsByList,
  TITLE_MAX_LENGTH,
} from "./state.js";

export const elements = {
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

export function render() {
  renderStatus();
  renderBoard();
}

let toastTimer = null;

export function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    elements.toast.hidden = true;
  }, 4000);
}

// Pesan untuk pengguna dibuat umum; detail teknis hanya ke console
// (OWASP: jangan tampilkan detail sistem kepada pengguna).
export function reportError(userMessage, error) {
  console.error(error);
  showToast(userMessage);
}

export function openEditDialog(card) {
  elements.editDialog.dataset.cardId = card.id;
  elements.editForm.elements.title.value = card.title;
  elements.editForm.elements.description.value = card.description ?? "";
  elements.editDialog.showModal();
}
