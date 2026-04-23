# Ground Truth: Card Search

## Prompt
"Find all Dragon-type Pokemon ex in Standard"

## Expected Tool Calls
`card-search` with: type=Dragon, category=pokemon, standard_legal=true

## Expected File Reads
None.

## Expected Answer Characteristics
- Returns a list of Dragon-type Pokemon ex with details
- Each card shows: name, set, HP, attacks, regulation mark
- All results should have regulation mark G or H
- If no results, says so clearly
