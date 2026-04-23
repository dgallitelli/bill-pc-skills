# Bill's PC Skills Monorepo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Combine `dgallitelli/pokemon-tcg-coach` and `dgallitelli/pokemon-vgc-skill` into a single multi-skill Claude Code plugin at `dgallitelli/bill-pc-skills`.

**Architecture:** Flat monorepo with `skills/` at root (one subdirectory per skill with SKILL.md + references), `mcp-servers/` for bundled MCP server source, and `.claude-plugin/` for marketplace + plugin metadata. Each skill is independent — no shared runtime, data, or references.

**Tech Stack:** TypeScript (MCP server), esbuild (bundling), Vitest (tests), Claude Code plugin SDK conventions.

**Source repos** (read-only, do not modify):
- `/home/ec2-user/pokemon-tcg-coach`
- `/home/ec2-user/pokemon-vgc-skill`

**Target repo:** `/home/ec2-user/bill-pc-skills`

---

### Task 1: Plugin scaffolding — config files and .gitignore

**Files:**
- Create: `.claude-plugin/plugin.json`
- Create: `.claude-plugin/marketplace.json`
- Create: `.mcp.json`
- Create: `.gitignore`
- Create: `package.json` (root)

- [ ] **Step 1: Create `.claude-plugin/plugin.json`**

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

- [ ] **Step 2: Create `.claude-plugin/marketplace.json`**

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

- [ ] **Step 3: Create `.mcp.json`**

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

- [ ] **Step 4: Create `.gitignore`**

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

- [ ] **Step 5: Create root `package.json`**

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

- [ ] **Step 6: Commit**

```bash
git add .claude-plugin/plugin.json .claude-plugin/marketplace.json .mcp.json .gitignore package.json
git commit -m "feat: add plugin scaffolding — config, marketplace, MCP, gitignore"
```

---

### Task 2: Migrate TCG Coach skill and references

**Files:**
- Create: `skills/pokemon-tcg-coach/SKILL.md` (copied from `/home/ec2-user/pokemon-tcg-coach/SKILL.md`, paths updated)
- Create: `skills/pokemon-tcg-coach/references/rules.md` (copied verbatim)
- Create: `skills/pokemon-tcg-coach/references/format-legality.md` (copied verbatim)
- Create: `skills/pokemon-tcg-coach/references/deckbuilding-strategy.md` (copied verbatim)

- [ ] **Step 1: Copy reference files verbatim**

```bash
mkdir -p skills/pokemon-tcg-coach/references
cp /home/ec2-user/pokemon-tcg-coach/references/rules.md skills/pokemon-tcg-coach/references/
cp /home/ec2-user/pokemon-tcg-coach/references/format-legality.md skills/pokemon-tcg-coach/references/
cp /home/ec2-user/pokemon-tcg-coach/references/deckbuilding-strategy.md skills/pokemon-tcg-coach/references/
```

- [ ] **Step 2: Copy SKILL.md and update all paths**

Copy `/home/ec2-user/pokemon-tcg-coach/SKILL.md` to `skills/pokemon-tcg-coach/SKILL.md`, then apply these substitutions:

| Old path | New path |
|----------|----------|
| `references/rules.md` | `${CLAUDE_SKILL_DIR}/references/rules.md` |
| `references/format-legality.md` | `${CLAUDE_SKILL_DIR}/references/format-legality.md` |
| `references/deckbuilding-strategy.md` | `${CLAUDE_SKILL_DIR}/references/deckbuilding-strategy.md` |
| `collection/collection.json` | `${CLAUDE_PLUGIN_DATA}/collection/collection.json` |
| `collection/decks/{slug}.txt` | `${CLAUDE_PLUGIN_DATA}/collection/decks/{slug}.txt` |

These substitutions must be applied to all occurrences. There are approximately 8 occurrences of `references/` paths and 3 occurrences of `collection/` paths.

- [ ] **Step 3: Verify no old paths remain**

```bash
grep -n 'references/' skills/pokemon-tcg-coach/SKILL.md | grep -v CLAUDE_SKILL_DIR
grep -n 'collection/' skills/pokemon-tcg-coach/SKILL.md | grep -v CLAUDE_PLUGIN_DATA
```

Both commands should return empty (no matches). If any lines remain, fix them.

- [ ] **Step 4: Commit**

