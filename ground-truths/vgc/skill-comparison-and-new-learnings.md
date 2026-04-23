# Comparison: Raw Stream Extraction vs Existing Skill

## Method
1. Extracted 15 patterns ONLY from `aiming-for-champions.md` (see `wolfey-raw-extraction.md`)
2. Compared each pattern against SKILL.md (root and .kiro/skills/ — identical files)
3. Classified as: ALREADY COVERED, PARTIALLY COVERED, or GENUINELY NEW

---

## ALREADY COVERED BY SKILL.MD

### Pattern 4 (Item Scarcity)
- **Raw observation:** Wolfey goes through items by elimination, settles on Leftovers for Archaludon
- **Skill coverage:** "Items are a constraint, not an afterthought — Especially in Pokemon Champions where the item pool is limited. Map out items early."
- **Verdict:** ✅ Well covered. The skill even uses the same Meganium team as an example.

### Pattern 8 (Star Can't Always Be Brought)
- **Raw observation:** "Against Sun, you can't bring Meganium. That's just the rule."
- **Skill coverage:** "In Champions, plan for matchups where your mega can't be brought" + backup mega guidance
- **Verdict:** ✅ Well covered, including the Kangaskhan backup example.

### Pattern 13 (Speed Control as Central Axis)
- **Raw observation:** Almost every game-deciding moment revolves around Tailwind timing
- **Skill coverage:** Extensive Speed Control section + "Maintain a consistent speed philosophy"
- **Verdict:** ✅ Well covered.

### Pattern 10 ("I just thought about what Meganium needed")
- **Raw observation:** Wolfey's one-sentence teambuilding philosophy
- **Skill coverage:** "Build around the core's weaknesses, not just its strengths" + Step 1 framework
- **Verdict:** ✅ Covered conceptually, though the exact quote isn't used.

---

## PARTIALLY COVERED — COULD BE STRENGTHENED

### Pattern 3 (Scouting Through "Passive" Plays)
- **Raw observation:** Wolfey explicitly narrates double-Protect as an information-gathering play, not a waste
- **Skill coverage:** Positioning Theory mentions "When to Protect: to scout the opponent's moves" — one bullet point
- **Gap:** The skill treats scouting as a minor Protect use case. The stream shows it as a DELIBERATE STRATEGY with specific goals (identify Choice locks, check for Protect, confirm items). The skill should elevate scouting from "one reason to Protect" to a first-class tactical concept, especially on Bo1 Closed Teamsheet ladder where information is scarce.
- **Suggested addition to skill:** A dedicated subsection under In-Battle Coaching about "Information Plays" — double Protect to scout Choice locks, confirming Scarf by speed order observation, tracking unseen Pokemon.

### Pattern 9 (Endgame Win Condition Tracking)
- **Raw observation:** Wolfey constantly calculates backwards: "Kangaskhan can always sucker punch Basculegion, but it's not in range right away. We need about 20% more damage."
- **Skill coverage:** Endgame Theory section exists but is brief (3 bullet points about speed advantage and numbers advantage)
- **Gap:** The skill doesn't capture the BACKWARDS CALCULATION pattern — working from "what kills what" to "what sequence of chip damage gets me there." Wolfey tracks recoil damage as a resource, calculates Sucker Punch range thresholds, and plans 2-3 turns ahead to set up guaranteed win conditions.
- **Suggested addition:** Expand Endgame Theory with: "Calculate backwards from the KO. If Sucker Punch needs the target at 30%, figure out what chip damage gets them there — recoil, spread move chip, weather damage. Plan the sequence, not just the current turn."

### Pattern 12 (Opponent Prediction)
- **Raw observation:** Wolfey makes EXPLICIT predictions before each turn: "I expect them to go for Tailwind plus Flip Turn" — then evaluates whether he was right
- **Skill coverage:** Turn-by-Turn Decision Making asks "What will my opponent likely do?" but doesn't emphasize making predictions EXPLICIT or tracking their accuracy
- **Gap:** The skill frames prediction as a question to ask yourself. The stream shows it as a PRACTICE — narrating predictions out loud, checking if they were right, and adjusting the mental model. This is a trainable skill, not just a checklist item.
- **Suggested addition:** Under Turn-by-Turn: "Make your prediction explicit before clicking. Say it out loud or write it down. After the turn, check: were you right? If not, what did you miss? This turns prediction from intuition into a trainable skill."

