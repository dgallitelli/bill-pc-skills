# Technical Reference

## Plugin Architecture

Bill's PC Skills is a Claude Code plugin with two independent skills and three MCP servers. Each skill has its own SKILL.md, reference files, and (optionally) MCP tools.

```
skills/
├── pokemon-tcg-coach/    # Skill + 3 reference files + custom MCP server (9 tools)
└── pokemon-vgc-coach/    # Skill + 5 reference files + 2 npx MCP servers
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

## MCP Server Configuration

Defined in `.mcp.json` at the plugin root:

- **pokemon-tcg-coach** — Custom TypeScript server bundled as `dist/bundle.js` (esbuild, self-contained). Provides card search via the tcgdex API and local collection/deck management via `${CLAUDE_PLUGIN_DATA}`.
- **pokemon-vgc-calc** — `npx pokemon-vgc-calc-mcp`. Wraps @smogon/calc for damage calculations.
- **pokemon-paste** — `npx pokemon-paste-mcp`. Exports teams to PokePaste.

## Data Storage

- **Card collection and decks** — Stored in `${CLAUDE_PLUGIN_DATA}/collection/`. Persists across plugin updates. JSON format for collection, PTCGL text files for decks.
- **Skill references** — Bundled in `skills/<name>/references/`, resolved via `${CLAUDE_SKILL_DIR}`.

## Path Variables

| Variable | Resolves to | Used for |
|----------|------------|----------|
| `${CLAUDE_SKILL_DIR}` | Skill's installed directory | Reference files in SKILL.md |
| `${CLAUDE_PLUGIN_ROOT}` | Plugin's installed directory | MCP server binary paths in .mcp.json |
| `${CLAUDE_PLUGIN_DATA}` | Persistent data directory | User collection/deck storage |
