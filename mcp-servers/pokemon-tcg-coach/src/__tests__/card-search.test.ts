import { describe, it, expect } from "vitest";
import { handleCardSearch } from "../tools/card-search.js";

describe("handleCardSearch (integration)", () => {
  it(
    "returns results for Charizard with name and set properties",
    async () => {
      const result = await handleCardSearch({
        query: "Charizard",
        limit: 5,
      });
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe("text");

      const parsed = JSON.parse(result.content[0].text);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed.length).toBeGreaterThan(0);

      const card = parsed[0];
      expect(card).toHaveProperty("name");
      expect(card).toHaveProperty("set");
      expect(card.name).toMatch(/charizard/i);
    },
    30000
  );

  it(
    "returns no cards found message for nonexistent card",
    async () => {
      const result = await handleCardSearch({
        query: "Xyzzyflurp9999",
        limit: 5,
      });
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe("text");
      expect(result.content[0].text).toMatch(/no cards found/i);
    },
    15000
  );

  it(
    "filters by set SVI and all returned cards have set SVI",
    async () => {
      const result = await handleCardSearch({
        query: "Pikachu",
        filters: { set: "SVI" },
        limit: 5,
      });
      expect(result.content).toHaveLength(1);
      const text = result.content[0].text;

      // Could be "No cards found" if Pikachu isn't in SVI — that's also valid
      if (!text.match(/no cards found/i)) {
        const parsed = JSON.parse(text);
        expect(Array.isArray(parsed)).toBe(true);
        for (const card of parsed) {
          expect(card.set).toBe("SVI");
        }
      }
    },
    30000
  );

  it(
    "filters by set SVI on Arcanine and all returned cards have set SVI",
    async () => {
      const result = await handleCardSearch({
        query: "Arcanine",
        filters: { set: "SVI" },
        limit: 10,
      });
      expect(result.content).toHaveLength(1);
      const text = result.content[0].text;

      if (!text.match(/no cards found/i)) {
        const parsed = JSON.parse(text);
        expect(Array.isArray(parsed)).toBe(true);
        expect(parsed.length).toBeGreaterThan(0);
        for (const card of parsed) {
          expect(card.set).toBe("SVI");
        }
      }
    },
    30000
  );
});