```bash
git add skills/pokemon-tcg-coach/
git commit -m "feat: migrate TCG coach skill with updated paths"
```

---

### Task 3: Migrate VGC Coach skill and references

**Files:**
- Create: `skills/pokemon-vgc-coach/SKILL.md` (copied from `/home/ec2-user/pokemon-vgc-skill/skills/pokemon-vgc-coach/SKILL.md`, with added references section)
- Create: `skills/pokemon-vgc-coach/references/mcp-setup.md` (copied verbatim)
- Create: `skills/pokemon-vgc-coach/references/resources.md` (copied verbatim)
- Create: `skills/pokemon-vgc-coach/references/teambuilding-checklist.md` (copied verbatim)
- Create: `skills/pokemon-vgc-coach/references/iteration-workflow.md` (copied verbatim)
- Create: `skills/pokemon-vgc-coach/references/type-chart.md` (copied verbatim)

- [ ] **Step 1: Copy reference files verbatim**

```bash
mkdir -p skills/pokemon-vgc-coach/references
cp /home/ec2-user/pokemon-vgc-skill/references/mcp-setup.md skills/pokemon-vgc-coach/references/
cp /home/ec2-user/pokemon-vgc-skill/references/resources.md skills/pokemon-vgc-coach/references/
cp /home/ec2-user/pokemon-vgc-skill/references/teambuilding-checklist.md skills/pokemon-vgc-coach/references/
cp /home/ec2-user/pokemon-vgc-skill/references/iteration-workflow.md skills/pokemon-vgc-coach/references/
cp /home/ec2-user/pokemon-vgc-skill/references/type-chart.md skills/pokemon-vgc-coach/references/
```

- [ ] **Step 2: Copy SKILL.md and add references section**

Copy `/home/ec2-user/pokemon-vgc-skill/skills/pokemon-vgc-coach/SKILL.md` to `skills/pokemon-vgc-coach/SKILL.md`.

Then append this section at the end of the file (before any trailing newline):

```markdown

## Additional Resources

These reference files contain supplementary detail. Read them when the topic requires it.

| File | Read when... |
|------|-------------|
| [teambuilding-checklist.md](${CLAUDE_SKILL_DIR}/references/teambuilding-checklist.md) | Reviewing or auditing a team composition |
| [iteration-workflow.md](${CLAUDE_SKILL_DIR}/references/iteration-workflow.md) | Guiding a user through test-and-refine cycles |
| [type-chart.md](${CLAUDE_SKILL_DIR}/references/type-chart.md) | Checking type effectiveness, resistances, or immunities |
| [resources.md](${CLAUDE_SKILL_DIR}/references/resources.md) | Recommending external tools, sites, or data sources |
| [mcp-setup.md](${CLAUDE_SKILL_DIR}/references/mcp-setup.md) | Troubleshooting MCP tool setup or explaining damage calc usage |
```

- [ ] **Step 3: Commit**

```bash
git add skills/pokemon-vgc-coach/
git commit -m "feat: migrate VGC coach skill with references section"
```

---

### Task 4: Migrate TCG MCP server and update data paths

**Files:**
- Create: `mcp-servers/pokemon-tcg-coach/` (entire directory copied from `/home/ec2-user/pokemon-tcg-coach/mcp-server/`)
- Modify: `mcp-servers/pokemon-tcg-coach/src/tools/collection.ts:12` — data path
- Modify: `mcp-servers/pokemon-tcg-coach/src/tools/deck.ts:8` — data path
- Modify: `mcp-servers/pokemon-tcg-coach/package.json` — add esbuild, bundle script
- Modify: `mcp-servers/pokemon-tcg-coach/tsconfig.json` — set noEmit

- [ ] **Step 1: Copy the MCP server source (excluding node_modules and dist)**

```bash
mkdir -p mcp-servers/pokemon-tcg-coach
# Copy source, config, and test files
cp -r /home/ec2-user/pokemon-tcg-coach/mcp-server/src mcp-servers/pokemon-tcg-coach/
rm -rf mcp-servers/pokemon-tcg-coach/src/node_modules
cp /home/ec2-user/pokemon-tcg-coach/mcp-server/package.json mcp-servers/pokemon-tcg-coach/
cp /home/ec2-user/pokemon-tcg-coach/mcp-server/tsconfig.json mcp-servers/pokemon-tcg-coach/
cp /home/ec2-user/pokemon-tcg-coach/mcp-server/vitest.config.ts mcp-servers/pokemon-tcg-coach/
```

