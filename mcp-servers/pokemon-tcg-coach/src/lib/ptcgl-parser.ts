export interface PtcglCard {
  count: number;
  name: string;
  set: string;
  number: string;
}

export interface ParsedDecklist {
  pokemon: PtcglCard[];
  trainer: PtcglCard[];
  energy: PtcglCard[];
}

type Section = "pokemon" | "trainer" | "energy" | null;

/**
 * Normalize a string by decomposing accents and stripping combining marks,
 * then converting to lowercase for section-header matching.
 */
function normalizeHeader(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

const SECTION_HEADER_RE = /^(Pok[eé]mon|Trainer|Energy)\s*:\s*\d*$/i;
// Card line: count, name, set code (2-4 letters optionally with hyphen), optional number
const CARD_LINE_RE = /^(\d+)\s+(.+?)\s+([A-Z]{2,4}(?:-[A-Z]{2,4})?)\s*(\d*)$/;

/**
 * Parse a PTCGL-format decklist text into structured sections.
 */
export function parsePtcglDecklist(text: string): ParsedDecklist {
  const result: ParsedDecklist = { pokemon: [], trainer: [], energy: [] };
  let currentSection: Section = null;

  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();

    // Ignore blank lines
    if (line === "") continue;

    // Ignore comment lines
    if (line.startsWith("//")) continue;

    // Ignore Total Cards lines
    if (/^Total Cards:/i.test(line)) continue;

    // Check for section header (handle accented é via normalizing)
    const normalized = normalizeHeader(line);
    if (
      normalized.startsWith("pokemon:") ||
      normalized.startsWith("trainer:") ||
      normalized.startsWith("energy:")
    ) {
      // Also validate full pattern on original line (accent-insensitive)
      // We strip accents from the line to match the regex
      const deaccented = line.normalize("NFD").replace(/[̀-ͯ]/g, "");
      if (SECTION_HEADER_RE.test(deaccented)) {
        if (normalized.startsWith("pokemon:")) {
          currentSection = "pokemon";
        } else if (normalized.startsWith("trainer:")) {
          currentSection = "trainer";
        } else if (normalized.startsWith("energy:")) {
          currentSection = "energy";
        }
        continue;
      }
    }

    // Try to parse as a card line
    const match = CARD_LINE_RE.exec(line);
    if (match && currentSection) {
      const count = parseInt(match[1], 10);
      const name = match[2];
      const set = match[3];
      const rawNumber = match[4];
      // Normalize number: strip leading zeros; empty string if not present
      const number =
        rawNumber !== "" ? String(parseInt(rawNumber, 10)) : "";

      result[currentSection].push({ count, name, set, number });
    }
  }

  return result;
}

/**
 * Serialize a parsed decklist back to PTCGL format.
 */
export function serializeDecklist(parsed: ParsedDecklist): string {
  const lines: string[] = [];

  const pokemonCount = parsed.pokemon.reduce((s, c) => s + c.count, 0);
  lines.push(`Pokémon: ${pokemonCount}`);
  for (const card of parsed.pokemon) {
    const numStr = card.number !== "" ? ` ${card.number}` : "";
    lines.push(`${card.count} ${card.name} ${card.set}${numStr}`);
  }
  lines.push("");

  const trainerCount = parsed.trainer.reduce((s, c) => s + c.count, 0);
  lines.push(`Trainer: ${trainerCount}`);
  for (const card of parsed.trainer) {
    const numStr = card.number !== "" ? ` ${card.number}` : "";
    lines.push(`${card.count} ${card.name} ${card.set}${numStr}`);
  }
  lines.push("");

  const energyCount = parsed.energy.reduce((s, c) => s + c.count, 0);
  lines.push(`Energy: ${energyCount}`);
  for (const card of parsed.energy) {
    const numStr = card.number !== "" ? ` ${card.number}` : "";
    lines.push(`${card.count} ${card.name} ${card.set}${numStr}`);
  }
  lines.push("");

  const total = pokemonCount + trainerCount + energyCount;
  lines.push(`Total Cards: ${total}`);

  return lines.join("\n");
}
