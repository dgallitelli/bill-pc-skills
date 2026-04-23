# Pokemon TCG Rules Reference

## Game Setup

- Deck: exactly 60 cards
- Max 4 copies of any card with the same name (except Basic Energy — unlimited)
- Shuffle deck, draw 7 cards as opening hand
- Must have at least 1 Basic Pokemon in opening hand; if not → reveal hand, shuffle, redraw (mulligan). Opponent may draw 1 extra card per mulligan
- Place 1 Basic Pokemon face-down as Active Pokemon
- Place up to 5 Basic Pokemon face-down on Bench
- Place top 6 cards of deck face-down as Prize cards
- Both players flip face-up simultaneously
- Flip coin (or equivalent) — winner chooses who goes first
- **First player cannot attack on their first turn** (but can do everything else)

## Turn Structure

Each turn follows this sequence:

1. **Draw** — Draw 1 card from deck (mandatory; if you cannot draw, you lose)
2. **Actions** (any order, any number of times unless restricted):
   - Attach 1 Energy card from hand to 1 of your Pokemon (once per turn)
   - Play Basic Pokemon from hand to Bench (up to 5 Bench Pokemon total)
   - Evolve Pokemon (play Stage 1 on matching Basic, Stage 2 on matching Stage 1)
   - Play Trainer cards:
     - **Item**: play any number per turn
     - **Supporter**: max 1 per turn
     - **Stadium**: max 1 per turn; replaces existing Stadium
     - **Tool**: attach to a Pokemon (usually 1 per Pokemon)
   - Use Abilities (unless blocked by an effect)
   - Retreat Active Pokemon (once per turn; pay Retreat Cost by discarding Energy from it, then swap with a Benched Pokemon)
3. **Attack** — Declare an attack if Active Pokemon has required Energy attached. **Attacking ends your turn.**

## Evolution Rules

- Cannot evolve a Pokemon the same turn it was played
- Cannot evolve a Pokemon the same turn it was already evolved
- Cannot evolve on your first turn of the game
- Stage 1 evolves from matching Basic; Stage 2 evolves from matching Stage 1
- Evolution removes Special Conditions and effects from the previous stage
- Rare Candy: play on Basic to evolve directly to Stage 2 (skipping Stage 1) — but not on first turn of play or same turn Basic was played
- "Evolves from" text on the card must match the name of the Pokemon it's placed on

## Card Types

### Pokemon Subtypes

| Subtype | Description | Prize cards given up when KO'd |
|---------|-------------|-------------------------------|
| Basic | Played directly from hand to Bench or Active | 1 |
| Stage 1 | Evolves from a specific Basic Pokemon | 1 |
| Stage 2 | Evolves from a specific Stage 1 Pokemon | 1 |
| Pokemon ex (lowercase) | Current gen high-HP, strong attacks | 2 |
| Tera ex | Pokemon ex with Terastallization; takes no Bench damage while Active | 2 |
| Pokemon V | Sword & Shield era; Basic with high HP | 2 |
| Pokemon VSTAR | Evolves from Pokemon V; has VSTAR Power (once per game) | 2 |
| Pokemon VMAX | Evolves from Pokemon V; Gigantamax/Dynamax | 3 |
| Radiant Pokemon | Special rarity; max 1 Radiant Pokemon per deck | 1 |
| Pokemon GX (Legacy) | Sun & Moon era; has GX attack (once per game) | 2 |

### Trainer Subtypes

| Subtype | Play limit | Placement | Notes |
|---------|-----------|-----------|-------|
| Item | Unlimited per turn | Discard after use | Includes Ace Spec (max 1 Ace Spec card per deck) |
| Supporter | 1 per turn | Discard after use | Represents a character helping you |
| Pokemon Tool | Unlimited per turn | Attach to a Pokemon | Stays on Pokemon until removed or KO'd; usually 1 per Pokemon |
| Stadium | 1 per turn | Stays in play | Both players can use; new Stadium discards old one; cannot play Stadium with same name as one already in play |

### Energy Types

| Basic Energy Types (unlimited copies in deck) |
|-----------------------------------------------|
| Grass, Fire, Water, Lightning, Psychic, Fighting, Darkness, Metal, Dragon*, Fairy*, Colorless* |

\* Dragon and Fairy Basic Energy exist in limited printings. Colorless has no dedicated Basic Energy — any Energy provides Colorless.