- [ ] **Step 2: Update data path in `collection.ts`**

In `mcp-servers/pokemon-tcg-coach/src/tools/collection.ts`, replace line 12:

```typescript
// Old:
const COLLECTION_PATH = resolve(process.cwd(), "collection", "collection.json");

// New:
const DATA_DIR = process.env.COLLECTION_DATA_DIR || resolve(process.cwd(), "collection");
const COLLECTION_PATH = resolve(DATA_DIR, "collection.json");
```

- [ ] **Step 3: Update data path in `deck.ts`**

In `mcp-servers/pokemon-tcg-coach/src/tools/deck.ts`, replace line 8:

```typescript
// Old:
const COLLECTION_DIR = resolve(process.cwd(), "collection");

// New:
const COLLECTION_DIR = process.env.COLLECTION_DATA_DIR || resolve(process.cwd(), "collection");
```

- [ ] **Step 4: Update `package.json` — add esbuild and bundle script**

In `mcp-servers/pokemon-tcg-coach/package.json`, update:

```json
{
  "name": "pokemon-tcg-coach-mcp",
  "version": "1.0.0",
  "description": "MCP server for Pokemon TCG card search and collection management",
  "type": "module",
  "main": "dist/bundle.js",
  "scripts": {
    "bundle": "esbuild src/index.ts --bundle --platform=node --format=esm --target=node18 --outfile=dist/bundle.js",
    "build": "tsc",
    "dev": "tsc --watch",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.29.0"
  },
  "devDependencies": {
    "@types/node": "^25.6.0",
    "esbuild": "^0.25.0",
    "typescript": "^5.7.0",
    "vitest": "^3.1.0"
  }
}
```

Changes: added `esbuild` to devDependencies, added `"bundle"` script, changed `main` to `dist/bundle.js`.

- [ ] **Step 5: Update `tsconfig.json` — set noEmit**

