// card.js - aksi untuk card: tambah, edit, hapus, pindah.
import { createCard, updateCard, deleteCard } from "./api.js";
import {
  state,
  findCard,
  getCardsByList,
  getNextPosition,
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

// Optimistic update: UI berubah dulu, server menyusul,
// rollback bila gagal.
export async function moveCard({ cardId, targetListId }) {
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
