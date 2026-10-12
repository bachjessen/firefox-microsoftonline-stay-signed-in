import {cp, mkdir, readFile, rm, writeFile} from "node:fs/promises";
import {join} from "node:path";

const sharedFiles = ["icons", "popup", "stay-signed-in.js"];
const targets = [
  {name: "firefox", manifest: "manifest.json"},
  {name: "chromium", manifest: "manifest.chromium.json"}
];

await rm("dist", {recursive: true, force: true});

for (const target of targets) {
  const outputDirectory = join("dist", target.name);
  await mkdir(outputDirectory, {recursive: true});

  for (const path of sharedFiles) {
    await cp(path, join(outputDirectory, path), {recursive: true});
  }

  const manifest = await readFile(target.manifest, "utf8");
  await writeFile(join(outputDirectory, "manifest.json"), manifest);
  console.log(`${target.name} build created at ${outputDirectory}`);
}
