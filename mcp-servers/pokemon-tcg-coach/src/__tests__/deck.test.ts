import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as os from "os";
import * as fs from "fs";
import * as path from "path";
import {
  slugify,
  saveDeck,
  listDecks,
  getDeck,
  deleteDeck,
} from "../tools/deck.js";

let tmpDir: string;

beforeEach(() => {
  tmpDir = path.join(os.tmpdir(), `deck-test-${Date.now()}`);
  fs.mkdirSync(tmpDir, { recursive: true });
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe("slugify", () => {
  it("converts 'Charizard ex Aggro' to 'charizard-ex-aggro'", () => {
    expect(slugify("Charizard ex Aggro")).toBe("charizard-ex-aggro");
  });

  it("converts 'Lost Zone Box' to 'lost-zone-box'", () => {
    expect(slugify("Lost Zone Box")).toBe("lost-zone-box");
  });

  it("trims leading and trailing hyphens from '  Gardevoir   EX  '", () => {
    expect(slugify("  Gardevoir   EX  ")).toBe("gardevoir-ex");
  });

  it("handles special characters", () => {
    expect(slugify("Iron Valiant ex!")).toBe("iron-valiant-ex");
  });

  it("collapses multiple spaces/hyphens", () => {
    expect(slugify("Lugia   V-Star")).toBe("lugia-v-star");
  });
});

describe("saveDeck", () => {
  it("creates file at correct path and returns the path", () => {
    const content = "Pokémon: 1\n1 Charizard ex OBF 125\n\nTrainer: 0\n\nEnergy: 0\n";
    const savedPath = saveDeck(tmpDir, "Charizard Aggro", content);

    const expectedPath = path.join(tmpDir, "decks", "charizard-aggro.txt");
    expect(savedPath).toBe(expectedPath);
    expect(fs.existsSync(savedPath)).toBe(true);
    expect(fs.readFileSync(savedPath, "utf-8")).toBe(content);
  });

  it("creates decks subdirectory if it does not exist", () => {
    const decksDir = path.join(tmpDir, "decks");
    expect(fs.existsSync(decksDir)).toBe(false);

    saveDeck(tmpDir, "Test Deck", "Pokémon: 0\n\nTrainer: 0\n\nEnergy: 0\n");

    expect(fs.existsSync(decksDir)).toBe(true);
  });
});

describe("listDecks", () => {
  it("returns empty array when no decks exist", () => {
    const decks = listDecks(tmpDir);
    expect(decks).toEqual([]);
  });

  it("returns saved decks with names and card counts", () => {
    const content1 = `Pokémon: 4
4 Charizard ex OBF 125

Trainer: 2
2 Professor's Research SVI 189

Energy: 4
4 Basic Fire Energy SVE

Total Cards: 10
`;
    const content2 = `Pokémon: 0

Trainer: 4
4 Nest Ball SVI 181

Energy: 0

Total Cards: 4
`;
    saveDeck(tmpDir, "Charizard Deck", content1);
    saveDeck(tmpDir, "Trainer Only", content2);

    const decks = listDecks(tmpDir);
    expect(decks).toHaveLength(2);

    const charDeck = decks.find((d) => d.name === "charizard-deck");
    expect(charDeck).toBeDefined();
    expect(charDeck!.cards).toBe(10);

    const trainerDeck = decks.find((d) => d.name === "trainer-only");
    expect(trainerDeck).toBeDefined();
    expect(trainerDeck!.cards).toBe(4);
  });

  it("includes modified date for each deck", () => {
    saveDeck(tmpDir, "My Deck", "Pokémon: 0\n\nTrainer: 0\n\nEnergy: 0\n");
    const decks = listDecks(tmpDir);
    expect(decks[0].modified).toBeDefined();
    expect(decks[0].modified).toBeInstanceOf(Date);
  });
});

describe("getDeck", () => {
  it("returns deck contents by name", () => {
    const content = "Pokémon: 1\n1 Pikachu SVI 010\n\nTrainer: 0\n\nEnergy: 0\n";
    saveDeck(tmpDir, "Pikachu Deck", content);

    const result = getDeck(tmpDir, "Pikachu Deck");
    expect(result).toBe(content);
  });

  it("returns null for nonexistent deck", () => {
    const result = getDeck(tmpDir, "Nonexistent");
    expect(result).toBeNull();
  });
});

describe("deleteDeck", () => {
  it("removes deck file and returns true", () => {
    saveDeck(tmpDir, "Delete Me", "Pokémon: 0\n\nTrainer: 0\n\nEnergy: 0\n");
    const deckPath = path.join(tmpDir, "decks", "delete-me.txt");
    expect(fs.existsSync(deckPath)).toBe(true);

    const result = deleteDeck(tmpDir, "Delete Me");
    expect(result).toBe(true);
    expect(fs.existsSync(deckPath)).toBe(false);
  });

  it("returns false for nonexistent deck", () => {
    const result = deleteDeck(tmpDir, "Nonexistent");
    expect(result).toBe(false);
  });
});
