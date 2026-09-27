// Latihan "Membangun Promise Sederhana" (Hari 4) - titik awal tahap 1.
// BUKAN pengganti Promise native. Jalankan: node latihan/my-promise.js
function myPromise(executor) {
  let state = "pending";

  function resolve(value) {
    state = "fulfilled";
    console.log("fulfilled:", value);
  }

  function reject(error) {
    state = "rejected";
    console.error("rejected:", error);
  }

  executor(resolve, reject);

  // TODO tahap 2: state hanya boleh berubah sekali, simpan value
  // TODO tahap 3: kembalikan { then(onFulfilled, onRejected), getState() }
  //               dengan antrean handlers saat masih pending
  // TODO tahap 4: jalankan callback lewat queueMicrotask
  // TODO bonus  : executor yang melempar error -> rejected
}

// --- Tahap 1 ---
myPromise((resolve, reject) => {
  resolve("pertama");
  reject("kedua");
  resolve("ketiga");
});

// --- Uji tahap 3 dan 4: hapus komentar setelah then() tersedia ---
// console.log("1: mulai");
// const p1 = myPromise((resolve) => {
//   setTimeout(() => resolve("data dari server"), 100);
// });
// p1.then((value) => console.log("5: p1 fulfilled ->", value));
// console.log("2: p1 state =", p1.getState());
// const p2 = myPromise((resolve, reject) => {
//   reject(new Error("gagal"));
//   resolve("diabaikan");
// });
// p2.then(null, (error) => console.log("4: p2 rejected ->", error.message));
// console.log("3: sinkron selesai, p2 state =", p2.getState());
