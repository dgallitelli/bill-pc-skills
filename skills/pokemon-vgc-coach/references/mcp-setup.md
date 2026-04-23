# MCP Server Setup for Pokemon VGC Tools

## Pokemon VGC Damage Calculator MCP Server

There's a community-built MCP server that wraps the @smogon/calc damage calculation library, giving you programmatic damage calculations directly in your AI workflow.

### Prerequisites
- Node.js 18+
- npm

### Installation

Add this to your `.kiro/settings/mcp.json` (workspace level) or `~/.kiro/settings/mcp.json` (global):

```json
{
  "mcpServers": {
    "pokemon-vgc-calc": {
      "command": "npx",
      "args": ["pokemon-vgc-calc-mcp"],
      "env": {},
      "disabled": false,
      "autoApprove": ["calculateDamage"]
    }
  }
}
```

### Available Tool: calculateDamage

Calculates battle damage between an attacking and defending Pokemon.

**Key inputs**:
- `attacker`: Species, level, stats, ability, item, stat boosts
- `defender`: Species, level, stats, ability, item, stat boosts
- `move`: Move name and any special flags
- `field`: Game type (doubles), weather, terrain, side effects

**Output**: Damage range, KO probability, human-readable summary

### Example Usage
To check if Adamant 252 Atk Urshifu-Rapid-Strike's Close Combat KOs Incineroar:
- Set attacker to Urshifu-Rapid-Strike with 252 Atk EVs, Adamant nature
- Set defender to Incineroar with a common defensive spread
- Set move to Close Combat
- Set field gameType to "Doubles"

### When to Use
- Verifying if a Pokemon can KO a specific threat
- Comparing damage output between different EV spreads or items
- Checking if a Pokemon survives a specific attack
- Optimizing EV spreads to hit specific damage benchmarks

### Alternative: Manual Calculation Reference
If the MCP server isn't available, you can direct users to:
- Pokemon Showdown Calc: https://calc.pokemonshowdown.com
- Victory Road Calc: https://calc.victoryroad.es
- Nimbasa City Post Calc: https://nerd-of-now.github.io/NCP-VGC-Damage-Calculator/
- Porygon Labs: https://www.porygonlabs.com
