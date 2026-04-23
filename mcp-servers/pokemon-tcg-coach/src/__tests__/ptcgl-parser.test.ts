import { describe, it, expect } from "vitest";
import { parsePtcglDecklist, serializeDecklist } from "../lib/ptcgl-parser.js";

const SAMPLE_DECKLIST = `Pokémon: 4
4 Charizard ex OBF 125

Trainer: 6
4 Professor's Research SVI 189
2 Boss's Orders PAL 172

Energy: 4
4 Basic Fire Energy SVE

Total Cards: 14
`;

const SAMPLE_WITH_ASCII_POKEMON = `Pokemon: 4
4 Charizard ex OBF 125

Trainer: 6
4 Professor's Research SVI 189
2 Boss's Orders PAL 172

Energy: 4
4 Basic Fire Energy SVE

Total Cards: 14
`;

describe("parsePtcglDecklist", () => {
  it("parses a complete decklist into pokemon, trainer, energy sections", () => {
    const result = parsePtcglDecklist(SAMPLE_DECKLIST);
    expect(result.pokemon).toHaveLength(1);
    expect(result.trainer).toHaveLength(2);
    expect(result.energy).toHaveLength(1);
  });

  it("extracts card fields correctly", () => {
    const result = parsePtcglDecklist(SAMPLE_DECKLIST);
    const charizard = result.pokemon[0];
    expect(charizard.count).toBe(4);
    expect(charizard.name).toBe("Charizard ex");
    expect(charizard.set).toBe("OBF");
    expect(charizard.number).toBe("125");
  });

  it("handles accented Pokémon header", () => {
    const result = parsePtcglDecklist(SAMPLE_DECKLIST);
    expect(result.pokemon).toHaveLength(1);
  });

  it("also handles ASCII Pokemon header", () => {
    const result = parsePtcglDecklist(SAMPLE_WITH_ASCII_POKEMON);
    expect(result.pokemon).toHaveLength(1);
  });

  it("handles leading zeros in card numbers (051 → '51')", () => {
    const text = `Pokémon: 1
1 Bulbasaur SVI 051

Trainer: 0

Energy: 0
`;
    const result = parsePtcglDecklist(text);
    expect(result.pokemon[0].number).toBe("51");
  });

  it("handles basic energy without card number", () => {
    const result = parsePtcglDecklist(SAMPLE_DECKLIST);
    const energy = result.energy[0];
    expect(energy.count).toBe(4);
    expect(energy.name).toBe("Basic Fire Energy");
    expect(energy.set).toBe("SVE");
    expect(energy.number).toBe("");
  });

  it("ignores blank lines", () => {
    const text = `Pokémon: 2

2 Pikachu SVI 010

Trainer: 0

Energy: 0
`;
    const result = parsePtcglDecklist(text);
    expect(result.pokemon).toHaveLength(1);
  });

  it("ignores Total Cards lines", () => {
    const result = parsePtcglDecklist(SAMPLE_DECKLIST);
    // no extra cards should show up in any section
    const total =
      result.pokemon.reduce((s, c) => s + c.count, 0) +
      result.trainer.reduce((s, c) => s + c.count, 0) +
      result.energy.reduce((s, c) => s + c.count, 0);
    expect(total).toBe(14);
  });

  it("ignores comment lines starting with //", () => {
    const text = `// This is a comment
Pokémon: 1
1 Charizard ex OBF 125

// Another comment
Trainer: 0

Energy: 0
`;
    const result = parsePtcglDecklist(text);
    expect(result.pokemon).toHaveLength(1);
  });

  it("handles promo set codes (SVP 042 → number '42')", () => {
    const text = `Pokémon: 1
1 Pikachu SVP 042

Trainer: 0

Energy: 0
`;
    const result = parsePtcglDecklist(text);
    expect(result.pokemon[0].set).toBe("SVP");
    expect(result.pokemon[0].number).toBe("42");
  });

  it("calculates total card count correctly", () => {
    const result = parsePtcglDecklist(SAMPLE_DECKLIST);
    const total =
      result.pokemon.reduce((s, c) => s + c.count, 0) +
      result.trainer.reduce((s, c) => s + c.count, 0) +
      result.energy.reduce((s, c) => s + c.count, 0);
    expect(total).toBe(14);
  });
});

describe("serializeDecklist", () => {
  it("round-trips a parsed decklist back to PTCGL format", () => {
    const parsed = parsePtcglDecklist(SAMPLE_DECKLIST);
    const serialized = serializeDecklist(parsed);

    // Should contain section headers
    expect(serialized).toMatch(/^Pokémon:/m);
    expect(serialized).toMatch(/^Trainer:/m);
    expect(serialized).toMatch(/^Energy:/m);

    // Should contain card lines
    expect(serialized).toMatch(/4 Charizard ex OBF 125/);
    expect(serialized).toMatch(/4 Basic Fire Energy SVE/);
  });

  it("serialized output re-parses correctly", () => {
    const original = parsePtcglDecklist(SAMPLE_DECKLIST);
    const serialized = serializeDecklist(original);
    const reparsed = parsePtcglDecklist(serialized);

    expect(reparsed.pokemon).toEqual(original.pokemon);
    expect(reparsed.trainer).toEqual(original.trainer);
    expect(reparsed.energy).toEqual(original.energy);
  });
});
