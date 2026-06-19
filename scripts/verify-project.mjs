import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));

if (pkg.name !== "k3-startpage") {
  console.error(
    `[deploy] Mauvais projet : "${pkg.name}" — lancez le déploiement depuis D:\\__APPS\\startpage (StartPage), pas FootCup.`
  );
  process.exit(1);
}

console.log("[startpage] Projet vérifié.");

if (process.env.npm_lifecycle_event === "dev") {
  console.log("[startpage] Dev → http://localhost:5180 (FootCup utilise :5173 par défaut)");
}
