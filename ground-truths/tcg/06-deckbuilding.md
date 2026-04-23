# Ground Truth: Deckbuilding Help

## Prompt
"Help me build a deck around Gardevoir ex"

## Expected Tool Calls
`card-search` for Gardevoir evolution line and support cards

## Expected File Reads
`references/deckbuilding-strategy.md`

## Expected Answer Characteristics
- Asks what format (Standard/Expanded) if not specified
- Proposes a full 60-card decklist in PTCGL format
- Explains the game plan (energy acceleration via Psychic Embrace)
- Lists core cards with reasoning for each inclusion
- Mentions flexible slots and meta-dependent choices
- Offers to save the deck
