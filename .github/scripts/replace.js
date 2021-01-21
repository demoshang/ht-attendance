const fs = require("fs");
const { resolve: pathResolve } = require("path");
const { promisify } = require("util");
const { exec: originExec } = require("child_process");

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const exec = promisify(originExec);

const scriptFilePath = pathResolve(__dirname, "../../dist/index.js");
const inputFilePath = pathResolve(__dirname, "../../index.html");
const outFilePath = pathResolve(__dirname, "../../index.html");

async function getBuildVersion() {
  const { stdout: currentBranch, stderr } = await exec(
    `git rev-parse --abbrev-ref HEAD`
  );

  const { stdout: currentHead } = await exec(`git rev-parse HEAD`);

  return `${currentBranch.trim()}<br>${new Date().toISOString()}<br>${currentHead.trim()}`;
}

(async () => {
  const script = await readFile(scriptFilePath, { encoding: "utf-8" });
  const input = await readFile(inputFilePath, { encoding: "utf-8" });

  const version = await getBuildVersion();

  await writeFile(
    outFilePath,
    input
      .replace("__INJECT_DIST__", script.trim())
      .replace("__INJECT_VERSION__", version)
  );
})();
