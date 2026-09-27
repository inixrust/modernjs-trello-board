// Latihan prediksi event loop (Hari 2 dan Hari 4)
console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");
