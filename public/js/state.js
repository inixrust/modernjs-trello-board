// state.js - sumber kebenaran data di browser + fungsi baca (selector).
// Module ini tidak menyentuh DOM dan tidak memanggil API.
export const TITLE_MAX_LENGTH = 80;

export const state = {
  board: null,
  lists: [],
  cards: [],
  status: "idle", // "idle" | "loading" | "ready" | "error"
  message: "",
};

const byPosition = (first, second) => first.position - second.position;

export function findCard(cardId) {
  return state.cards.find((card) => card.id === cardId);
}

export function findList(listId) {
  return state.lists.find((list) => list.id === listId);
}

export function getSortedLists() {
  return state.lists.toSorted(byPosition);
}

export function getCardsByList(listId) {
  return state.cards
    .filter((card) => card.listId === listId)
    .toSorted(byPosition);
}

export function getNextPosition(items) {
  const maxPosition = items.reduce(
    (max, item) => Math.max(max, item.position),
    0,
  );
  return maxPosition + 1000;
}

// Final challenge: posisi untuk card yang disisipkan SEBELUM beforeCardId.
// siblings = card list tujuan (terurut) TANPA card yang sedang dipindah.
export function getInsertPosition(siblings, beforeCardId) {
  if (beforeCardId === null) return getNextPosition(siblings);

  const index = siblings.findIndex((card) => card.id === beforeCardId);
  const next = siblings[index];
  const prevPosition = index > 0 ? siblings[index - 1].position : 0;
  return (prevPosition + next.position) / 2;
}

// Validasi di browser hanya untuk kenyamanan pengguna.
// Server sungguhan WAJIB memvalidasi ulang (OWASP: jangan percaya klien).
export function isValidTitle(title) {
  return title !== "" && title.length <= TITLE_MAX_LENGTH;
}