---

## GENUINELY NEW — NOT IN SKILL.MD AT ALL

### Pattern 1: Live Hot-Swapping (Change ONE Variable Between Games)
- **Raw observation:** Wolfey swaps Aegislash → Archaludon between games, tests, evaluates. Doesn't rebuild the whole team after a loss.
- **Skill gap:** Step 5 (Test and Iterate) says "What worked? What didn't? Which Pokemon felt dead weight? Refine the team." But it doesn't specify the GRANULARITY of changes. The stream shows a clear rule: change ONE thing, test it, evaluate. Not two things. Not a rebuild.
- **Why it matters:** Users who lose games tend to either change nothing or change everything. The "one variable" discipline is a concrete, actionable rule the skill should teach.
- **Suggested addition to Step 5:** "Change one thing at a time. If a Pokemon felt dead weight, swap it — but keep the rest of the team stable. If you change two things simultaneously, you can't tell which change helped or hurt. Wolfey swapped Aegislash for Archaludon after one loss, kept everything else, and immediately saw the improvement."

### Pattern 2: Team Preview Regret as a Learning Mechanism
- **Raw observation:** Wolfey develops matchup-specific bring rules THROUGH REGRET during live play. "I actually think I was supposed to bring Meganium here. I defaulted into Kangaskhan but Meganium is good into 5 of these Pokemon."
- **Skill gap:** The Team Preview Decision Framework is a rational 5-step process. It doesn't capture the EMOTIONAL/EXPERIENTIAL learning loop: make a bring decision → regret it mid-game → articulate why → update the rule for next time.
- **Why it matters:** The skill teaches Team Preview as a logical framework. But Wolfey's actual process is more like: intuition → play → regret → explicit rule. The regret is the learning signal. Users should be told it's NORMAL to regret Team Preview decisions and that the regret is data, not failure.
- **Suggested addition:** Under Team Preview: "You WILL make wrong bring decisions. That's normal and expected. The key is to articulate WHY it was wrong mid-game ('Meganium was good into 5/6 of their Pokemon — I shouldn't have let one bad matchup Pokemon scare me off'). Write it down. These regrets become your lead sheet over time."

### Pattern 5: Format-Transition Habits (Mega vs Tera Timing)
- **Raw observation:** "I should have mega. That's a bad habit. It's cuz in with Tera you always delay but with mega you don't delay."
- **Skill gap:** Not mentioned anywhere. The skill covers mega evolution and Tera as separate mechanics but doesn't warn about HABIT TRANSFER between formats.
- **Why it matters:** Many players switch between Champions and Scarlet/Violet. The muscle memory from one format creates errors in the other. This is a concrete, fixable problem.
- **Suggested addition to Gotchas:** "If you play both Champions and Scarlet/Violet, watch for habit transfer. In SV, you often delay Terastallization to hide information. In Champions, you usually want to Mega Evolve immediately (turn 1) because there's no information advantage in delaying — the opponent already knows your mega. Forgetting to mega evolve on turn 1 is a common format-switching mistake."

### Pattern 6: Emotional Regulation Pattern (Acknowledge → Diagnose → Act)
- **Raw observation:** After bad RNG or misplays, Wolfey follows a consistent pattern: "That's okay. It's okay." → "I was way too greedy. I should have protected." → "I think I need Archaludon" (converts to action). Never dwells, never blames RNG.
- **Skill gap:** The iteration-workflow.md reference mentions "Don't tilt after a loss — analyze what went wrong, not how unlucky you were" but this is a single bullet point. The SKILL.md itself has nothing about emotional management.
- **Why it matters:** Tilt is one of the biggest performance killers in competitive Pokemon. The skill teaches strategy but not the mental game. Wolfey's pattern is concrete and teachable.
- **Suggested addition to In-Battle Coaching:** "When something goes wrong (miss, crit, bad read), follow this pattern: (1) Acknowledge it briefly ('That's okay'), (2) Diagnose what happened ('I was too greedy — should have protected'), (3) Convert to action ('Next time I'm in this position, I protect'). Do NOT dwell on the RNG. The miss already happened. Your job is the next turn."

