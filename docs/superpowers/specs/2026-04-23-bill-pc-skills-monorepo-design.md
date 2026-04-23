# Bill's PC Skills — Monorepo Plugin Design

Combine two standalone Claude Code plugins (`pokemon-tcg-coach` and `pokemon-vgc-skill`) into a single multi-skill plugin distributed from one repository.

## Goals

- Single marketplace add + install for both coaching skills
- Each skill remains fully independent (no shared runtime, data, or references)
- Structure supports adding more skills in the future
- Original repos (`dgallitelli/pokemon-tcg-coach`, `dgallitelli/pokemon-vgc-skill`) are preserved as-is, becoming archived/read-only

## Installation

```
/plugin marketplace add dgallitelli/bill-pc-skills
/plugin install bill-pc-skills@dgallitelli
```

Skills are invoked as `/bill-pc-skills:pokemon-tcg-coach` and `/bill-pc-skills:pokemon-vgc-coach`, or auto-triggered by their keyword lists.

---

## Repository Structure

```
bill-pc-skills/
├── .claude-plugin/
│   ├── plugin.json
│   └── marketplace.json
├── .mcp.json
├── skills/
│   ├── pokemon-tcg-coach/
│   │   ├── SKILL.md
│   │   └── references/
│   │       ├── rules.md
│   │       ├── format-legality.md
│   │       └── deckbuilding-strategy.md
│   └── pokemon-vgc-coach/
│       ├── SKILL.md
│       └── references/
│           ├── mcp-setup.md
│           ├── resources.md
│           ├── teambuilding-checklist.md
│           ├── iteration-workflow.md
│           └── type-chart.md
├── mcp-servers/
│   └── pokemon-tcg-coach/
│       ├── src/
│       │   ├── index.ts
│       │   ├── lib/
│       │   │   ├── collection-store.ts
│       │   │   ├── ptcgl-parser.ts
│       │   │   ├── set-map.ts
│       │   │   └── tcgdex.ts
│       │   ├── tools/
│       │   │   ├── card-search.ts
│       │   │   ├── collection.ts
│       │   │   └── deck.ts
│       │   └── __tests__/
│       ├── dist/
│       │   └── bundle.js           # esbuild single-file bundle (committed)
│       ├── package.json
│       ├── tsconfig.json
│       └── vitest.config.ts
├── ground-truths/
│   ├── tcg/                         # 10 TCG test scenarios
│   └── vgc/                         # VGC research/reference materials
├── README.md
├── CLAUDE.md
├── AGENTS.md
├── package.json                     # Root scripts for build/test orchestration
├── .gitignore
└── logo.svg
```

---

## Plugin Configuration

### `.claude-plugin/plugin.json`

```json
{
  "name": "bill-pc-skills",
  "description": "Your Pokemon coaching toolkit — competitive VGC teambuilding and TCG deckbuilding, powered by Bill's PC.",
  "author": { "name": "dgallitelli" },
  "homepage": "https://github.com/dgallitelli/bill-pc-skills",
  "license": "MIT",
  "keywords": ["pokemon", "tcg", "vgc", "coaching", "deckbuilding", "teambuilding", "mcp"],
  "mcpServers": "./.mcp.json"
}
```

No `version` here — the marketplace entry owns the version to avoid silent conflicts.

### `.claude-plugin/marketplace.json`

```json
{
  "$schema": "https://anthropic.com/claude-code/marketplace.schema.json",
  "name": "dgallitelli",
  "description": "Pokemon coaching skills by dgallitelli, powered by Bill's PC.",
  "owner": { "name": "dgallitelli" },
  "plugins": [
    {
      "name": "bill-pc-skills",
      "source": "./",
      "description": "Your Pokemon coaching toolkit — competitive VGC teambuilding and TCG deckbuilding",
      "version": "1.0.0",
      "author": { "name": "dgallitelli" },
      "homepage": "https://github.com/dgallitelli/bill-pc-skills",
      "keywords": ["pokemon", "tcg", "vgc", "coaching", "deckbuilding", "teambuilding"],
      "tags": ["pokemon", "tcg", "vgc", "coaching"],
      "category": "productivity",
      "skills": ["./skills/pokemon-tcg-coach", "./skills/pokemon-vgc-coach"]
    }
  ]
}
```

### `.mcp.json`

```json
{
  "mcpServers": {
    "pokemon-tcg-coach": {
      "command": "node",
      "args": ["${CLAUDE_PLUGIN_ROOT}/mcp-servers/pokemon-tcg-coach/dist/bundle.js"],
      "env": {
        "COLLECTION_DATA_DIR": "${CLAUDE_PLUGIN_DATA}/collection"
      }
    },
    "pokemon-vgc-calc": {
      "command": "npx",
      "args": ["pokemon-vgc-calc-mcp"],
      "autoApprove": ["calculateDamage"]
    },
    "pokemon-paste": {
      "command": "npx",
      "args": ["pokemon-paste-mcp"],
      "autoApprove": ["create_pokepaste"]
    }
  }
}
```

---

## Skill Migration

### TCG Coach

**Source:** `dgallitelli/pokemon-tcg-coach` (root `SKILL.md`, 263 lines)