| Category | Deck limit | Notes |
|----------|-----------|-------|
| Basic Energy | Unlimited | Provides 1 energy of its type |
| Special Energy | Max 4 copies by name | Provides special effects and/or multiple types; read card text |

## Win Conditions

You win if ANY of these occur:

1. **Take all 6 Prize cards** — Take Prize card(s) each time you KO an opponent's Pokemon
2. **KO opponent's last Active Pokemon** — Opponent has no Benched Pokemon to promote
3. **Opponent cannot draw** — At the start of their turn, opponent's deck is empty

## Damage Calculation

Order of damage calculation:

1. **Base damage** — Number printed on the attack
2. **Modifiers** — Effects that add or subtract damage (attack text, Abilities, Tools, Stadium)
3. **Weakness** — If the attacking Pokemon's type matches the Defending Pokemon's Weakness: **x2 damage** (applied to total after modifiers)
4. **Resistance** — If the attacking Pokemon's type matches the Defending Pokemon's Resistance: **-30 damage** (applied after Weakness)
5. Damage cannot go below 0
6. **Damage counters**: 1 damage counter = 10 damage. Place counters on the Defending Pokemon

### Weakness/Resistance Notes

- Weakness and Resistance are printed on the Defending Pokemon's card
- Not all Pokemon have Weakness or Resistance
- A Pokemon can have only 1 Weakness and 1 Resistance (as printed)

## Special Conditions

Special Conditions only affect the **Active Pokemon**. Moving to the Bench cures all Special Conditions. Evolving cures all Special Conditions.

| Condition | Effect | Turn marker | Cure |
|-----------|--------|-------------|------|
| **Poisoned** | Between turns: place 1 damage counter (10 damage) | None — continuous | Retreat, evolve, move to Bench, or card effect |
| **Burned** | Between turns: flip coin. Tails = place 2 damage counters (20 damage). Heads = no damage | Burn marker on Pokemon | Retreat, evolve, move to Bench, or card effect |
| **Asleep** | Cannot attack or retreat. Between turns: flip coin. Heads = wake up. Tails = stay Asleep | Turn Pokemon sideways | Wake up via coin flip, retreat (via card effect that ignores Sleep), evolve, move to Bench, or card effect |
| **Paralyzed** | Cannot attack or retreat until end of opponent's next turn | Turn Pokemon sideways | Cured automatically at end of next opponent's turn, evolve, move to Bench, or card effect |
| **Confused** | When attacking: flip coin. Tails = place 3 damage counters on itself (30 damage) and attack does nothing. Heads = attack normally | Turn Pokemon upside-down | Retreat, evolve, move to Bench, or card effect |

### Special Condition Stacking Rules

- Poisoned, Burned, and Confused can all apply simultaneously
- Asleep and Paralyzed **replace each other** (a Pokemon cannot be both)
- Asleep and Paralyzed also **replace Confused** (and vice versa, Confused replaces Asleep/Paralyzed)
- Summary: A Pokemon can be Poisoned + Burned + one of {Asleep, Paralyzed, Confused}

## Between-Turn Check Sequence

After each player's turn ends and before the next player's turn begins, resolve in this order:

1. **Poison** — Place 1 damage counter on each Poisoned Pokemon (more if an effect increases Poison damage)
2. **Burn** — For each Burned Pokemon: flip coin. Tails = place 2 damage counters
3. **Asleep** — For each Asleep Pokemon: flip coin. Heads = Pokemon wakes up
4. **Check KOs** — Any Pokemon with damage >= HP is Knocked Out. Owner places it and attached cards in discard. Opponent takes Prize card(s). If Active was KO'd, owner promotes a Benched Pokemon

## Retreat

- Once per turn, you may retreat your Active Pokemon
- Pay the Retreat Cost by discarding that many Energy cards attached to the retreating Pokemon (any type counts)
- Swap with a Benched Pokemon of your choice
- A Pokemon with Retreat Cost 0 retreats for free
- **Cannot retreat if Asleep or Paralyzed** (unless a card effect allows it)
- Switch/Escape effects from Trainer cards do NOT count as retreating (no Energy cost, bypass Asleep/Paralyzed)

## Bench

- Maximum 5 Pokemon on the Bench (unless a card effect changes this)
- Some attacks/Abilities deal damage to Benched Pokemon — this damage is NOT affected by Weakness or Resistance
- You must always have an Active Pokemon. If your Active is KO'd or moved, promote a Benched Pokemon immediately