In `mcp-servers/pokemon-tcg-coach/tsconfig.json`, add `"noEmit": true` and remove `"outDir"`, `"declaration"`, `"sourceMap"`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "moduleResolution": "Node16",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "noEmit": true
  },
  "include": ["src/**/*.ts"],
  "exclude": ["src/**/*.test.ts", "src/__tests__"]
}
```

- [ ] **Step 6: Commit source changes**

```bash
git add mcp-servers/pokemon-tcg-coach/
git commit -m "feat: migrate TCG MCP server with env-based data paths and esbuild config"
```

---

### Task 5: Build and verify the MCP server bundle

**Files:**
- Create: `mcp-servers/pokemon-tcg-coach/dist/bundle.js` (generated by esbuild, committed)

- [ ] **Step 1: Install dependencies**

```bash
cd mcp-servers/pokemon-tcg-coach && npm install
```

Expected: clean install with `@modelcontextprotocol/sdk`, `esbuild`, `typescript`, `vitest` in `node_modules/`.

- [ ] **Step 2: Run type checking**

```bash
cd mcp-servers/pokemon-tcg-coach && npx tsc --noEmit
```

Expected: no errors. If there are errors, fix them before proceeding.

- [ ] **Step 3: Run tests**

```bash
cd mcp-servers/pokemon-tcg-coach && npm test
```

Expected: all existing tests pass. If any fail due to the `COLLECTION_DATA_DIR` change, update the test setup to set the env var or ensure the fallback path works.

- [ ] **Step 4: Build the bundle**

```bash
cd mcp-servers/pokemon-tcg-coach && npm run bundle
```

Expected: creates `dist/bundle.js`. Verify it exists and is a reasonable size (should be a few hundred KB with the MCP SDK bundled in).

- [ ] **Step 5: Smoke test the bundle**

Verify the bundle starts without crashing (MCP uses content-length framing on stdio, so a simple echo won't produce a response — just confirm it starts):

```bash
timeout 3 node mcp-servers/pokemon-tcg-coach/dist/bundle.js < /dev/null 2>&1; echo "exit: $?"
```

Expected: the process starts, waits for stdin, then exits after timeout. Exit code 124 (timeout) means it started successfully. Any other error (syntax error, missing module) would show immediately. If you see `Error` or `Cannot find module`, the bundle is broken.

- [ ] **Step 6: Commit the bundle**

```bash
git add mcp-servers/pokemon-tcg-coach/dist/bundle.js
git commit -m "feat: add compiled MCP server bundle"
```

---

### Task 6: Migrate ground truths

**Files:**
- Create: `ground-truths/tcg/` (10 files from `/home/ec2-user/pokemon-tcg-coach/ground-truths/`)
- Create: `ground-truths/vgc/` (files from `/home/ec2-user/pokemon-vgc-skill/ground-truths/`)

- [ ] **Step 1: Copy TCG ground truths**

```bash
mkdir -p ground-truths/tcg
cp /home/ec2-user/pokemon-tcg-coach/ground-truths/*.md ground-truths/tcg/
```

- [ ] **Step 2: Copy VGC ground truths**

The VGC ground truths are gitignored in the source repo, so they may or may not exist on disk. Check first:

```bash
ls /home/ec2-user/pokemon-vgc-skill/ground-truths/ 2>/dev/null
```

If files exist, copy them:

```bash
mkdir -p ground-truths/vgc
cp /home/ec2-user/pokemon-vgc-skill/ground-truths/* ground-truths/vgc/ 2>/dev/null || true
```

If the directory is empty or doesn't exist, just create the empty directory:

```bash
mkdir -p ground-truths/vgc
```

- [ ] **Step 3: Commit**

```bash
git add ground-truths/
git commit -m "feat: migrate ground truth test scenarios"
```

---

### Task 7: Repo-level documentation and logo

**Files:**
- Create: `CLAUDE.md`
- Create: `AGENTS.md`
- Create: `README.md`
- Create: `logo.svg` (copied from existing repo)

- [ ] **Step 1: Create `CLAUDE.md`**

```markdown
# bill-pc-skills

See `AGENTS.md` for project instructions.
```

- [ ] **Step 2: Create `AGENTS.md`**

```markdown
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
```

- [ ] **Step 3: Create `README.md`**

```markdown
<p align="center">
  <img src="logo.svg" alt="Bill's PC Skills" width="160"/>
</p>

<h1 align="center">Bill's PC Skills</h1>

<p align="center">Your Pokemon coaching toolkit — competitive VGC teambuilding and TCG deckbuilding, powered by Bill's PC.</p>

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
```

- [ ] **Step 4: Copy logo**

```bash
cp /home/ec2-user/pokemon-tcg-coach/logo.svg logo.svg
```

(Can be replaced with a combined Bill's PC logo later.)

- [ ] **Step 5: Commit**

```bash
git add CLAUDE.md AGENTS.md README.md logo.svg
git commit -m "feat: add README, AGENTS.md, CLAUDE.md, and logo"
```

---

### Task 8: Final verification

- [ ] **Step 1: Verify directory structure matches spec**

```bash
find . -not -path './.git/*' -not -path '*/node_modules/*' | sort
```

Compare against the spec structure. Ensure all expected files exist.

- [ ] **Step 2: Verify no stale paths in skill files**

```bash
grep -rn 'references/' skills/ | grep -v CLAUDE_SKILL_DIR | grep -v '\.md:' || echo "OK: no stale reference paths"
grep -rn 'collection/' skills/ | grep -v CLAUDE_PLUGIN_DATA || echo "OK: no stale collection paths"
```

- [ ] **Step 3: Verify MCP bundle starts**

```bash
timeout 3 node mcp-servers/pokemon-tcg-coach/dist/bundle.js < /dev/null 2>&1; echo "exit: $?"
```

Expected: exit code 124 (timeout, meaning it started and waited for input). Any import/syntax errors would appear immediately.

- [ ] **Step 4: Run tests one final time**

```bash
cd mcp-servers/pokemon-tcg-coach && npm test
```

Expected: all tests pass.

- [ ] **Step 5: Verify plugin with Claude Code (if available)**

```bash
claude --plugin-dir . -p "What skills do you have available?"
```

Expected: should list both `pokemon-tcg-coach` and `pokemon-vgc-coach`.

- [ ] **Step 6: Final commit if any fixes were needed**

Only if steps 1-5 revealed issues that required fixes:

```bash
git add -A
git commit -m "fix: address verification issues"
```
