---
title: Ship the boring stuff — platform teams that pay rent
summary: Platform work is only valued when it deletes work from other teams. What I look for before building anything "helpful".
published: 2026-08-20
tags: [platform, org, engineering-leadership]
---

Every platform team eventually ships something nobody asked for. Here is the
lens I use to keep that from happening — five questions, asked in this order,
before a single line of platform code gets written.

## 1. What work does this delete?

Not "reduce" — *delete*. If the answer is "engineers will fill in a nicer
form instead of the old form", we are moving friction, not removing it. A
platform feature earns its place when a person, a ticket, or a standing
meeting disappears. I keep a literal deletion list per quarter; features that
can't name deletions don't get built.

## 2. Who is on call for it?

If the platform team isn't paged for the thing it built, it isn't a product —
it's a favor that expires. Anything we ship gets a runbook, an SLO, and our
name on the pager rotation. This is also the fastest known cure for
overpromising: it is easy to demo a thing, hard to carry it at 3 a.m.

## 3. Is there a paved road or a bypass?

Bad platform work adds a second path that quietly forks the first. Good
platform work makes the paved road faster than the bypass — the migration is
completed by making the old way slower, in public, with a deletion date.

## 4. Would you bet a quarter on adoption?

Self-serve adoption is the only adoption metric that matters. A platform with
2 mandatory users and zero voluntary ones has negative equity: it creates the
rebellion it claims to prevent.

## 5. What is the boringest possible version?

Most platform products die of elegance. The boringest version that deletes
the work is right. The clever monorepo-aware distributed cache can wait.

---

The scorecard sounds negative, but it is really about leverage: a platform
team of 6 people should be a force multiplier for 300, and multipliers only
multiply when the base — the paved road — is genuinely faster. Everything
else is decoration with a changelog.