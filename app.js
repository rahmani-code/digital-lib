// const path = require("path");
// var pathObj = path.parse(__filename);

// console.log(pathObj);

const os = require("os");

const totalMemorey = os.totalmem();
const freeMemory = os.freemem();

console.log(`Total Memory: ${totalMemorey}`);
console.log(`Free Memory: ${freeMemory}`);
