const fs = require("fs");
const { resolve: pathResolve } = require("path");
const { promisify } = require("util");

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const scriptFilePath = pathResolve(__dirname, "../../dist/index.js");
const inputFilePath = pathResolve(__dirname, "../../index.html");
const outFilePath = pathResolve(__dirname, "../../index.html");

(async () => {
  const script = await readFile(scriptFilePath, { encoding: "utf-8" });
  const input = await readFile(inputFilePath, { encoding: "utf-8" });

  await writeFile(outFilePath, input.replace("__INJECT_DIST__", script.trim()));
})();