**Changes:**
- Move `SKILL.md` from repo root to `skills/pokemon-tcg-coach/SKILL.md`
- Move `references/` (3 files) to `skills/pokemon-tcg-coach/references/`
- Replace all plain relative paths in SKILL.md:
  - `references/rules.md` → `${CLAUDE_SKILL_DIR}/references/rules.md`
  - `references/format-legality.md` → `${CLAUDE_SKILL_DIR}/references/format-legality.md`
  - `references/deckbuilding-strategy.md` → `${CLAUDE_SKILL_DIR}/references/deckbuilding-strategy.md`
  - `collection/collection.json` → `${CLAUDE_PLUGIN_DATA}/collection/collection.json`
  - `collection/decks/{slug}.txt` → `${CLAUDE_PLUGIN_DATA}/collection/decks/{slug}.txt`
- MCP tool names unchanged: `card-search`, `collection-import`, `collection-view`, `collection-remove`, `deck-save`, `deck-list`, `deck-get`, `deck-delete`, `deck-diff`

### VGC Coach

**Source:** `dgallitelli/pokemon-vgc-skill` (`skills/pokemon-vgc-coach/SKILL.md`, 56KB)

**Changes:**
- Copy `SKILL.md` to `skills/pokemon-vgc-coach/SKILL.md`
- Move `references/` (5 files) to `skills/pokemon-vgc-coach/references/`
- Add "Additional Resources" section to SKILL.md referencing the 5 files with `${CLAUDE_SKILL_DIR}/references/...` paths (these are currently unreferenced and would not be loaded otherwise)
- No MCP tool name changes

### TCG MCP Server

**Source:** `dgallitelli/pokemon-tcg-coach` (`mcp-server/`)

**Changes:**
- Move `mcp-server/` to `mcp-servers/pokemon-tcg-coach/`
- Update `collection-store.ts`: read data path from `process.env.COLLECTION_DATA_DIR` instead of hardcoded `collection/` relative path. Fallback to `./collection` when the env var is unset (local development with `node dist/bundle.js`)
- Update `tsconfig.json`: set `"noEmit": true` (tsc for type checking only)
- Add `esbuild` as a dev dependency
- Add `"bundle"` script to `package.json`: `esbuild src/index.ts --bundle --platform=node --format=esm --target=node18 --outfile=dist/bundle.js`
- Build and commit `dist/bundle.js` (the single self-contained artifact)

### What Is Not Migrated

- TCG's `scripts/captions/` (development artifact for extracting YouTube captions)
- VGC's `.kiro/` directory (IDE workspace artifact)
- Both repos' individual `.claude-plugin/`, `mcp.json`, `CLAUDE.md`, `AGENTS.md` (replaced by combined versions)
- Both repos' root-level `SKILL.md` redirect stubs

### What Is Preserved

- Both original Git repositories remain intact and unmodified
- They become archived/read-only references

---

## Repo-Level Files

### `README.md`

- Plugin name, logo, one-line description
- Installation instructions (marketplace add + install)
- What's included: description of each skill and their capabilities
- MCP tools table (all 11 tools mapped to which skill they support)
- Prerequisites: "Requires Node.js 18+ in your PATH for the MCP tools"
- Links to archived original repos

### `CLAUDE.md`

Pointer file per user convention:

```markdown
# bill-pc-skills
See `AGENTS.md` for project instructions.
```

### `AGENTS.md`

Development instructions:
- Project overview
- Repository structure
- Development workflow:
  - `cd mcp-servers/pokemon-tcg-coach && npm install` (dev setup)
  - `npm test` (run tests)
  - `npm run bundle` (rebuild the committed artifact)
  - `npx tsc --noEmit` (type check)
- Local testing: `claude --plugin-dir .` with `/reload-plugins` for hot reload
- Validation: `/plugin validate`
- Key conventions: `${CLAUDE_SKILL_DIR}`, `${CLAUDE_PLUGIN_DATA}`, `${CLAUDE_PLUGIN_ROOT}`
- Reminder: `dist/bundle.js` must be rebuilt and committed before pushing
- Guide for adding new skills (and MCP servers if needed)

### Root `package.json`

```json
{
  "name": "bill-pc-skills",
  "private": true,
  "scripts": {
    "build": "cd mcp-servers/pokemon-tcg-coach && npm run bundle",
    "test": "cd mcp-servers/pokemon-tcg-coach && npm test",
    "typecheck": "cd mcp-servers/pokemon-tcg-coach && npx tsc --noEmit"
  }
}
```

### `.gitignore`

```
node_modules/
*.tsbuildinfo
.env
collection/
.DS_Store
Thumbs.db
.vscode/
.idea/
*.swp
```

No complex `dist/` rules needed since `tsc` is `noEmit` and `bundle.js` is the only file in `dist/`.

---

## Open Questions / Future Work

- **VGC SKILL.md size (56KB):** The docs recommend keeping SKILL.md under 500 lines for compaction behavior. After context compaction, roughly half the skill content may be lost. Consider splitting into a core SKILL.md + reference files in a follow-up iteration. This is a pre-existing issue, not caused by the migration.
- **Logo:** Reuse an existing logo initially; design a combined Bill's PC logo later.
- **CI/CD:** Could add a GitHub Action to run tests and validate the plugin on push.
