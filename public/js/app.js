// app.js - titik masuk aplikasi. Hanya merangkai module lain.
import { setupEvents } from "./events.js";
import { loadBoard } from "./board.js";

setupEvents();
loadBoard();
