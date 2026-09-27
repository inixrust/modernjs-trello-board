// list.js - aksi untuk list: tambah dan hapus.
import { createList, deleteList } from "./api.js";
import {
  state,
  findList,
  getCardsByList,
  getNextPosition,
} from "./state.js";
import { render, reportError } from "./render.js";

export async function addList(title) {
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

export async function removeList(listId) {
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
