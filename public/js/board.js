// board.js - memuat board beserta list dan card-nya.
import { getBoards, getLists, getCards } from "./api.js";
import { state } from "./state.js";
import { render } from "./render.js";

export async function loadBoard() {
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
