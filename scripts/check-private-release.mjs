import {readFile} from "node:fs/promises";

const files = [
  ".github/workflows/release.yml",
  ".github/workflows/private-release.yml",
  ".github/workflows/update-amo-metadata.yml"
];

for (const file of files) {
  const content = await readFile(file, "utf8");
  if (/--channel(?:=|\s+)listed(?:\s|$)/.test(content)) {
    throw new Error(`${file} enables forbidden listed/public Firefox publishing`);
  }
}

const privateWorkflow = await readFile(".github/workflows/private-release.yml", "utf8");
if (!/--channel(?:=|\s+)unlisted(?:\s|$)/.test(privateWorkflow)) {
  throw new Error("private-release.yml must explicitly use the unlisted channel");
}

console.log("Firefox publishing is private-only and unlisted");
