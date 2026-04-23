# Ground Truth: Deck Completion

## Prompt
"What do I need to complete this deck?" (followed by a PTCGL decklist)

## Expected Tool Calls
`deck-diff` with the provided decklist

## Expected File Reads
None.

## Expected Answer Characteristics
- Shows which cards the user already owns (with checkmarks)
- Lists missing cards with deficit counts
- Groups missing cards by set
- Suggests whether to buy singles or specific products
- Mentions total estimated cost if possible
