---
title: Merging is a design activity
summary: Code review gets all the attention, but the merge strategy is where architectures are actually decided. Notes from 200+ merges.
published: 2025-06-15
tags: [craft, architecture, engineering-leadership]
---

We treat merging as logistics. It is not — every merge is a small
architectural decision, made at the moment of least supervision.

## The merge is the design doc nobody reads

A PR describes an intent. The merge installs the decision. After the merge,
the intent is gone; only the decision remains in `main`. That's why "I'll
clean it up later" merges are design decisions made without a designer: they
install interfaces, naming, and dependency direction — the three things that
are expensive to revisit.

## Three practices that changed our codebase

**1. Merge criteria, not review criteria.**
We stopped discussing style in review and wrote 6 merge criteria instead:
*no new shared mutable state · no downward dependency (child imports
parent) · errors are values at boundaries · interfaces are closed unless
two callers exist · tests describe behavior, not implementation · a stranger
can ship from this branch.* Review became 60% faster because taste stopped
masquerading as gatekeeping.

**2. Small is a merge property, not a review property.**
If a PR has three logical changes, it will merge as an architectural commit.
We enforce one-logical-change-per-merge CI-side (file-touch heuristics,
then a human). Big merges stopped being how drift happens.

**3. The merge owner is named.**
Every merged PR has exactly one accountable engineer. When, six months
later, we ask "why does this exist?", an owner answers — not "the team".

## The uncomfortable part

This makes merges slower for big changes and faster for small ones, which is
an honest trade. It also means saying no at the merge point is a design
contribution — reviewers are doing architecture, not clerical work. Pay them
accordingly: the merge queue is the most senior conversation in the repo.