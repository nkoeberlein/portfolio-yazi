---
title: deploybar
summary: Internal release automation — one command from green CI to staged rollout across 40 services.
period: 2019 — 2021
role: Architect (platform team)
stack: [Python, Grafana, Argo CD, Slack API]
updated: 2026-02-18
featured: false
---

## Context

In 2019 a release took a human 45 minutes and 14 wiki steps. Deploys happened
on Tuesdays, in fear, in batches. This tool compressed the path to
`deploybar ship svc-foo --stage canary` — one command, observable, reversible.

## What it did

- **Pipeline as data**: release plans were declarative YAML reviewed like
  code, with required approvals expressed in the file, not in a ticket queue.
- **Canary analysis by metric, not by countdown**: rollouts advanced when
  error rate, saturation and latency stayed inside budget for the sample
  window — and auto-rolled back otherwise.
- **Chat as the control room**: every gate posted its evidence to Slack;
  approvals happened where people actually paid attention.

## Outcome

By 2021: release lead time 45 min → 3 min, deploys per week 6 → 190+, and —
the metric I care about — change-failure rate dropped from 12% to 1.8%.
Fear-based deploy calendars were quietly never reinstituted.