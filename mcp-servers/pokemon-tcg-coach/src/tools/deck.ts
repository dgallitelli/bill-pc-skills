import { resolve } from "path";
import * as fs from "fs";
import * as path from "path";
import { parsePtcglDecklist } from "../lib/ptcgl-parser.js";
import { loadCollection } from "../lib/collection-store.js";
import type { CardEntry } from "../lib/collection-store.js";

const COLLECTION_DIR = process.env.COLLECTION_DATA_DIR || resolve(process.cwd(), "collection");

// ---------------------------------------------------------------------------
// Utility functions (exported for testing)
// ---------------------------------------------------------------------------

/**
 * Convert a deck name to a URL/filename-safe slug.
 * Lowercases, replaces non-alphanumeric characters with hyphens, collapses
 * multiple hyphens, and trims leading/trailing hyphens.
 */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Write a deck file to `{baseDir}/decks/{slug}.txt`. Creates the directory if
 * needed. Returns the absolute path of the saved file.
 */
export function saveDeck(baseDir: string, name: string, content: string): string {
  const decksDir = path.join(baseDir, "decks");
  fs.mkdirSync(decksDir, { recursive: true });
  const slug = slugify(name);
  const filePath = path.join(decksDir, `${slug}.txt`);
  fs.writeFileSync(filePath, content, "utf-8");
  return filePath;
}

/**
 * List all decks in `{baseDir}/decks/`. Parses each file to compute card count.
 */
