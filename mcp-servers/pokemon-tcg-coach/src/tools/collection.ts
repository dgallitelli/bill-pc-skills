import { resolve } from "path";
import { parsePtcglDecklist } from "../lib/ptcgl-parser.js";
import { searchCards } from "../lib/tcgdex.js";
import {
  loadCollection,
  saveCollection,
  mergeCards,
  removeCards,
  type CardEntry,
} from "../lib/collection-store.js";

const DATA_DIR = process.env.COLLECTION_DATA_DIR || resolve(process.cwd(), "collection");
const COLLECTION_PATH = resolve(DATA_DIR, "collection.json");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Look up a pokemon card's primary type via tcgdex. Falls back to "colorless"
 * if the lookup fails or returns no type.
 */
async function resolveCardType(name: string, set: string, number: string): Promise<string> {
  try {
    const results = await searchCards(name, { set }, 5);
    const match = results.find(
      (c) =>
        c.name.toLowerCase() === name.toLowerCase() &&
        (number === "" || String(c.localId) === number)
    ) ?? results[0];

    if (match?.types && match.types.length > 0) {
      return match.types[0].toLowerCase();
    }
  } catch {
    // fall through
  }
  return "colorless";
}

// ---------------------------------------------------------------------------
// Tool: collection-import
// ---------------------------------------------------------------------------

export const COLLECTION_IMPORT_TOOL = {
  name: "collection-import",
  description:
    "Import a PTCGL decklist or card list into the user's collection. " +
    "Accepts the raw PTCGL export text. Pokemon cards are categorized by " +
    "type via the tcgdex API.",
  inputSchema: {
    type: "object" as const,
    properties: {
      text: {
        type: "string",
        description: "PTCGL-format card list text to import into the collection.",
      },
    },
    required: ["text"],
  },
};

export async function handleCollectionImport(args: { text: string }): Promise<string> {
  const parsed = parsePtcglDecklist(args.text);
  const col = loadCollection(COLLECTION_PATH);

  let newCards = 0;
  let updatedCards = 0;

  const countBefore = (category: "pokemon" | "trainer" | "energy", key: string, name: string, number: string): number => {
    if (category === "pokemon") {
      for (const type of Object.keys(col.pokemon)) {
        const sets = col.pokemon[type];
        for (const set of Object.keys(sets)) {
          const found = sets[set].find((c) => c.name === name && c.number === number);
          if (found) return found.count;
        }
      }
      return -1;
    } else {
      const bucket = (col[category] as Record<string, CardEntry[]>)[key] ?? [];
      const found = bucket.find((c) => c.name === name && c.number === number);
      return found ? found.count : -1;
    }
  };

  // Process pokemon (need type lookup)
  for (const card of parsed.pokemon) {
    const type = await resolveCardType(card.name, card.set, card.number);
    const before = countBefore("pokemon", card.set, card.name, card.number);
    mergeCards(col, "pokemon", type, card.set, {
      name: card.name,
      number: card.number,
      count: card.count,
    });
    if (before === -1) newCards++; else updatedCards++;
  }

  // Process trainers
  for (const card of parsed.trainer) {
    const before = countBefore("trainer", card.set, card.name, card.number);
    mergeCards(col, "trainer", "", card.set, {
      name: card.name,
      number: card.number,
      count: card.count,
    });
    if (before === -1) newCards++; else updatedCards++;
  }

  // Process energy
  for (const card of parsed.energy) {
    const before = countBefore("energy", card.set, card.name, card.number);
    mergeCards(col, "energy", "", card.set, {
      name: card.name,
      number: card.number,
      count: card.count,
    });
    if (before === -1) newCards++; else updatedCards++;
  }

  saveCollection(COLLECTION_PATH, col);

  return `Collection updated: ${newCards} new cards added, ${updatedCards} existing cards updated.`;
}

// ---------------------------------------------------------------------------
// Tool: collection-view
// ---------------------------------------------------------------------------

export const COLLECTION_VIEW_TOOL = {
  name: "collection-view",
  description:
    "View the user's card collection. Optionally filter by category (pokemon/trainer/energy), " +
    "pokemon type, or set code.",
  inputSchema: {
    type: "object" as const,
    properties: {
      category: {
        type: "string",
        enum: ["pokemon", "trainer", "energy"],
        description: "Filter by card category.",
      },
      type: {
        type: "string",
        description: "Filter pokemon by type (e.g. 'fire', 'water'). Only applies to pokemon.",
      },
      set: {
        type: "string",
        description: "Filter by set code (e.g. 'OBF', 'SVI').",
      },
    },
    required: [],
  },
};

