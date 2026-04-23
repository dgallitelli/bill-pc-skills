import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as os from "os";
import * as fs from "fs";
import * as path from "path";
import {
  loadCollection,
  saveCollection,
  mergeCards,
  removeCards,
  type Collection,
  type CardEntry,
} from "../lib/collection-store.js";

let tmpDir: string;

beforeEach(() => {
  tmpDir = path.join(os.tmpdir(), `collection-test-${Date.now()}`);
  fs.mkdirSync(tmpDir, { recursive: true });
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe("loadCollection", () => {
  it("creates empty collection if file does not exist", () => {
    const col = loadCollection(path.join(tmpDir, "nonexistent.json"));
    expect(col.pokemon).toEqual({});
    expect(col.trainer).toEqual({});
    expect(col.energy).toEqual({});
    expect(col.updated).toBeDefined();
  });

  it("loads existing collection from file", () => {
    const filePath = path.join(tmpDir, "collection.json");
    const existing: Collection = {
      updated: "2026-01-01",
      pokemon: { fire: { OBF: [{ name: "Charizard ex", number: "125", count: 2 }] } },
      trainer: { SVI: [{ name: "Professor's Research", number: "189", count: 4 }] },
      energy: {},
    };
    fs.writeFileSync(filePath, JSON.stringify(existing), "utf-8");

    const col = loadCollection(filePath);
    expect(col.updated).toBe("2026-01-01");
    expect(col.pokemon.fire.OBF[0].name).toBe("Charizard ex");
    expect(col.trainer.SVI[0].count).toBe(4);
  });
});

describe("saveCollection", () => {
  it("saves collection with atomic write and creates .bak backup", () => {
    const filePath = path.join(tmpDir, "collection.json");

    // Create an initial file
    const initial: Collection = {
      updated: "2025-01-01",
      pokemon: {},
      trainer: {},
      energy: {},
    };
    fs.writeFileSync(filePath, JSON.stringify(initial), "utf-8");

    // Save updated collection
    const updated: Collection = {
      updated: "2025-01-01",
      pokemon: { fire: { OBF: [{ name: "Charizard ex", number: "125", count: 1 }] } },
      trainer: {},
      energy: {},
    };
    saveCollection(filePath, updated);

    // Main file should exist and be valid JSON
    const saved = JSON.parse(fs.readFileSync(filePath, "utf-8")) as Collection;
    expect(saved.pokemon.fire.OBF[0].name).toBe("Charizard ex");

    // Backup file should exist
    const bakPath = filePath + ".bak";
    expect(fs.existsSync(bakPath)).toBe(true);
    const bak = JSON.parse(fs.readFileSync(bakPath, "utf-8")) as Collection;
    expect(bak.updated).toBe("2025-01-01");

    // updated field should be set to today
    expect(saved.updated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("saves collection without .bak when no existing file", () => {
    const filePath = path.join(tmpDir, "new-collection.json");
    const col: Collection = { updated: "", pokemon: {}, trainer: {}, energy: {} };
    saveCollection(filePath, col);

    expect(fs.existsSync(filePath)).toBe(true);
    expect(fs.existsSync(filePath + ".bak")).toBe(false);
  });
});

describe("mergeCards", () => {
  it("merges pokemon cards by type and set — new card added", () => {
    const col: Collection = { updated: "", pokemon: {}, trainer: {}, energy: {} };
    const card: CardEntry = { name: "Charizard ex", number: "125", count: 2 };
    mergeCards(col, "pokemon", "fire", "OBF", card);

    expect(col.pokemon.fire.OBF).toHaveLength(1);
    expect(col.pokemon.fire.OBF[0].count).toBe(2);
  });

  it("increments count when merging existing pokemon card", () => {
    const col: Collection = {
      updated: "",
      pokemon: { fire: { OBF: [{ name: "Charizard ex", number: "125", count: 2 }] } },
      trainer: {},
      energy: {},
    };
    const card: CardEntry = { name: "Charizard ex", number: "125", count: 1 };
    mergeCards(col, "pokemon", "fire", "OBF", card);

    expect(col.pokemon.fire.OBF[0].count).toBe(3);
  });

  it("merges trainer cards by set", () => {
    const col: Collection = { updated: "", pokemon: {}, trainer: {}, energy: {} };
    const card: CardEntry = { name: "Professor's Research", number: "189", count: 4 };
    mergeCards(col, "trainer", "", "SVI", card);

    expect(col.trainer.SVI).toHaveLength(1);
    expect(col.trainer.SVI[0].count).toBe(4);
  });

  it("increments count when merging existing trainer card", () => {
    const col: Collection = {
      updated: "",
      pokemon: {},
      trainer: { SVI: [{ name: "Professor's Research", number: "189", count: 3 }] },
      energy: {},
    };
    const card: CardEntry = { name: "Professor's Research", number: "189", count: 1 };
    mergeCards(col, "trainer", "", "SVI", card);

    expect(col.trainer.SVI[0].count).toBe(4);
  });

  it("merges energy cards by set", () => {
    const col: Collection = { updated: "", pokemon: {}, trainer: {}, energy: {} };
    const card: CardEntry = { name: "Basic Fire Energy", number: "", count: 8 };
    mergeCards(col, "energy", "", "SVE", card);

    expect(col.energy.SVE).toHaveLength(1);
    expect(col.energy.SVE[0].count).toBe(8);
  });

  it("distinguishes cards with same name but different numbers", () => {
    const col: Collection = { updated: "", pokemon: {}, trainer: {}, energy: {} };
    mergeCards(col, "trainer", "", "SVI", { name: "Nest Ball", number: "181", count: 2 });
    mergeCards(col, "trainer", "", "SVI", { name: "Nest Ball", number: "255", count: 2 });

    expect(col.trainer.SVI).toHaveLength(2);
  });
});

describe("removeCards", () => {
  it("removes cards and decrements count", () => {
    const col: Collection = {
      updated: "",
      pokemon: { fire: { OBF: [{ name: "Charizard ex", number: "125", count: 3 }] } },
      trainer: {},
      energy: {},
    };
    const result = removeCards(col, "pokemon", "fire", "OBF", {
      name: "Charizard ex",
      number: "125",
      count: 2,
    });

    expect(result.removed).toBe(2);
    expect(result.warning).toBeUndefined();
    expect(col.pokemon.fire.OBF[0].count).toBe(1);
  });

  it("warns when removing more than owned and removes actual count", () => {
    const col: Collection = {
      updated: "",
      pokemon: { fire: { OBF: [{ name: "Charizard ex", number: "125", count: 1 }] } },
      trainer: {},
      energy: {},
    };
    const result = removeCards(col, "pokemon", "fire", "OBF", {
      name: "Charizard ex",
      number: "125",
      count: 4,
    });

    expect(result.removed).toBe(1);
    expect(result.warning).toMatch(/only.*1/i);
    expect(col.pokemon.fire.OBF[0].count).toBe(0);
  });

  it("removes trainer cards", () => {
    const col: Collection = {
      updated: "",
      pokemon: {},
      trainer: { SVI: [{ name: "Professor's Research", number: "189", count: 4 }] },
      energy: {},
    };
    const result = removeCards(col, "trainer", "", "SVI", {
      name: "Professor's Research",
      number: "189",
      count: 4,
    });

    expect(result.removed).toBe(4);
    expect(col.trainer.SVI[0].count).toBe(0);
  });

  it("warns when card not found in collection", () => {
    const col: Collection = { updated: "", pokemon: {}, trainer: {}, energy: {} };
    const result = removeCards(col, "trainer", "", "SVI", {
      name: "Nest Ball",
      number: "181",
      count: 1,
    });

    expect(result.removed).toBe(0);
    expect(result.warning).toBeDefined();
  });
});
