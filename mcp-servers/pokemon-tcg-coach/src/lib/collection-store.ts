import * as fs from "fs";
import * as path from "path";

export interface CardEntry {
  name: string;
  number: string;
  count: number;
}

export interface Collection {
  updated: string;
  /** type → set → cards */
  pokemon: Record<string, Record<string, CardEntry[]>>;
  /** set → cards */
  trainer: Record<string, CardEntry[]>;
  /** set → cards */
  energy: Record<string, CardEntry[]>;
}

function emptyCollection(): Collection {
  return {
    updated: new Date().toISOString().slice(0, 10),
    pokemon: {},
    trainer: {},
    energy: {},
  };
}

/**
 * Load collection from a JSON file. Returns an empty collection if the file
 * does not exist.
 */
export function loadCollection(filePath: string): Collection {
  if (!fs.existsSync(filePath)) {
    return emptyCollection();
  }
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as Collection;
  } catch {
    return emptyCollection();
  }
}

/**
 * Atomically write collection to disk. Creates a .bak of the existing file
 * before overwriting. Sets `updated` to today's date.
 */
export function saveCollection(filePath: string, col: Collection): void {
  col.updated = new Date().toISOString().slice(0, 10);

  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Back up existing file
  if (fs.existsSync(filePath)) {
    fs.copyFileSync(filePath, filePath + ".bak");
  }

  // Atomic write: write to .tmp then rename
  const tmpPath = filePath + ".tmp";
  fs.writeFileSync(tmpPath, JSON.stringify(col, null, 2), "utf-8");
  fs.renameSync(tmpPath, filePath);
}

/**
 * Merge a card into the collection. For pokemon, indexes by type then set.
 * For trainer/energy, indexes by set. If a card with the same name+number
 * already exists its count is incremented; otherwise a new entry is pushed.
 */
export function mergeCards(
  col: Collection,
  category: "pokemon" | "trainer" | "energy",
  type: string,
  set: string,
  card: CardEntry
): void {
  if (category === "pokemon") {
    if (!col.pokemon[type]) col.pokemon[type] = {};
    if (!col.pokemon[type][set]) col.pokemon[type][set] = [];
    const arr = col.pokemon[type][set];
    const existing = arr.find((c) => c.name === card.name && c.number === card.number);
    if (existing) {
      existing.count += card.count;
    } else {
      arr.push({ ...card });
    }
  } else {
    // trainer or energy
    const bucket = col[category];
    if (!bucket[set]) bucket[set] = [];
    const arr = bucket[set];
    const existing = arr.find((c) => c.name === card.name && c.number === card.number);
    if (existing) {
      existing.count += card.count;
    } else {
      arr.push({ ...card });
    }
  }
}

export interface RemoveResult {
  removed: number;
  warning?: string;
}

/**
 * Decrement a card's count in the collection. Returns the number actually
 * removed along with an optional warning if more were requested than owned.
 */
export function removeCards(
  col: Collection,
  category: "pokemon" | "trainer" | "energy",
  type: string,
  set: string,
  card: CardEntry
): RemoveResult {
  let arr: CardEntry[] | undefined;

  if (category === "pokemon") {
    arr = col.pokemon[type]?.[set];
  } else {
    arr = (col[category] as Record<string, CardEntry[]>)[set];
  }

  if (!arr) {
    return { removed: 0, warning: `Card "${card.name}" not found in collection.` };
  }

  const existing = arr.find((c) => c.name === card.name && c.number === card.number);
  if (!existing) {
    return { removed: 0, warning: `Card "${card.name}" not found in collection.` };
  }

  if (card.count > existing.count) {
    const had = existing.count;
    existing.count = 0;
    return {
      removed: had,
      warning: `Tried to remove ${card.count} of "${card.name}" but only owned ${had}.`,
    };
  }

  existing.count -= card.count;
  return { removed: card.count };
}
