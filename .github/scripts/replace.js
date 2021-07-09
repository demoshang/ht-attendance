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
const outJS = pathResolve(__dirname, "../../latest.js");

async function getBuildVersion() {
  const { stdout: currentBranch } = await exec(
    `git rev-parse --abbrev-ref HEAD`
  );

  const { stdout: currentHead } = await exec(`git rev-parse --short HEAD`);

  const { stdout: lastMsg } = await exec(
    `git log --pretty=format:"%s &nbsp;&nbsp;&nbsp;&nbsp; %ai" -3`
  );

  return `${currentBranch.trim()} &nbsp;&nbsp;&nbsp;&nbsp; ${currentHead.trim()}<br>${lastMsg.replace(
    /[\r\n]+/g,
    "<br>"
  )}`;
}

(async () => {
  const script = await readFile(scriptFilePath, { encoding: "utf-8" });
  const input = await readFile(inputFilePath, { encoding: "utf-8" });

  const version = await getBuildVersion();

  await writeFile(outJS, script);

  await writeFile(
    outFilePath,
    input
      // .replace("__INJECT_DIST__", script.trim())
      .replace("__INJECT_VERSION__", version)
  );
})();
