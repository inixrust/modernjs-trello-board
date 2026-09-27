// card.js - aksi untuk card: tambah, edit, hapus, pindah.
import { createCard, updateCard, deleteCard } from "./api.js";
import {
  state,
  findCard,
  getCardsByList,
  getNextPosition,
  getInsertPosition,
} from "./state.js";
import { render, reportError, openEditDialog } from "./render.js";

export async function addCard(listId, title) {
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

export function startEditCard(cardId) {
  const card = findCard(cardId);
  if (!card) return;
  openEditDialog(card);
}

export async function editCard(cardId, changes) {
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

export async function removeCard(cardId) {
  try {
    await deleteCard(cardId);
    state.cards = state.cards.filter((card) => card.id !== cardId);
    render();
  } catch (error) {
    reportError("Gagal menghapus card. Coba lagi.", error);
  }
}

// Final challenge: pindahkan card ke list tujuan, SEBELUM beforeCardId
// (null = di akhir list). Optimistic update + rollback, satu PATCH.
function isSamePlace(card, targetListId, beforeCardId) {
  if (beforeCardId === card.id) return true;
  if (card.listId !== targetListId) return false;
  const current = getCardsByList(card.listId);
  const index = current.findIndex((item) => item.id === card.id);
  const nextId = current[index + 1]?.id ?? null;
  return nextId === beforeCardId;
}

// Tiga argumen dibungkus satu object agar pemanggilan mudah dibaca.
export async function moveCard({
  cardId,
  targetListId,
  beforeCardId = null,
}) {
  const card = findCard(cardId);
  if (!card || isSamePlace(card, targetListId, beforeCardId)) return;

  const siblings = getCardsByList(targetListId).filter(
    (item) => item.id !== cardId,
  );
  const changes = {
    listId: targetListId,
    position: getInsertPosition(siblings, beforeCardId),
  };

  state.cards = state.cards.map((item) =>
    item.id === cardId ? { ...item, ...changes } : item,
  );
  render();

  try {
    await updateCard(cardId, changes);
  } catch (error) {
    // rollback HANYA card ini; `card` masih object lama (tanpa mutasi).
    state.cards = state.cards.map((item) =>
      item.id === cardId ? card : item,
    );
    render();
    reportError("Gagal memindahkan card, posisi dikembalikan.", error);
  }
}
