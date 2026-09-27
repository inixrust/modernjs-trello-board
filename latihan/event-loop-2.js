// Tantangan event loop Hari 4
console.log("1");

setTimeout(() => {
  console.log("2");
  Promise.resolve().then(() => console.log("3"));
}, 0);

Promise.resolve()
  .then(() => {
    console.log("4");
    setTimeout(() => console.log("5"), 0);
  })
  .then(() => console.log("6"));

queueMicrotask(() => console.log("7"));

(async () => {
  console.log("8");
  await null;
  console.log("9");
})();

console.log("10");
