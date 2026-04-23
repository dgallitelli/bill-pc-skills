import { searchCards, formatCardForOutput, type SearchFilters } from "../lib/tcgdex.js";

export const STANDARD_LEGAL_MARKS = ["G", "H"];

export const CARD_SEARCH_TOOL = {
  name: "card_search",
  description:
    "Search for Pokemon TCG cards by name, set, type, category, regulation mark, or HP range.",
  inputSchema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "Card name (partial match supported)",
      },
      filters: {
        type: "object",
        description: "Optional search filters",
        properties: {
          set: {
            type: "string",
            description: "PTCGL set code (e.g. SVI, PAL, BRS)",
          },
          type: {
            type: "string",
            description: "Pokemon type (e.g. Fire, Water)",
          },
          category: {
            type: "string",
            description: "Card category (e.g. Pokemon, Trainer, Energy)",
          },
          regulation: {
            type: "string",
            description: "Regulation mark (e.g. G, H)",
          },
          standard_legal: {
            type: "boolean",
            description: "If true, only return standard-legal cards",
          },
          hp_min: {
            type: "number",
            description: "Minimum HP",
          },
          hp_max: {
            type: "number",
            description: "Maximum HP",
          },
        },
      },
      limit: {
        type: "number",
        description: "Maximum number of results (default 10, max 20)",
      },
    },
    required: [],
  },
};

interface CardSearchArgs {
  query?: string;
  filters?: {
    set?: string;
    type?: string;
    category?: string;
    regulation?: string;
    standard_legal?: boolean;
    hp_min?: number;
    hp_max?: number;
  };
  limit?: number;
}

interface McpContent {
  type: "text";
  text: string;
}

interface McpResult {
  content: McpContent[];
}

export async function handleCardSearch(args: CardSearchArgs): Promise<McpResult> {
  const query = args.query ?? "";
  const rawFilters = args.filters ?? {};
  const limit = Math.min(args.limit ?? 10, 20);

  const { standard_legal, ...restFilters } = rawFilters;

  const baseFilters: SearchFilters = {
    set: restFilters.set,
    type: restFilters.type,
    category: restFilters.category,
    regulation: restFilters.regulation,
    hp_min: restFilters.hp_min,
    hp_max: restFilters.hp_max,
  };

  let cards;

  if (standard_legal) {
    // Search for each standard-legal regulation mark separately and merge
    const results = await Promise.all(
      STANDARD_LEGAL_MARKS.map((mark) =>
        searchCards(query, { ...baseFilters, regulation: mark }, limit)
      )
    );
    // Merge and deduplicate by card id, then truncate to limit
    const seen = new Set<string>();
    const merged = [];
    for (const batch of results) {
      for (const card of batch) {
        if (!seen.has(card.id)) {
          seen.add(card.id);
          merged.push(card);
        }
      }
    }
    cards = merged.slice(0, limit);
  } else {
    cards = await searchCards(query, baseFilters, limit);
  }

  if (cards.length === 0) {
    return {
      content: [
        {
          type: "text",
          text: "No cards found matching your search criteria.",
        },
      ],
    };
  }

  const formatted = cards.map(formatCardForOutput);

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(formatted, null, 2),
      },
    ],
  };
}
