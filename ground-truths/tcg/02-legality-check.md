# Ground Truth: Legality Check

## Prompt
"Is Arceus VSTAR legal in Standard?"

## Expected Tool Calls
None (or `card-search` to confirm regulation mark).

## Expected File Reads
`references/format-legality.md`

## Expected Answer Characteristics
- Clear "No" — Arceus VSTAR has Regulation F (Brilliant Stars)
- Explains that current Standard requires Regulation G or newer
- Mentions the card IS legal in Expanded
- Does not guess — checks regulation mark against format definition
