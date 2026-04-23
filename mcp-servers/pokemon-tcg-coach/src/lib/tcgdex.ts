import { ptcglToTcgdex, tcgdexToPtcgl } from "./set-map.js";

const TCGDEX_BASE = "https://api.tcgdex.net/v2/en";

export interface CardBrief {
  id: string;
  localId: string;
  name: string;
  image: string;
}

export interface CardDetail {
  id: string;
  localId: string;
  name: string;
  image: string;
  category: string;
  types?: string[];
  hp?: number;
  attacks?: Array<{
    name: string;
    cost?: string[];
    damage?: string;
    effect?: string;
  }>;
  abilities?: Array<{
    name: string;
    type: string;
    effect: string;
  }>;
  regulationMark?: string;
  rarity?: string;
  set: {
    id: string;
    name: string;
  };
}

export interface SearchFilters {
  set?: string;
  type?: string;
  category?: string;
  regulation?: string;
  hp_min?: number;
  hp_max?: number;
}

/** In-memory cache for card details keyed by card id */
const cardCache = new Map<string, CardDetail>();

/**
 * Fetch full card detail for a single card id.
 */
async function fetchCardDetail(id: string): Promise<CardDetail | null> {
  if (cardCache.has(id)) {
    return cardCache.get(id)!;
  }
  try {
    const res = await fetch(`${TCGDEX_BASE}/cards/${id}`);
    if (!res.ok) return null;
    const card = (await res.json()) as CardDetail;
    cardCache.set(id, card);
    return card;
  } catch {
    return null;
  }
}

/**
 * Run async tasks with bounded concurrency.
 */
async function pLimit<T>(
  tasks: (() => Promise<T>)[],
  concurrency: number
): Promise<T[]> {
  const results: T[] = [];
  let idx = 0;

  async function worker() {
    while (idx < tasks.length) {
      const current = idx++;
      results[current] = await tasks[current]();
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, tasks.length) }, () =>
    worker()
  );
  await Promise.all(workers);
  return results;
}

/**
 * Search for cards using the tcgdex API, then fetch full details.
 */
export async function searchCards(
  query: string,
  filters: SearchFilters,
  limit: number
): Promise<CardDetail[]> {
  const params = new URLSearchParams();

  // Name filter uses partial matching
  if (query) {
    params.set("name", `like:${query}`);
  }

  // Set filter: translate PTCGL code to tcgdex ID
  if (filters.set) {
    const tcgdexId = ptcglToTcgdex(filters.set) ?? filters.set;
    params.set("set", tcgdexId);
  }

  // Type filter
  if (filters.type) {
    params.set("types", filters.type);
  }

  // Category: capitalize first letter
  if (filters.category) {
    const cat =
      filters.category.charAt(0).toUpperCase() +
      filters.category.slice(1).toLowerCase();
    params.set("category", cat);
  }

  // Regulation mark
  if (filters.regulation) {
    params.set("regulationMark", filters.regulation);
  }

  // HP range
  if (filters.hp_min !== undefined) {
    params.set("hp", `gte:${filters.hp_min}`);
  }
  if (filters.hp_max !== undefined) {
    // If both min and max are set, hp_max would overwrite — use separate params.
    // tcgdex supports multiple query params with the same key via arrays; use append.
    params.append("hp", `lte:${filters.hp_max}`);
  }

  // Pagination
  params.set("pagination:itemsPerPage", String(limit));

  const url = `${TCGDEX_BASE}/cards?${params.toString()}`;

  let briefs: CardBrief[] = [];
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    // API may return an object with a `data` array or a direct array
    if (Array.isArray(data)) {
      briefs = data as CardBrief[];
    } else if (data && Array.isArray((data as { data?: CardBrief[] }).data)) {
      briefs = (data as { data: CardBrief[] }).data;
    }
  } catch {
    return [];
  }

  if (briefs.length === 0) return [];

  // Fetch full details with concurrency limit of 5
  const tasks = briefs
    .slice(0, limit)
    .map((brief) => () => fetchCardDetail(brief.id));
  const details = await pLimit(tasks, 5);

  return details.filter((d): d is CardDetail => d !== null);
}

/**
 * Format a CardDetail for MCP tool output, converting tcgdex set IDs to PTCGL codes.
 */
export function formatCardForOutput(card: CardDetail): Record<string, unknown> {
  const ptcglSet = tcgdexToPtcgl(card.set.id) ?? card.set.id;

  const output: Record<string, unknown> = {
    id: card.id,
    name: card.name,
    set: ptcglSet,
    setName: card.set.name,
    number: card.localId,
    category: card.category,
  };

  if (card.types !== undefined) output.types = card.types;
  if (card.hp !== undefined) output.hp = card.hp;
  if (card.rarity !== undefined) output.rarity = card.rarity;
  if (card.regulationMark !== undefined) output.regulationMark = card.regulationMark;
  if (card.attacks !== undefined) output.attacks = card.attacks;
  if (card.abilities !== undefined) output.abilities = card.abilities;
  if (card.image !== undefined) output.image = card.image;

  return output;
}
