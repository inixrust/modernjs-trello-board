// Solusi acuan latihan "Membangun Promise Sederhana" (Hari 4).
// BUKAN pengganti Promise native: tidak ada chaining, tidak ada thenable.
function myPromise(executor) {
  let state = "pending";
  let value;
  const handlers = [];

  function runHandler(handler) {
    queueMicrotask(() => {
      const callback =
        state === "fulfilled" ? handler.onFulfilled : handler.onRejected;
      if (callback) callback(value);
    });
  }

  function settle(newState, result) {
    if (state !== "pending") return; // state hanya boleh berubah sekali
    state = newState;
    value = result;
    handlers.forEach(runHandler);
  }

  const resolve = (result) => settle("fulfilled", result);
  const reject = (error) => settle("rejected", error);

  try {
    executor(resolve, reject);
  } catch (error) {
    reject(error);
  }

  return {
    then(onFulfilled, onRejected) {
      const handler = { onFulfilled, onRejected };
      if (state !== "pending") {
        runHandler(handler);
        return;
      }
      handlers.push(handler);
    },
    getState() {
      return state;
    },
  };
}

// --- Uji ---
console.log("1: mulai");

const p1 = myPromise((resolve) => {
  setTimeout(() => resolve("data dari server"), 100);
});
p1.then((value) => console.log("5: p1 fulfilled ->", value));
console.log("2: p1 state =", p1.getState());

const p2 = myPromise((resolve, reject) => {
  reject(new Error("gagal"));
  resolve("diabaikan"); // tidak berpengaruh
});
p2.then(null, (error) => console.log("4: p2 rejected ->", error.message));

console.log("3: sinkron selesai, p2 state =", p2.getState());
