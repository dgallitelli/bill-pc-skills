# Bill's PC Skills — Developer Guide

## Project Overview

Multi-skill Claude Code plugin for Pokemon coaching. Contains:
- **pokemon-tcg-coach** — TCG rules, deckbuilding, card search, collection management
- **pokemon-vgc-coach** — VGC teambuilding, metagame analysis, damage calcs, team export

## Structure

- `skills/` — One subdirectory per skill, each with SKILL.md + references/
- `mcp-servers/` — Bundled MCP server source code (TCG card search & collection)
- `.claude-plugin/` — Plugin and marketplace metadata
- `.mcp.json` — MCP server declarations (all 3 servers)
- `ground-truths/` — Test scenarios for validating skill quality

## Development

### MCP Server (TCG)

```bash
cd mcp-servers/pokemon-tcg-coach
npm install          # Install deps (dev only)
npm test             # Run tests
npx tsc --noEmit     # Type check
npm run bundle       # Build dist/bundle.js (esbuild)
```

Or from root:
```bash
npm run build        # Bundle
npm test             # Test
npm run typecheck    # Type check
```

### Local plugin testing

```bash
claude --plugin-dir .
```

Use `/reload-plugins` inside Claude Code to pick up changes without restarting.

### Validation

Inside Claude Code: `/plugin validate`

## Key Conventions

- **Skill file references**: Use `${CLAUDE_SKILL_DIR}/references/...` for files co-located with SKILL.md
- **User data**: Use `${CLAUDE_PLUGIN_DATA}/collection/...` for persistent collection/deck data
- **MCP server paths**: Use `${CLAUDE_PLUGIN_ROOT}/mcp-servers/...` in .mcp.json
- **dist/bundle.js must be rebuilt and committed before pushing** — it is the deployed artifact

## Adding a New Skill

1. Create `skills/<skill-name>/SKILL.md` with frontmatter (name, description, triggers)
2. Add `references/` subdirectory if the skill needs supporting files
3. Reference files using `${CLAUDE_SKILL_DIR}/references/...`
4. Add the skill path to `marketplace.json` → `plugins[0].skills` array
5. If the skill needs MCP tools, add a server to `mcp-servers/` and declare it in `.mcp.json`
