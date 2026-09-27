// events.js - menghubungkan event DOM dengan aksi.
// Tidak memanggil API secara langsung.
import { elements } from "./render.js";
import { isValidTitle } from "./state.js";
import { loadBoard } from "./board.js";
import { addList, removeList } from "./list.js";
import {
  addCard,
  startEditCard,
  editCard,
  removeCard,
  moveCard,
} from "./card.js";

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

const DRAG_CLASSES = [
  "is-dragging",
  "is-over",
  "drop-before",
  "drop-after",
];

function clearDragClasses() {
  const selector = DRAG_CLASSES.map((name) => `.${name}`).join(", ");
  elements.board.querySelectorAll(selector).forEach((element) => {
    element.classList.remove(...DRAG_CLASSES);
  });
}

// Final challenge: apakah kursor di separuh bawah sebuah card?
function isBelowMiddle(cardEl, clientY) {
  const rect = cardEl.getBoundingClientRect();
  return clientY > rect.top + rect.height / 2;
}

// Card mana yang akan berada SESUDAH card yang dijatuhkan (null = akhir).
function getBeforeCardId(event) {
  const cardEl = event.target.closest(".card");
  if (!cardEl) return null;
  const target = isBelowMiddle(cardEl, event.clientY)
    ? cardEl.nextElementSibling
    : cardEl;
  return target?.classList.contains("card")
    ? Number(target.dataset.cardId)
    : null;
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

    // penanda posisi: hanya ubah class, JANGAN render() di dragover
    elements.board
      .querySelectorAll(".drop-before, .drop-after")
      .forEach((element) => {
        element.classList.remove("drop-before", "drop-after");
      });
    const cardEl = event.target.closest(".card");
    if (cardEl && Number(cardEl.dataset.cardId) !== draggedCardId) {
      const below = isBelowMiddle(cardEl, event.clientY);
      cardEl.classList.add(below ? "drop-after" : "drop-before");
    }
  });

  elements.board.addEventListener("drop", (event) => {
    const listEl = event.target.closest(".list");
    if (!listEl) return;
    event.preventDefault();
    const cardId = Number(event.dataTransfer.getData("text/plain"));
    // render ulang bisa membuat dragend tidak sampai ke board
    draggedCardId = null;
    clearDragClasses();
    moveCard({
      cardId,
      targetListId: Number(listEl.dataset.listId),
      beforeCardId: getBeforeCardId(event),
    });
  });

  elements.board.addEventListener("dragend", () => {
    draggedCardId = null;
    clearDragClasses();
  });
}

export function setupEvents() {
  setupClickAndSubmit();
  setupForms();
  setupDragAndDrop();
}
