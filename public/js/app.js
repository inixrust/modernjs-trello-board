// Trello Board - Pelatihan Modern JavaScript INIXINDO

// ===== 1. API (Hari 2) =====
// URL relatif: string kosong berarti request ke origin halaman ini,
// mis. "/cards" -> http://localhost:3000/cards.
const API_URL = "";

// TODO: kirim request dengan fetch, header Content-Type JSON, lempar Error
// bila !response.ok, lalu kembalikan response.json().
async function request(path, options = {}) {}

// TODO: GET /boards
async function getBoards() {}

// TODO: GET /lists?boardId=...&_sort=position
async function getLists(boardId) {}

// TODO: GET /cards?_sort=position
async function getCards() {}

// TODO: POST /lists dan POST /cards (body: JSON.stringify(data))
async function createList(data) {}
async function createCard(data) {}

// TODO: PATCH /lists/:id dan PATCH /cards/:id (body: perubahan saja)
async function updateList(id, changes) {}
async function updateCard(id, changes) {}

// TODO: DELETE /lists/:id dan DELETE /cards/:id
async function deleteList(id) {}
async function deleteCard(id) {}
