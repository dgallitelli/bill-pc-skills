# Contributing to Bill's PC Skills

Thanks for your interest in contributing! This guide covers how to set up the project, make changes, and submit them.

## Setup

```bash
git clone https://github.com/dgallitelli/bill-pc-skills.git
cd bill-pc-skills

# Install MCP server dependencies (needed for tests and bundling)
cd mcp-servers/pokemon-tcg-coach
npm install
cd ../..
```

## Local Testing

Test the plugin locally in Claude Code:

```bash
claude --plugin-dir .
```

Use `/reload-plugins` inside the session to pick up changes without restarting.

## Making Changes

### Editing a skill

Skill definitions live in `skills/<skill-name>/SKILL.md`. Supporting reference files go in `skills/<skill-name>/references/`.

When referencing files from within SKILL.md, always use `${CLAUDE_SKILL_DIR}/references/...` — plain relative paths won't resolve correctly when the plugin is installed from the marketplace.

### Editing the MCP server

The TCG MCP server source is at `mcp-servers/pokemon-tcg-coach/src/`. After making changes:

```bash
cd mcp-servers/pokemon-tcg-coach

# Type check
npx tsc --noEmit

# Run tests
npm test

# Rebuild the bundle
npm run bundle
```

The `dist/bundle.js` file is the deployed artifact and **must be rebuilt and committed** with your changes. PRs that modify server source without updating the bundle will not work once installed.

### Adding a new skill

1. Create `skills/<skill-name>/SKILL.md` with frontmatter:
   ```yaml
   ---
   name: your-skill-name
   description: >
     When to use this skill and what it does.
     Triggers on: keyword1, keyword2, keyword3
   ---
   ```
2. Add a `references/` subdirectory for any supporting files
3. Reference files using `${CLAUDE_SKILL_DIR}/references/...`
4. Add the skill path to `.claude-plugin/marketplace.json` under `plugins[0].skills`
5. If the skill needs MCP tools, add a server directory under `mcp-servers/` and declare it in `.mcp.json`

### Adding MCP tools to an existing server

1. Create the tool definition and handler in `mcp-servers/pokemon-tcg-coach/src/tools/`
2. Register it in `src/index.ts`
3. Add tests in `src/__tests__/`
4. Run `npm test` and `npm run bundle`

## Testing

```bash
# From repo root
npm test         # Run MCP server tests
npm run typecheck  # Type check

# From MCP server directory
cd mcp-servers/pokemon-tcg-coach
npm test         # Same thing
npm run bundle   # Rebuild bundle after changes
```

## Commit Guidelines

- Use conventional commit prefixes: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`
- Keep commits focused — one logical change per commit
- Always rebuild and commit `dist/bundle.js` when server source changes

## Submitting Changes

1. Fork the repo and create a feature branch
2. Make your changes following the guidelines above
3. Ensure tests pass and the bundle is up to date
4. Open a pull request with a clear description of what changed and why
