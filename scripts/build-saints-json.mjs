import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ephemerisPath = path.join(__dirname, "data", "ephemeris.json");
const fetePath = path.join(__dirname, "data", "prenoms-fete.json");
const outPath = path.join(__dirname, "..", "src", "data", "saintsFr.json");

const MONTHS = {
  january: "01",
  february: "02",
  march: "03",
  april: "04",
  may: "05",
  june: "06",
  july: "07",
  august: "08",
  september: "09",
  october: "10",
  november: "11",
  december: "12",
};

const MONTH_LABELS = {
  janvier: "01",
  février: "02",
  fevrier: "02",
  mars: "03",
  avril: "04",
  mai: "05",
  juin: "06",
  juillet: "07",
  août: "08",
  aout: "08",
  septembre: "09",
  octobre: "10",
  novembre: "11",
  décembre: "12",
  decembre: "12",
};

/** Prénoms féminins courants (calendrier FR + détection). */
const FEMALE = new Set([
  "Adèle", "Adele", "Agathe", "Agnès", "Aimée", "Aimee", "Alida", "Alice", "Amandine",
  "Angèle", "Anne", "Antoinette", "Apolline", "Armande", "Audrey", "Augula", "Aquilina",
  "Beatrice", "Béatrice", "Benedicte", "Bernadette", "Blandine", "Brigitte", "Camille",
  "Catherine", "Cécile", "Cecile", "Chantal", "Charlotte", "Christine", "Claire",
  "Clarisse", "Claudine", "Clotilde", "Colette", "Clemence", "Clémence", "Danielle",
  "Denise", "Diane", "Edith", "Elfie", "Elisabeth", "Elisée", "Ella", "Emma", "Estelle",
  "Esther", "Eugénie", "Eugenie", "Félicité", "Felicité", "Florence", "Françoise",
  "Francoise", "Geneviève", "Genevieve", "Georgette", "Germaine", "Ghislaine", "Gillette",
  "Gisèle", "Gisele", "Gwladys", "Hélène", "Helene", "Henriette", "Honorine", "Irene",
  "Irène", "Isabelle", "Jacqueline", "Jeanne", "Joëlle", "Joelle", "Joséphine",
  "Josephine", "Julie", "Julienne", "Justine", "Larissa", "Lea", "Léa", "Léonie", "Leonie",
  "Lorraine", "Louise", "Lucette", "Lucie", "Madeleine", "Marcelle", "Marguerite", "Marie",
  "Martine", "Mathilde", "Maud", "Micheline", "Monique", "Nathalie", "Natacha", "Ninon",
  "Nina", "Noëlle", "Noelle", "Odette", "Odile", "Paulette", "Paule", "Perrine", "Prisca",
  "Raymonde", "Renée", "Renee", "Rita", "Rolande", "Roseline", "Rosine", "Sabine",
  "Sandrine", "Simone", "Solange", "Suzanne", "Sylviane", "Sylvie", "Tatiana", "Thérèse",
  "Therese", "Valérie", "Valerie", "Véronique", "Veronique", "Viviane", "Xaviere", "Xavière",
  "Yvette", "Yvonne", "Zita", "Alix", "Ginette", "Gwenola", "Gwénola",
  "Béatrice", "Modeste", "Honorine", "Apolline", "Felicia", "Mariana",
  "Marie-Anne", "Marieanne",
]);

/** Entrées liturgiques sans saint patron classique. */
const SKIP_PATTERNS =
  /^(Jour de l'An|Mercredi des Cendres|Fête de la|Conversion de|Notre-Dame|Pentecôte|Pâques|Ascension|Assomption|Immaculée|Trinité|Corpus Christi|Vendredi Saint|Dimanche|Samedi Saint|Lundi|Jeudi|Vendredi|Samedi|L'Annonciation)/i;

function normalizeName(name) {
  return name
    .replace(/\s+/g, " ")
    .replace(/\*$/, "")
    .trim();
}

/** Clé de comparaison sans accents ni casse. */
function nameKey(name) {
  return normalizeName(name)
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

function isFemaleName(name) {
  const clean = normalizeName(name);
  if (FEMALE.has(clean)) return true;
  const first = clean.split(/[\s-]/)[0];
  if (FEMALE.has(first)) return true;
  if (/^(Sainte|Ste)\b/i.test(clean)) return true;
  return false;
}

function isSkippable(name) {
  const clean = normalizeName(name);
  if (!clean) return true;
  return SKIP_PATTERNS.test(clean);
}

function ensureDay(out, key) {
  if (!out[key]) out[key] = { male: [], female: [] };
  return out[key];
}

function pushUnique(list, name) {
  const n = normalizeName(name);
  if (!n) return;
  const key = nameKey(n);
  if (list.some((item) => nameKey(item) === key)) return;
  list.push(n);
}

/** Retire les prénoms déjà couverts par une forme plus complète (ex. « Antoine » si « Antoine de Padoue »). */
function pruneRedundantNames(names) {
  return names.filter((name) => {
    const key = nameKey(name);
    return !names.some(
      (other) =>
        other !== name &&
        nameKey(other).includes(key) &&
        nameKey(other).length > key.length
    );
  });
}

/** Parse « 13 juin » → `06-13`. */
function parseFeteDate(fete) {
  const m = fete.trim().match(/^(\d{1,2})\s+([a-zàâäéèêëïîôùûüç]+)$/i);
  if (!m) return null;
  const day = String(Number(m[1])).padStart(2, "0");
  const monthKey = m[2].toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
  const month = MONTH_LABELS[monthKey];
  if (!month) return null;
  return `${month}-${day}`;
}

const ephemeris = JSON.parse(fs.readFileSync(ephemerisPath, "utf8"));
const out = {};

for (const [monthName, days] of Object.entries(ephemeris)) {
  const month = MONTHS[monthName];
  if (!month || !Array.isArray(days)) continue;

  days.forEach(([rawName, type], index) => {
    const day = String(index + 1).padStart(2, "0");
    const key = `${month}-${day}`;
    const name = normalizeName(rawName);
    if (isSkippable(name)) return;

    const bucket = ensureDay(out, key);
    if (type === "Sainte") {
      pushUnique(bucket.female, name);
    } else if (type === "Saint") {
      pushUnique(bucket.male, name);
    }
  });
}

if (fs.existsSync(fetePath)) {
  const fetes = JSON.parse(fs.readFileSync(fetePath, "utf8"));
  for (const row of fetes) {
    const key = parseFeteDate(row.fete ?? "");
    if (!key || !row.prenom) continue;
    const bucket = ensureDay(out, key);
    const name = normalizeName(row.prenom);
    if (isFemaleName(name)) pushUnique(bucket.female, name);
    else pushUnique(bucket.male, name);
  }
}

for (const key of Object.keys(out)) {
  out[key].male = pruneRedundantNames(out[key].male);
  out[key].female = pruneRedundantNames(out[key].female);
  if (out[key].male.length === 0 && out[key].female.length === 0) {
    delete out[key];
  }
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(out));
console.log(`Écrit ${Object.keys(out).length} jours → ${outPath}`);
console.log("Exemple 06-13:", JSON.stringify(out["06-13"]));
console.log("Exemple 01-02:", JSON.stringify(out["01-02"]));
