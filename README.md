<p align="center">
  <img src="logo.png" alt="Bill's PC Skills" width="320"/>
</p>

<h1 align="center">Bill's PC Skills</h1>

<p align="center">Your Pokemon coaching toolkit — competitive VGC teambuilding and TCG deckbuilding, powered by Bill's PC.</p>

A [Claude Code plugin](https://docs.anthropic.com/en/docs/claude-code/plugins) that gives your AI agent two specialized Pokemon coaching skills. Install it from the marketplace and get expert-level guidance for both the Pokemon Trading Card Game and competitive VGC doubles battles — complete with MCP tools for card search, collection management, damage calculations, and team export. Works with Claude Code and any AI agent that supports skills and MCP servers.

## What's Inside

### Pokemon TCG Coach
- Rules & legality — answer rules questions, check card/set legality by format
- Deckbuilding — help build competitive decks with proper ratios and strategy
- Meta analysis — current top archetypes with strengths, weaknesses, and matchups
- Card search — find cards by name, type, set, HP, regulation mark
- Collection tracking — import your cards, save decks, track what you own
- Purchase advice — what to buy to complete a deck, singles vs sealed guidance

### Pokemon VGC Coach
- Teambuilding — 5-step framework from core idea to final details
- Metagame analysis — live usage stats and top sets from Pikalytics
- Damage calculations — inline calcs for EV benchmarks and KO ranges
- Synergy library — 30+ documented mechanical combos
- In-battle coaching — team preview, turn-by-turn theory, endgame calculation
- Format-aware — Pokemon Champions, Scarlet/Violet regulations

## Install

```
/plugin marketplace add dgallitelli/bill-pc-skills
/plugin install bill-pc-skills@dgallitelli
```

## MCP Tools

| Tool | Skill | Purpose |
|------|-------|---------|
| `card-search` | TCG | Search Pokemon TCG cards by name, set, type, regulation mark |
| `collection-import` | TCG | Import PTCGL card list into collection |
| `collection-view` | TCG | View card collection with filters |
| `collection-remove` | TCG | Remove cards from collection |
| `deck-save` | TCG | Save a PTCGL decklist |
| `deck-list` | TCG | List all saved decks |
| `deck-get` | TCG | Retrieve a saved deck |
| `deck-delete` | TCG | Delete a saved deck |
| `deck-diff` | TCG | Compare deck vs collection — what's missing? |
| `calculateDamage` | VGC | Damage calculations for EV spreads and KO ranges |
| `create_pokepaste` | VGC | Export teams to PokePaste for sharing |

## Prerequisites

Requires Node.js 18+ in your PATH for the MCP tools.

## History

This plugin combines two previously separate projects:
- [pokemon-tcg-coach](https://github.com/dgallitelli/pokemon-tcg-coach) (archived)
- [pokemon-vgc-skill](https://github.com/dgallitelli/pokemon-vgc-skill) (archived)

## License

MIT
