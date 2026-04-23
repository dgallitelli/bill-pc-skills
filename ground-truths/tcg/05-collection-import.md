# Ground Truth: Collection Import

## Prompt
"Add these cards to my collection:
2 Charizard ex SVI 234
4 Professor's Research SVI 189
4 Basic Fire Energy SVE 2"

## Expected Tool Calls
`collection-import` with the card list

## Expected File Reads
None.

## Expected Answer Characteristics
- Confirms cards were added to collection
- Reports count of new vs updated entries
- Mentions what was added by category