export function listDecks(
  baseDir: string
): Array<{ name: string; cards: number; modified: Date }> {
  const decksDir = path.join(baseDir, "decks");
  if (!fs.existsSync(decksDir)) return [];

  const files = fs.readdirSync(decksDir).filter((f) => f.endsWith(".txt"));
  return files.map((file) => {
    const filePath = path.join(decksDir, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const parsed = parsePtcglDecklist(content);
    const cards =
      parsed.pokemon.reduce((s, c) => s + c.count, 0) +
      parsed.trainer.reduce((s, c) => s + c.count, 0) +
      parsed.energy.reduce((s, c) => s + c.count, 0);
    const stat = fs.statSync(filePath);
    return {
      name: file.replace(/\.txt$/, ""),
      cards,
      modified: stat.mtime,
    };
  });
}

/**
 * Read a deck file by name (slugified). Returns null if not found.
 */
export function getDeck(baseDir: string, name: string): string | null {
  const filePath = path.join(baseDir, "decks", `${slugify(name)}.txt`);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf-8");
}

/**
 * Delete a deck file by name. Returns false if the file does not exist.
 */
export function deleteDeck(baseDir: string, name: string): boolean {
  const filePath = path.join(baseDir, "decks", `${slugify(name)}.txt`);
  if (!fs.existsSync(filePath)) return false;
  fs.unlinkSync(filePath);
  return true;
}

// ---------------------------------------------------------------------------
// Tool: deck-save
// ---------------------------------------------------------------------------

export const DECK_SAVE_TOOL = {
  name: "deck-save",
  description:
    "Save a PTCGL decklist under a given name. Overwrites any existing deck " +
    "with the same slug.",
  inputSchema: {
    type: "object" as const,
    properties: {
      name: { type: "string", description: "Human-readable deck name." },
      decklist: { type: "string", description: "PTCGL-format decklist text." },
    },
    required: ["name", "decklist"],
  },
};

export async function handleDeckSave(args: {
  name: string;
  decklist: string;
}): Promise<string> {
  const parsed = parsePtcglDecklist(args.decklist);
  const pokemonCount = parsed.pokemon.reduce((s, c) => s + c.count, 0);
  const trainerCount = parsed.trainer.reduce((s, c) => s + c.count, 0);
  const energyCount = parsed.energy.reduce((s, c) => s + c.count, 0);
  const total = pokemonCount + trainerCount + energyCount;

  const savedPath = saveDeck(COLLECTION_DIR, args.name, args.decklist);

  return [
    `Deck "${args.name}" saved (${slugify(args.name)}.txt).`,
    `Total: ${total} cards — Pokémon: ${pokemonCount}, Trainer: ${trainerCount}, Energy: ${energyCount}`,
    `Path: ${savedPath}`,
  ].join("\n");
}

// ---------------------------------------------------------------------------
// Tool: deck-list
// ---------------------------------------------------------------------------

export const DECK_LIST_TOOL = {
  name: "deck-list",
  description: "List all saved decks with their card counts and last-modified dates.",
  inputSchema: {
    type: "object" as const,
    properties: {},
    required: [],
  },
};

export async function handleDeckList(_args: Record<string, never>): Promise<string> {
  const decks = listDecks(COLLECTION_DIR);
  if (decks.length === 0) {
    return "No decks saved yet. Use deck-save to add a deck.";
  }
  const lines = decks.map((d) => {
    const date = d.modified.toISOString().slice(0, 10);
    return `  ${d.name}  (${d.cards} cards, last modified ${date})`;
  });
  return [`Saved decks (${decks.length}):`, ...lines].join("\n");
}

// ---------------------------------------------------------------------------
// Tool: deck-get
// ---------------------------------------------------------------------------

export const DECK_GET_TOOL = {
  name: "deck-get",
  description: "Retrieve the PTCGL-format contents of a saved deck by name.",
  inputSchema: {
    type: "object" as const,
    properties: {
      name: { type: "string", description: "Deck name (will be slugified for lookup)." },
    },
    required: ["name"],
  },
};

export async function handleDeckGet(args: { name: string }): Promise<string> {
  const content = getDeck(COLLECTION_DIR, args.name);
  if (content === null) {
    return `Deck "${args.name}" not found. Use deck-list to see available decks.`;
  }
  return content;
}

// ---------------------------------------------------------------------------
// Tool: deck-delete
// ---------------------------------------------------------------------------

export const DECK_DELETE_TOOL = {
  name: "deck-delete",
  description: "Delete a saved deck by name.",
  inputSchema: {
    type: "object" as const,
    properties: {
      name: { type: "string", description: "Deck name to delete." },
    },
    required: ["name"],
  },
};

export async function handleDeckDelete(args: { name: string }): Promise<string> {
  const deleted = deleteDeck(COLLECTION_DIR, args.name);
  if (!deleted) {
    return `Deck "${args.name}" not found. Use deck-list to see available decks.`;
  }
  return `Deck "${args.name}" deleted.`;
}

// ---------------------------------------------------------------------------
// Tool: deck-diff
// ---------------------------------------------------------------------------

export const DECK_DIFF_TOOL = {
  name: "deck-diff",
  description:
    "Compare a target decklist against the user's collection to see what cards " +
    "are owned and what is still needed. Provide either `decklist` (raw PTCGL text) " +
    "or `deck_name` (a saved deck name), but not both.",
  inputSchema: {
    type: "object" as const,
    properties: {
      decklist: {
        type: "string",
        description: "PTCGL-format decklist text to compare against collection.",
      },
      deck_name: {
        type: "string",
        description: "Name of a saved deck to compare against collection.",
      },
    },
    required: [],
  },
};

export async function handleDeckDiff(args: {
  decklist?: string;
  deck_name?: string;
}): Promise<string> {
  if (!args.decklist && !args.deck_name) {
    return "Error: provide either `decklist` or `deck_name`.";
  }
  if (args.decklist && args.deck_name) {
    return "Error: provide either `decklist` or `deck_name`, not both.";
  }

  let deckText: string;
  if (args.deck_name) {
    const content = getDeck(COLLECTION_DIR, args.deck_name);
    if (content === null) {
      return `Deck "${args.deck_name}" not found. Use deck-list to see available decks.`;
    }
    deckText = content;
  } else {
    deckText = args.decklist!;
  }

  const target = parsePtcglDecklist(deckText);
  const col = loadCollection(
    resolve(COLLECTION_DIR, "collection.json")
  );

  interface DiffCard {
    name: string;
    set: string;
    number: string;
    needed: number;
    owned: number;
    missing: number;
  }

  const ownedCount = (
    category: "pokemon" | "trainer" | "energy",
    name: string,
    number: string
  ): number => {
    if (category === "pokemon") {
      for (const type of Object.keys(col.pokemon)) {
        for (const set of Object.keys(col.pokemon[type])) {
          const found = col.pokemon[type][set].find(
            (c) => c.name === name && c.number === number
          );
          if (found) return found.count;
        }
      }
      return 0;
    }
    const bucket = col[category] as Record<string, CardEntry[]>;
    for (const set of Object.keys(bucket)) {
      const found = bucket[set].find((c) => c.name === name && c.number === number);
      if (found) return found.count;
    }
    return 0;
  };

  const diffCards = (
    cards: typeof target.pokemon,
    category: "pokemon" | "trainer" | "energy"
  ): DiffCard[] =>
    cards.map((card) => {
      const owned = ownedCount(category, card.name, card.number);
      return {
        name: card.name,
        set: card.set,
        number: card.number,
        needed: card.count,
        owned: Math.min(owned, card.count),
        missing: Math.max(0, card.count - owned),
      };
    });

  const pokemonDiff = diffCards(target.pokemon, "pokemon");
  const trainerDiff = diffCards(target.trainer, "trainer");
  const energyDiff = diffCards(target.energy, "energy");

  const allDiff = [...pokemonDiff, ...trainerDiff, ...energyDiff];
  const totalNeeded = allDiff.reduce((s, c) => s + c.needed, 0);
  const totalOwned = allDiff.reduce((s, c) => s + c.owned, 0);
  const totalMissing = allDiff.reduce((s, c) => s + c.missing, 0);

  const formatSection = (cards: DiffCard[], label: string): string[] => {
    if (cards.length === 0) return [];
    const lines = [`${label}:`];
    for (const c of cards) {
      const numStr = c.number ? ` ${c.number}` : "";
      const status = c.missing === 0 ? "✓" : `missing ${c.missing}`;
      lines.push(`  ${c.needed}x ${c.name} ${c.set}${numStr}  — owned ${c.owned}/${c.needed} (${status})`);
    }
    return lines;
  };

  // Set-based purchase suggestions for missing cards
  const missingBySet: Record<string, string[]> = {};
  for (const c of allDiff) {
    if (c.missing > 0) {
      if (!missingBySet[c.set]) missingBySet[c.set] = [];
      missingBySet[c.set].push(`${c.missing}x ${c.name}`);
    }
  }

  const lines: string[] = [
    `Deck vs. Collection — ${totalOwned}/${totalNeeded} cards owned, ${totalMissing} missing`,
    "",
    ...formatSection(pokemonDiff, "Pokémon"),
    ...(pokemonDiff.length > 0 ? [""] : []),
    ...formatSection(trainerDiff, "Trainer"),
    ...(trainerDiff.length > 0 ? [""] : []),
    ...formatSection(energyDiff, "Energy"),
  ];

  if (totalMissing > 0) {
    lines.push("", "Purchase suggestions by set:");
    for (const [set, cards] of Object.entries(missingBySet)) {
      lines.push(`  ${set}: ${cards.join(", ")}`);
    }
  }

  return lines.join("\n");
}