export async function handleCollectionView(args: {
  category?: string;
  type?: string;
  set?: string;
}): Promise<string> {
  const col = loadCollection(COLLECTION_PATH);

  const isEmpty =
    Object.keys(col.pokemon).length === 0 &&
    Object.keys(col.trainer).length === 0 &&
    Object.keys(col.energy).length === 0;

  if (isEmpty) {
    return "No collection found. Use collection-import to add cards.";
  }

  type FilteredResult = {
    pokemon?: Record<string, Record<string, CardEntry[]>>;
    trainer?: Record<string, CardEntry[]>;
    energy?: Record<string, CardEntry[]>;
    updated: string;
  };

  const result: FilteredResult = { updated: col.updated };

  const categories = args.category
    ? [args.category as "pokemon" | "trainer" | "energy"]
    : (["pokemon", "trainer", "energy"] as const);

  for (const cat of categories) {
    if (cat === "pokemon") {
      let types = col.pokemon;
      if (args.type) {
        types = args.type in types ? { [args.type]: types[args.type] } : {};
      }
      if (args.set) {
        const filtered: Record<string, Record<string, CardEntry[]>> = {};
        for (const [t, sets] of Object.entries(types)) {
          if (args.set in sets) {
            filtered[t] = { [args.set]: sets[args.set] };
          }
        }
        types = filtered;
      }
      result.pokemon = types;
    } else {
      let bucket = col[cat] as Record<string, CardEntry[]>;
      if (args.set) {
        bucket = args.set in bucket ? { [args.set]: bucket[args.set] } : {};
      }
      result[cat] = bucket;
    }
  }

  const hasContent =
    (result.pokemon && Object.keys(result.pokemon).length > 0) ||
    (result.trainer && Object.keys(result.trainer).length > 0) ||
    (result.energy && Object.keys(result.energy).length > 0);

  if (!hasContent) {
    return "No cards match the specified filters.";
  }

  return JSON.stringify(result, null, 2);
}

// ---------------------------------------------------------------------------
// Tool: collection-remove
// ---------------------------------------------------------------------------

export const COLLECTION_REMOVE_TOOL = {
  name: "collection-remove",
  description:
    "Remove cards from the user's collection using PTCGL-format text. " +
    "Reports how many of each card were removed and warns if counts exceed what is owned.",
  inputSchema: {
    type: "object" as const,
    properties: {
      text: {
        type: "string",
        description: "PTCGL-format card list text specifying cards and counts to remove.",
      },
    },
    required: ["text"],
  },
};

export async function handleCollectionRemove(args: { text: string }): Promise<string> {
  const parsed = parsePtcglDecklist(args.text);
  const col = loadCollection(COLLECTION_PATH);

  const lines: string[] = [];
  let totalRemoved = 0;
  const warnings: string[] = [];

  for (const card of parsed.pokemon) {
    const type = await resolveCardType(card.name, card.set, card.number);
    const result = removeCards(col, "pokemon", type, card.set, {
      name: card.name,
      number: card.number,
      count: card.count,
    });
    totalRemoved += result.removed;
    lines.push(`  Removed ${result.removed}x ${card.name} (${card.set} ${card.number})`);
    if (result.warning) warnings.push(result.warning);
  }

  for (const card of parsed.trainer) {
    const result = removeCards(col, "trainer", "", card.set, {
      name: card.name,
      number: card.number,
      count: card.count,
    });
    totalRemoved += result.removed;
    lines.push(`  Removed ${result.removed}x ${card.name} (${card.set} ${card.number})`);
    if (result.warning) warnings.push(result.warning);
  }

  for (const card of parsed.energy) {
    const result = removeCards(col, "energy", "", card.set, {
      name: card.name,
      number: card.number,
      count: card.count,
    });
    totalRemoved += result.removed;
    lines.push(`  Removed ${result.removed}x ${card.name} (${card.set} ${card.number})`);
    if (result.warning) warnings.push(result.warning);
  }

  saveCollection(COLLECTION_PATH, col);

  const summary = [`Collection updated: ${totalRemoved} cards removed.`, ...lines];
  if (warnings.length > 0) {
    summary.push("", "Warnings:", ...warnings.map((w) => `  ⚠ ${w}`));
  }

  return summary.join("\n");
}
