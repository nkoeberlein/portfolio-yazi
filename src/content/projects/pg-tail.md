---
title: pg-tail
summary: Postgres observability tooling — query fingerprints, lock graphs and a p99 budget per service.
period: 2021 — 2022
role: Initiator & lead
stack: [Go, Postgres, ClickHouse, Grafana]
repo: https://github.com/mustermann/pg-tail
updated: 2026-04-02
featured: false
---

## Why

"Our database is slow" is not a bug report. `pg-tail` fingerprints queries at
the proxy layer (normalized via `pg_stat_statements`-style hashing), streams
them into ClickHouse, and derives per-service latency budgets. When a budget
burns, the on-call gets the query family, the plan regression, and the
suspected deploy — in one page.

## Parts

- **Fingerprinting** normalizes literals and IN-lists so that 10k distinct
  queries collapse into ~400 query families. The reduction is where all the
  value is.
- **Lock graphs** captured from `pg_locks` sampling, rendered as
  who-blocks-whom trees — the fastest way to explain a deadlock to the
  owning team.
- **Budgets as config**: each service declares `p99 < 40 ms` per query
  family; the dashboard colors against the budget, not against the average.

## Legacy

The fingerprinting approach later moved into the company's standard
observability platform. pg-tail itself remains a lean open-source tool —
~600 stars, maintained by others now, which counts as a success.