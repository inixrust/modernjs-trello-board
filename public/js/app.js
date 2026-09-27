// Trello Board - Pelatihan Modern JavaScript INIXINDO

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
