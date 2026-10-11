---
title: feature-switch
summary: Type-safe feature-flag SDK for TypeScript services, with progressive rollouts baked in.
period: 2022 — 2023
role: Tech lead (team of 5)
stack: [TypeScript, Node.js, OpenFeature, Postgres]
updated: 2026-06-20
featured: false
---

## Context

Internal product at a company of ~180 engineers. The previous flag system was
a config store with stringly-typed keys and no audit history. After one
misconfigured rollout took checkout down for 40 minutes, we built a
replacement.

## What I drove

- **Typed flags as code**: flag definitions are versioned in the service
  repo, validated at build time, and unknown keys are compile errors. No more
  `if (flags.checkout_v2_new_api === "true")`.
- **Progressive rollout rules** (percentage, user cohort, region) evaluated
  locally with a snapshot — evaluation is a local function call, not a
  network hop. Sub-µs after warm-up, zero flapping.
- **Expose events** wired into OpenFeature so experiments produce usable
  analysis data instead of anecdote.

## Outcome

- Rollout incidents attributable to flags: 40 minutes of downtime per year → 0 in 18 months
- Flag hygiene: 9,400 flags → 1,100 (TTLs enforced, stale flags flagged in CI)
- SDK open-sourced internally across the org group; three other companies adopted the approach

The interesting part was the sociotechnical one: flags that are cheap to
create get deleted, so we made creation annoying — a PR with a TTL field.