### Pattern 7: Lead Sheets Emerge From Play, Not Theory
- **Raw observation:** Wolfey doesn't start with a lead sheet. He develops one across 10+ games: "vs Charizard → Kang + Aero, vs Floette → Aero + Archaludon, vs Trick Room → must lead Meganium, vs Sun → Kang lead."
- **Skill gap:** The iteration-workflow.md reference mentions lead sheets as an optimization tool ("help the user develop a lead sheet"), but frames it as something you CREATE after testing. The stream shows it EMERGING organically from play.
- **Why it matters:** Users might think they need to figure out all their leads before playing. The stream shows the opposite: play first, and the lead sheet writes itself through experience.
- **Suggested addition to Step 5:** "Don't try to figure out all your leads before playing. Play 10-20 games and track which leads felt good and which felt bad against each archetype. Your lead sheet will emerge naturally. Wolfey's lead preferences evolved across a single stream session — he didn't have them pre-planned."

### Pattern 11: Honest Weakness Acknowledgment (Not Every Problem Is Solvable)
- **Raw observation:** "I don't really have answers for Trick Room" — he doesn't pretend the team handles everything. He names the weakness and accepts it.
- **Skill gap:** The skill's teambuilding framework implies you should solve every problem (Step 3: "What popular teams threaten this core? Add breadth"). It doesn't explicitly say "some weaknesses are acceptable — you can't cover everything."
- **Why it matters:** Users might feel their team is bad because it loses to Trick Room. The reality is that every team has bad matchups. The skill should normalize this.
- **Suggested addition to Step 3:** "You won't cover every matchup. Every team has a worst matchup. The goal is to minimize the number of auto-losses, not eliminate them. If your team is strong against 7/10 common archetypes and weak against 3, that's a good team. Name your bad matchups explicitly so you're not surprised when you face them."

### Pattern 14: Unexpected Items/Sets Proving Themselves Through Play
- **Raw observation:** Leftovers on Archaludon was chosen by elimination and initially mocked, but the Leftovers + Sturdy healing loop turned out to be game-winning across multiple matches.
- **Skill gap:** The skill says "Items are a constraint" but doesn't capture the phenomenon of ACCIDENTAL SYNERGY — where an item chosen by elimination turns out to have mechanical synergy you didn't plan for.
- **Why it matters:** This teaches humility about theorycrafting. Sometimes the "bad" item is actually great because of an interaction you didn't foresee. The only way to discover this is to play games.
- **Suggested addition to Step 5:** "Be open to surprises. Sometimes an item or set you chose reluctantly turns out to be the MVP. Wolfey chose Leftovers on Archaludon by elimination ('these are all garbage... I guess Leftovers') and it turned out to synergize perfectly with Sturdy, healing back above the threshold repeatedly. Theory can't predict everything — play reveals hidden synergies."

### Pattern 15: Knowing When to Abandon a Concept
- **Raw observation:** "I was trying to build a mega Crawdaunt team but it didn't get to a point where I felt comfortable with it."
- **Skill gap:** The skill never discusses WHEN TO GIVE UP on a team concept. It's all about building and iterating, never about recognizing a dead end.
- **Why it matters:** Users can spend hours on a concept that fundamentally doesn't work. Having permission to abandon it and go with what's proven is important.
- **Suggested addition to Step 5 or Gotchas:** "Not every team concept works. If after significant effort a team doesn't feel right, it's okay to shelve it and use something proven. Wolfey spent hours on a Mega Crawdaunt team, couldn't make it work, and went back to his Meganium team for the ladder climb. Knowing when to stop is a skill, not a failure."

---

## SUMMARY

| Category | Count | Patterns |
|----------|-------|----------|
| Already covered | 4 | Items as constraint, Star can't always be brought, Speed control, Build around core's needs |
| Partially covered (strengthen) | 3 | Scouting plays, Endgame backwards calculation, Explicit prediction practice |
| Genuinely new | 8 | One-variable iteration, Team Preview regret as learning, Format-transition habits, Emotional regulation, Lead sheets emerge from play, Honest weakness acknowledgment, Accidental synergy discovery, Knowing when to abandon |

The skill is strong on TEAMBUILDING THEORY but weak on LIVE PLAY MINDSET. The biggest gaps are all in the "how to actually improve through playing games" category — emotional management, iteration discipline, learning from regret, and accepting imperfection.
