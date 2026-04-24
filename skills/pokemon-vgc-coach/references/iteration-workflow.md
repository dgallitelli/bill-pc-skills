# Team Iteration & Improvement Workflow

## The Improvement Loop

Competitive Pokemon improvement follows a cycle. This document outlines how to guide users through continuous team and skill improvement.

```
Build → Test → Analyze → Adjust → Repeat
```

## Phase 1: Initial Testing (First 10-20 Games)

### What to Track
Ask the user to note after each game:
1. **Which 4 Pokemon did you bring?** (and which 2 stayed in the back)
2. **What were your leads?**
3. **Did you win or lose?**
4. **What was the opponent's team archetype?** (Rain, Sun, Trick Room, Balance, etc.)
5. **Which Pokemon felt impactful?** Which felt like dead weight?
6. **Was there a moment where you wished you had a different move/Pokemon?**

### Red Flags to Watch For
- One Pokemon is never brought to games → Consider replacing it
- Consistently losing to the same archetype → Need a specific answer
- A Pokemon always gets KO'd before doing anything useful → Wrong leads or needs more bulk
- Running out of offensive pressure late game → Not enough attackers or win conditions
- Opponent's speed control always beats yours → Need better speed control options

## Phase 2: Metagame Adjustment (After 20+ Games)

### Checking the Meta
1. Fetch current Pikalytics data: `https://www.pikalytics.com/ai/pokedex/{format}`
2. Identify the top 10 most used Pokemon
3. For each: does the team have a clear answer?
4. Check tournament results on Limitless/Victory Road for trending team compositions

### Common Adjustments
- **Swap a move**: Sometimes one move change fixes a matchup (e.g., adding Taunt to beat Trick Room setters)
- **Adjust EV spread**: Shift EVs to survive a specific attack or outspeed a specific threat
- **Change Tera Type**: A different Tera Type can flip a bad matchup
- **Swap an item**: Choice Scarf instead of Life Orb to outspeed a new threat
- **Replace the 6th Pokemon**: The "Sixth Pokemon Syndrome" — the last slot is often the most flexible

### When to Make Big Changes vs Small Tweaks
**Small tweaks** (keep the core, adjust details):
- Losing close games that could go either way
- One specific matchup is problematic but the rest are fine
- A Pokemon is good but its set isn't optimized

**Big changes** (rethink the core):
- Losing to the 3 most popular team archetypes
- The core idea doesn't work in practice the way it did in theory
- Multiple Pokemon feel like dead weight regularly
- Your spread moves keep hitting your own partner (team has a structural friendly-fire problem)
- You realize the team is a collection of good Pokemon without a unifying game plan — consider: what is this team's *thesis*? How does it win? If you can't articulate it in one sentence, the team may lack cohesion

## Phase 3: Advanced Optimization

### EV Spread Optimization (The Benchmark Method)

Once the team is tested and benchmarks are identified through gameplay:

1. **Speed tier first**:
   - Identify specific Pokemon to outspeed (check Pikalytics for common Speed investments)
   - Calculate minimum Speed EVs + Nature to reach the target stat
   - Consider speed creep: invest 4-12 extra EVs to beat opponents at the same tier
   - For Trick Room attackers: 0 Speed EVs, 0 Speed IV, -Speed nature

2. **Defensive benchmarks**:
   - "I need to survive [specific attack from specific Pokemon]"
   - Use damage calculator to find minimum HP + Def/SpD investment
   - The 15/16 rule: surviving 15 of 16 damage rolls (93.75%) is often sufficient
   - Account for chip damage sources (Fake Out, weather, recoil, Life Orb chip)

3. **Offensive benchmarks**:
   - "I need to guarantee KO on [specific Pokemon with specific spread]"
   - Calculate minimum Atk/SpA investment for OHKO or 2HKO
   - Consider: does the benchmark change with Helping Hand, weather, or terrain?

4. **Leftover EV allocation** (in priority order):
   - HP is the most efficient general bulk investment (improves both sides)
   - Odd HP numbers are superior (Life Orb recoil, weather chip rounds down)
   - Defense vs Special Defense: invest in whichever covers more meta threats
   - Nature should boost your highest post-EV stat for maximum value

**Tools**: Pokemon Showdown Damage Calculator (calc.pokemonshowdown.com), Victory Road Calculator (calc.victoryroad.es), Nimbasa City Post Calculator (Champions-specific)

### Lead Optimization
Help the user develop a "lead sheet" — a reference for which leads to use against common teams:

```
vs Rain (Pelipper + Swift Swim):  Lead Pokemon A + Pokemon B, bring C and D
vs Sun (Torkoal + Chlorophyll):   Lead Pokemon A + Pokemon C, bring B and E
vs Trick Room:                     Lead Pokemon B + Pokemon D, bring A and F
vs Balance/Goodstuff:              Lead Pokemon A + Pokemon D, bring B and C
```

### Game Plan Development
For each common matchup, define:
1. **Win condition**: How does this team actually win this matchup?
2. **Threats to manage**: Which opposing Pokemon are the biggest problems?
3. **Turn 1 plan**: What's the ideal first turn?
4. **Backup plan**: If turn 1 doesn't go as planned, what's plan B?

## Phase 4: Tournament Preparation

### Best of 3 Adjustments
- In Bo3, opponents adapt. Have multiple game plans.
- Consider: what will the opponent change after Game 1?
- "Reverse leads" — if you led A+B in Game 1, consider C+D in Game 2
- Surprise factor diminishes after Game 1 in Open Teamsheet

### Mental Game
- Don't tilt after a loss — analyze what went wrong, not how unlucky you were
- Take breaks between sets if allowed
- Focus on making the best decision each turn, not on the outcome
- Accept that some games are lost to variance (crits, misses, speed ties)

### Pre-Tournament Checklist
- [ ] Played 50+ games with the team
- [ ] Have a lead sheet for top 5 matchups
- [ ] Know the team's worst matchup and have a plan for it
- [ ] Practiced Bo3 sets (not just Bo1 ladder)
- [ ] Team is legal for the tournament's regulation
- [ ] Backup team ready in case of last-minute meta shifts

## Tracking Progress Over Time

### Metrics to Monitor
- **Win rate overall**: Trending up over time?
- **Win rate vs specific archetypes**: Improving against problem matchups?
- **Games where the "right" play was made**: Even in losses, were decisions sound?
- **Ladder rating**: Climbing over time? (But don't obsess over this)

### When to Scrap a Team
- Win rate below 40% after 30+ games with no improvement trend
- The metagame has shifted and the team's core idea is no longer viable
- You're not having fun with it (this matters more than people think)
- A new regulation drops that changes the legal Pokemon

### Growth Mindset Reminders
From Wolfe Glick: "I've been playing for 15 years, won the World Championships, won more tournaments than any other player in history, and I don't feel like I've reached my peak yet."

- There is no known skill ceiling in Pokemon
- Every loss teaches something if you're willing to learn
- Working with other players accelerates improvement
- Focus on improving, not on results — results follow improvement
- It's okay to use other people's teams while learning
- Teambuilding is a muscle — it gets easier with practice
