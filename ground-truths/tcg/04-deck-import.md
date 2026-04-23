# Ground Truth: Deck Import

## Prompt
User pastes a PTCGL decklist and says "Save this as my Charizard deck"

## Expected Tool Calls
`deck-save` with name="Charizard deck" and the pasted decklist

## Expected File Reads
None.

## Expected Answer Characteristics
- Confirms the deck was saved with filename
- Reports card count breakdown (Pokemon/Trainer/Energy)
- Offers to analyze the deck's strategy or suggest improvements
